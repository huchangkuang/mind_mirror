/**
 * Test History API Route
 * GET /api/history - Get test history (optionally filtered by test_id)
 * POST /api/history - Save a new test result
 * DELETE /api/history?id={id} - Delete a specific history record
 * DELETE /api/history - Clear all history records
 */

import { NextResponse } from "next/server";
import { query, queryOne, insert, execute } from "@/lib/db";

export interface HistoryRecord {
  id: number;
  test_id: string;
  title: string;
  result: unknown;
  result_summary: string;
  created_at: string;
}

export interface CreateHistoryRequest {
  test_id: string;
  result: unknown;
  result_summary?: string;
}

/**
 * GET handler for /api/history
 * Query params:
 * - test_id: (optional) Filter by test_id
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("test_id");

    let sql = `
      SELECT 
        h.id,
        h.test_id,
        t.title,
        h.result,
        h.result_summary,
        h.created_at
      FROM test_history h
      JOIN tests t ON h.test_id = t.test_id
    `;
    const params: string[] = [];

    if (testId) {
      sql += " WHERE h.test_id = ?";
      params.push(testId);
    }

    sql += " ORDER BY h.created_at DESC";

    const history = await query<HistoryRecord>(sql, params);

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/history
 * Save a new test result
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateHistoryRequest;

    // Validate required fields
    if (!body.test_id || !body.result) {
      return NextResponse.json(
        { error: "Missing required fields: test_id, result" },
        { status: 400 }
      );
    }

    // Validate test_id exists
    const test = await queryOne<{ test_id: string }>(
      "SELECT test_id FROM tests WHERE test_id = ?",
      [body.test_id]
    );

    if (!test) {
      return NextResponse.json(
        { error: "Invalid test_id" },
        { status: 400 }
      );
    }

    // Insert history record
    const insertId = await insert(
      "INSERT INTO test_history (test_id, result, result_summary) VALUES (?, ?, ?)",
      [body.test_id, JSON.stringify(body.result), body.result_summary || null]
    );

    // Fetch the created record
    const record = await queryOne<HistoryRecord>(
      `
        SELECT 
          h.id,
          h.test_id,
          t.title,
          h.result,
          h.result_summary,
          h.created_at
        FROM test_history h
        JOIN tests t ON h.test_id = t.test_id
        WHERE h.id = ?
      `,
      [insertId.toString()]
    );

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Error saving history:", error);
    return NextResponse.json(
      { error: "Failed to save history" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for /api/history
 * - Delete specific record by id: DELETE /api/history?id={id}
 * - Clear all records: DELETE /api/history
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Delete specific record
      const affectedRows = await execute(
        "DELETE FROM test_history WHERE id = ?",
        [id]
      );

      if (affectedRows === 0) {
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: "Record deleted successfully" });
    }

    // Clear all records
    const affectedRows = await execute("DELETE FROM test_history");

    return NextResponse.json({
      message: "All history cleared",
      deletedCount: affectedRows,
    });
  } catch (error) {
    console.error("Error deleting history:", error);
    return NextResponse.json(
      { error: "Failed to delete history" },
      { status: 500 }
    );
  }
}
