/**
 * Tests API Route
 * GET /api/tests - Get all tests or a specific test by test_id
 */

import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export interface Test {
  id: number;
  test_id: string;
  title: string;
  description: string;
  icon_name: string;
  duration: string;
  featured: boolean;
  href: string;
  color_from: string;
  color_to: string;
  created_at: string;
  updated_at: string;
}

/**
 * GET handler for /api/tests
 * Query params:
 * - test_id: (optional) Get specific test by test_id
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("test_id");

    if (testId) {
      // Get specific test by test_id
      const test = await queryOne<Test>(
        "SELECT * FROM tests WHERE test_id = ?",
        [testId]
      );

      if (!test) {
        return NextResponse.json(
          { error: "Test not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ test });
    }

    // Get all tests
    const tests = await query<Test>("SELECT * FROM tests ORDER BY featured DESC, created_at ASC");

    return NextResponse.json({ tests });
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}
