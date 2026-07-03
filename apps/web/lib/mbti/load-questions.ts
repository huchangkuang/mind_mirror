import type { QuestionBank, MbtiQuestion, MbtiTestMode } from "./types";
import type { DimensionWeights } from "./types";

const DEFAULT_BANK_PATH = "/data/mbti/questions.json";
const DEFAULT_MODE: MbtiTestMode = "quick";

/**
 * 从 API 或静态路径加载题库（客户端用 fetch）。
 * 返回带 meta 的完整题库，便于展示「共 N 题，预计 X 分钟」。
 */
export async function fetchQuestionBank(baseUrl = "", mode: MbtiTestMode = DEFAULT_MODE): Promise<QuestionBank> {
  const url = baseUrl ? `${baseUrl}${DEFAULT_BANK_PATH}?mode=${mode}` : `${DEFAULT_BANK_PATH}?mode=${mode}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load question bank: ${res.status}`);
  const data = await res.json();
  return validateQuestionBank(data, mode);
}

/**
 * 服务端从文件系统读取题库（用于 API Route）。
 */
export async function loadQuestionBankFromFile(mode: MbtiTestMode = DEFAULT_MODE): Promise<QuestionBank> {
  const { createRequire } = await import("module");
  const fs = await import("fs/promises");
  const path = await import("path");
  const require = createRequire(path.join(process.cwd(), "package.json"));
  const filePath = require.resolve("@mind-mirror/data/mbti/questions.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as unknown;
  return validateQuestionBank(data, mode);
}

export function validateQuestionBank(data: unknown, mode: MbtiTestMode = DEFAULT_MODE): QuestionBank {
  if (!data || typeof data !== "object") throw new Error("Invalid question bank");
  const o = data as Record<string, unknown>;
  const legacyMeta = o.meta as Record<string, unknown> | undefined;

  // New multi-mode format: { meta: { version }, modes: { quick, deep } }
  if (o.modes && typeof o.modes === "object") {
    const modes = o.modes as Record<string, unknown>;
    const selected = modes[mode] as Record<string, unknown> | undefined;
    if (!legacyMeta || typeof legacyMeta.version !== "string" || !selected) {
      throw new Error("Invalid multi-mode question bank");
    }
    const questions = Array.isArray(selected.questions) ? selected.questions : [];
    const estimatedMinutes = Number(selected.estimatedMinutes) || (mode === "deep" ? 12 : 8);
    return {
      meta: {
        version: legacyMeta.version as string,
        questionCount: questions.length,
        estimatedMinutes,
        mode,
        questionType: mode === "deep" ? "likert5" : "binary",
      },
      questions: questions.map((q: unknown, i: number) => validateQuestion(q, i)),
    };
  }

  // Legacy single-mode format.
  const questions = Array.isArray(o.questions) ? o.questions : [];
  if (!legacyMeta || typeof legacyMeta.version !== "string") {
    throw new Error("Invalid question bank meta");
  }

  const parsedQuestions = questions.map((q: unknown, i: number) => validateQuestion(q, i));
  const selectedQuestions = mode === "deep" ? buildDeepQuestions(parsedQuestions) : parsedQuestions;

  return {
    meta: {
      version: legacyMeta.version as string,
      questionCount: selectedQuestions.length,
      estimatedMinutes:
        typeof legacyMeta.estimatedMinutes === "number"
          ? mode === "deep"
            ? Math.max(legacyMeta.estimatedMinutes, 10)
            : legacyMeta.estimatedMinutes
          : mode === "deep"
            ? 10
            : 5,
      mode,
      questionType: mode === "deep" ? "likert5" : "binary",
    },
    questions: selectedQuestions,
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

function buildDeepQuestions(quickQuestions: MbtiQuestion[]): MbtiQuestion[] {
  return quickQuestions.map((q) => {
    const left = q.options.find((opt) => opt.value === "A") ?? q.options[0];
    const right = q.options.find((opt) => opt.value === "B") ?? q.options[1];
    const base = normalizeBaseWeights(left?.dimensionWeights ?? q.dimensionWeights);

    return {
      ...q,
      options: [
        buildLikertOption(1, "非常倾向左侧", base, 2),
        buildLikertOption(2, "比较倾向左侧", base, 1),
        buildLikertOption(3, "中立", base, 0),
        buildLikertOption(4, "比较倾向右侧", base, -1),
        buildLikertOption(5, "非常倾向右侧", base, -2),
      ],
      text: right?.label ? `${left?.label ?? q.text} / ${right.label}` : q.text,
      dimensionWeights: { EI: 0, SN: 0, TF: 0, JP: 0 },
    };
  });
}

function normalizeBaseWeights(weights: DimensionWeights): DimensionWeights {
  const normalized: DimensionWeights = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const key of ["EI", "SN", "TF", "JP"] as const) {
    if (weights[key] > 0) normalized[key] = 1;
    if (weights[key] < 0) normalized[key] = -1;
  }
  return normalized;
}

function buildLikertOption(
  value: number,
  label: string,
  base: DimensionWeights,
  factor: number
): import("./types").QuestionOption {
  return {
    value: String(value),
    label,
    dimensionWeights: {
      EI: base.EI * factor,
      SN: base.SN * factor,
      TF: base.TF * factor,
      JP: base.JP * factor,
    },
  };
}
