"use client";

import { create } from "zustand";
import type { MbtiQuestion, MbtiQuestionType, MbtiTestMode } from "@/lib/mbti/types";
import type { MbtiResult } from "@/lib/mbti/scoring";
import { saveRecord } from "@/lib/mbti/history-storage";
import { apiFetch, getApiErrorMessage, readJsonBody } from "@/lib/api/client";

const STORAGE_KEY = "mbti-test-session";

export interface QuestionBankMeta {
  version: string;
  questionCount: number;
  estimatedMinutes: number;
  mode: MbtiTestMode;
  questionType: MbtiQuestionType;
}

interface MbtiState {
  questions: MbtiQuestion[];
  meta: QuestionBankMeta | null;
  mode: MbtiTestMode;
  currentIndex: number;
  answers: Record<string, string>;
  result: MbtiResult | null;
  isSubmitted: boolean;
  isLoading: boolean;
  error: string | null;

  setQuestions: (questions: MbtiQuestion[], meta: QuestionBankMeta) => void;
  setMode: (mode: MbtiTestMode) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  answer: (questionId: string, value: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submit: () => void;
  reset: () => void;
  persist: () => void;
  hydrate: () => boolean;
}

const defaultState = {
  questions: [],
  meta: null,
  mode: "quick" as MbtiTestMode,
  currentIndex: 0,
  answers: {},
  result: null,
  isSubmitted: false,
  isLoading: false,
  error: null,
};

export const useMbtiStore = create<MbtiState>((set, get) => ({
  ...defaultState,

  setQuestions(questions, meta) {
    set({ questions, meta, mode: meta.mode, error: null });
    get().persist();
  },

  setMode(mode) {
    set({ mode });
    get().persist();
  },

  setLoading(isLoading) {
    set({ isLoading });
  },

  setError(error) {
    set({ error });
  },

  answer(questionId, value) {
    set((s) => ({ answers: { ...s.answers, [questionId]: value } }));
    get().persist();
  },

  nextQuestion() {
    const { questions, currentIndex } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
      get().persist();
    }
  },

  prevQuestion() {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
      get().persist();
    }
  },

  async submit() {
    const { questions, answers, meta, mode } = get();
    if (!questions.length) return;
    if (!meta) return;
    const payloadAnswers =
      mode === "deep"
        ? Object.fromEntries(
            Object.entries(answers).map(([key, value]) => [key, Number(value)])
          )
        : answers;
    const res = await apiFetch("/api/mbti/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: meta.version,
        mode,
        answers: payloadAnswers,
      }),
    });
    if (!res.ok) {
      const body = await readJsonBody<{ message?: string }>(res);
      throw new Error(getApiErrorMessage(body, "提交失败"));
    }
    const result = (await readJsonBody<MbtiResult>(res)) as MbtiResult | null;
    if (!result) {
      throw new Error("提交失败");
    }
    set({ result, isSubmitted: true, error: null });
    get().persist();
    await saveRecord({
      timestamp: Date.now(),
      type: result.type,
      dimensionStrength: result.dimensionStrength,
      version: meta?.version,
      mode,
    });
  },

  reset() {
    set({ ...defaultState });
    if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
  },

  persist() {
    if (typeof window === "undefined") return;
    const { questions, meta, mode, currentIndex, answers, isSubmitted, result } = get();
    const payload = {
      v: meta?.version,
      mode,
      currentIndex,
      answers,
      isSubmitted,
      result,
      questionCount: questions.length,
    };
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  },

  hydrate(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw) as { v?: string; mode?: MbtiTestMode; currentIndex?: number; answers?: Record<string, string>; isSubmitted?: boolean; result?: MbtiResult; questionCount?: number };
      const { meta, questions, mode } = get();
      const versionMatch = !data.v || !meta?.version || data.v === meta.version;
      const countMatch = data.questionCount === questions.length;
      const modeMatch = !data.mode || data.mode === mode;
      if (!versionMatch || !countMatch || !modeMatch) return false;
      set({
        currentIndex: Math.min(data.currentIndex ?? 0, Math.max(0, questions.length - 1)),
        answers: data.answers && typeof data.answers === "object" ? data.answers : {},
        isSubmitted: Boolean(data.isSubmitted),
        result: data.result ?? null,
      });
      return true;
    } catch {
      return false;
    }
  },
}));
