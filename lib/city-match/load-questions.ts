import type { QuestionBank, CityMatchQuestion, DimensionWeights } from "./types";

const DEFAULT_BANK_PATH = "/data/city-match/questions.json";

/**
 * 从 API 或静态路径加载题库（客户端用 fetch）。
 * 返回带 meta 的完整题库，便于展示「共 N 题，预计 X 分钟」。
 */
export async function fetchQuestionBank(baseUrl = ""): Promise<QuestionBank> {
  const url = baseUrl ? `${baseUrl}${DEFAULT_BANK_PATH}` : DEFAULT_BANK_PATH;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load question bank: ${res.status}`);
  const data = await res.json();
  return validateQuestionBank(data);
}

/**
 * 服务端从文件系统读取题库（用于 API Route）。
 */
export async function loadQuestionBankFromFile(): Promise<QuestionBank> {
  const path = await import("path");
  const fs = await import("fs/promises");
  const filePath = path.join(process.cwd(), "data", "city-match", "questions.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as unknown;
  return validateQuestionBank(data);
}

export function validateQuestionBank(data: unknown): QuestionBank {
  if (!data || typeof data !== "object") throw new Error("Invalid question bank");
  const o = data as Record<string, unknown>;
  const meta = o.meta as Record<string, unknown> | undefined;
  const questions = Array.isArray(o.questions) ? o.questions : [];
  if (!meta || typeof meta.version !== "string" || typeof meta.questionCount !== "number" || typeof meta.estimatedMinutes !== "number") {
    throw new Error("Invalid question bank meta");
  }
  const questionCount = questions.length;
  return {
    meta: {
      version: meta.version as string,
      questionCount,
      estimatedMinutes: meta.estimatedMinutes as number,
    },
    questions: questions.map((q: unknown, i: number) => validateQuestion(q, i)),
  };
}

function validateQuestion(q: unknown, index: number): CityMatchQuestion {
  if (!q || typeof q !== "object") throw new Error(`Invalid question at index ${index}`);
  const o = q as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : `q${index + 1}`;
  const text = typeof o.text === "string" ? o.text : "";
  const options = Array.isArray(o.options) ? o.options : [];
  const parsedOptions = options.map((opt: unknown, j: number) => parseOption(opt, index, j));
  return { id, text, options: parsedOptions };
}

function parseOption(opt: unknown, qIndex: number, oIndex: number): import("./types").QuestionOption {
  if (!opt || typeof opt !== "object") throw new Error(`Invalid option at question ${qIndex} option ${oIndex}`);
  const o = opt as Record<string, unknown>;
  return {
    value: String(o.value ?? "?"),
    label: String(o.label ?? ""),
    dimensionWeights: parseDimensionWeights(o.dimensionWeights),
  };
}

function parseDimensionWeights(v: unknown): Partial<DimensionWeights> {
  if (!v || typeof v !== "object") return {};
  const o = v as Record<string, unknown>;
  const result: Partial<DimensionWeights> = {};
  if (typeof o.lifestyle === "number") result.lifestyle = o.lifestyle;
  if (typeof o.social === "number") result.social = o.social;
  if (typeof o.environment === "number") result.environment = o.environment;
  if (typeof o.pace === "number") result.pace = o.pace;
  return result;
}
