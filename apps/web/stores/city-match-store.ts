"use client";

import { create } from "zustand";
import type { CityMatchQuestion, CityMatchResult, DimensionScores } from "@/lib/city-match/types";
import type { QuestionBankMeta } from "@/lib/city-match/types";
import type { CityMatchTestMode } from "@/lib/city-match/types";
import { computeCityMatchResult } from "@/lib/city-match/scoring";
import { saveRecord, createHistoryRecord } from "@/lib/city-match/history-storage";

const STORAGE_KEY_PREFIX = "city-match-test-session";

function getStorageKey(mode: CityMatchTestMode): string {
  return `${STORAGE_KEY_PREFIX}:${mode}`;
}

interface CityMatchState {
  questions: CityMatchQuestion[];
  meta: QuestionBankMeta | null;
  mode: CityMatchTestMode;
  currentIndex: number;
  answers: Record<string, string>;
  result: CityMatchResult | null;
  isSubmitted: boolean;
  isLoading: boolean;
  error: string | null;

  setQuestions: (questions: CityMatchQuestion[], meta: QuestionBankMeta) => void;
  setMode: (mode: CityMatchTestMode) => void;
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
  mode: "quick" as CityMatchTestMode,
  currentIndex: 0,
  answers: {},
  result: null,
  isSubmitted: false,
  isLoading: false,
  error: null,
};

export const useCityMatchStore = create<CityMatchState>((set, get) => ({
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

  submit() {
    const { questions, answers, meta } = get();
    if (!questions.length) return;

    const result = computeCityMatchResult({ questions, answers });
    set({ result, isSubmitted: true });
    get().persist();

    // 保存到历史记录
    if (result.matches.length > 0) {
      const topCity = result.matches[0].city.name;
      saveRecord(createHistoryRecord(result.dimensionScores, topCity, meta?.version));
    }
  },

  reset() {
    const { mode } = get();
    set({ ...defaultState, mode });
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(getStorageKey(mode));
    }
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
      window.sessionStorage.setItem(getStorageKey(mode), JSON.stringify(payload));
    } catch {
      // ignore
    }
  },

  hydrate(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const { mode } = get();
      const raw = window.sessionStorage.getItem(getStorageKey(mode));
      if (!raw) return false;
      const data = JSON.parse(raw) as {
        v?: string;
        mode?: CityMatchTestMode;
        currentIndex?: number;
        answers?: Record<string, string>;
        isSubmitted?: boolean;
        result?: CityMatchResult;
        questionCount?: number;
      };
      const { meta, questions } = get();
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
