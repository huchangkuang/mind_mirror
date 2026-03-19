import type {
  QuestionBank,
  CityMatchQuestion,
  DimensionWeights,
  CityMatchTestMode,
  MultiModeQuestionBank,
} from "./types";

const DEFAULT_BANK_PATH = "/data/city-match/questions.json";
const DEFAULT_MODE: CityMatchTestMode = "quick";

/**
 * 从 API 或静态路径加载题库（客户端用 fetch）。
 * 返回带 meta 的完整题库，便于展示「共 N 题，预计 X 分钟」。
 */
export async function fetchQuestionBank(baseUrl = "", mode: CityMatchTestMode = DEFAULT_MODE): Promise<QuestionBank> {
  const url = baseUrl ? `${baseUrl}${DEFAULT_BANK_PATH}?mode=${mode}` : `${DEFAULT_BANK_PATH}?mode=${mode}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load question bank: ${res.status}`);
  const data = await res.json();
  return validateQuestionBank(data, mode);
}

/**
 * 服务端从文件系统读取题库（用于 API Route）。
 */
export async function loadQuestionBankFromFile(mode: CityMatchTestMode = DEFAULT_MODE): Promise<QuestionBank> {
  const path = await import("path");
  const fs = await import("fs/promises");
  const filePath = path.join(process.cwd(), "data", "city-match", "questions.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as unknown;
  return validateQuestionBank(data, mode);
}

export function validateQuestionBank(data: unknown, mode: CityMatchTestMode = DEFAULT_MODE): QuestionBank {
  if (!data || typeof data !== "object") throw new Error("Invalid question bank");
  const o = data as Record<string, unknown>;
  const meta = o.meta as Record<string, unknown> | undefined;
  if (!meta || typeof meta.version !== "string") {
    throw new Error("Invalid question bank meta");
  }

  const multiModeBank = parseMultiModeQuestionBank(o);
  if (multiModeBank) {
    const selectedMode = mode in multiModeBank.modes ? mode : DEFAULT_MODE;
    const modeData = multiModeBank.modes[selectedMode];
    return {
      meta: {
        version: multiModeBank.meta.version,
        questionCount: modeData.questions.length,
        estimatedMinutes: modeData.estimatedMinutes,
        mode: selectedMode,
      },
      questions: modeData.questions,
    };
  }

  const questions = Array.isArray(o.questions) ? o.questions : [];
  const estimatedMinutes = typeof meta.estimatedMinutes === "number" ? meta.estimatedMinutes : 5;
  const questionCount = questions.length;
  return {
    meta: {
      version: meta.version as string,
      questionCount,
      estimatedMinutes,
      mode,
    },
    questions: questions.map((q: unknown, i: number) => validateQuestion(q, i)),
  };
}

function parseMultiModeQuestionBank(o: Record<string, unknown>): MultiModeQuestionBank | null {
  const modesRaw = o.modes;
  const metaRaw = o.meta as Record<string, unknown> | undefined;
  if (!modesRaw || typeof modesRaw !== "object" || !metaRaw || typeof metaRaw.version !== "string") return null;

  const modesRecord = modesRaw as Record<string, unknown>;
  const quick = parseModeData(modesRecord.quick, "quick");
  const full = parseModeData(modesRecord.full, "full");
  if (!quick || !full) {
    throw new Error("Invalid modes in question bank");
  }

  return {
    meta: { version: metaRaw.version },
    modes: {
      quick,
      full,
    },
  };
}

function parseModeData(
  raw: unknown,
  mode: CityMatchTestMode
): Omit<QuestionBank["meta"], "version" | "mode"> & { questions: CityMatchQuestion[] } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const questions = Array.isArray(o.questions) ? o.questions : [];
  const estimatedMinutes = typeof o.estimatedMinutes === "number" ? o.estimatedMinutes : mode === "quick" ? 3 : 8;
  return {
    questionCount: questions.length,
    estimatedMinutes,
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
