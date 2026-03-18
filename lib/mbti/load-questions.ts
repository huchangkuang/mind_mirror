import type { QuestionBank, MbtiQuestion } from "./types";
import type { DimensionWeights } from "./types";

const DEFAULT_BANK_PATH = "/data/mbti/questions.json";

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
  const filePath = path.join(process.cwd(), "data", "mbti", "questions.json");
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

function validateQuestion(q: unknown, index: number): MbtiQuestion {
  if (!q || typeof q !== "object") throw new Error(`Invalid question at index ${index}`);
  const o = q as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : `q${index + 1}`;
  const text = typeof o.text === "string" ? o.text : "";
  const options = Array.isArray(o.options) ? o.options : [];
  const dimensionWeights = parseDimensionWeights(o.dimensionWeights);
  const parsedOptions = options.map((opt: unknown, j: number) => parseOption(opt, index, j));
  const base: MbtiQuestion = { id, text, options: parsedOptions, dimensionWeights };
  if (o.category != null) base.category = String(o.category);
  if (Array.isArray(o.tags)) base.tags = [...o.tags] as string[];
  return base;
}

function parseDimensionWeights(v: unknown): DimensionWeights {
  if (!v || typeof v !== "object") return { EI: 0, SN: 0, TF: 0, JP: 0 };
  const o = v as Record<string, unknown>;
  return {
    EI: Number(o.EI) || 0,
    SN: Number(o.SN) || 0,
    TF: Number(o.TF) || 0,
    JP: Number(o.JP) || 0,
  };
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
