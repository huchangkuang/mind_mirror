"use client";

import { create } from "zustand";
import type { MbtiQuestion } from "@/lib/mbti/types";
import type { MbtiResult } from "@/lib/mbti/scoring";
import { computeMbtiResult } from "@/lib/mbti/scoring";
import { saveRecord } from "@/lib/mbti/history-storage";

const STORAGE_KEY = "mbti-test-session";

export interface QuestionBankMeta {
  version: string;
  questionCount: number;
  estimatedMinutes: number;
}

interface MbtiState {
  questions: MbtiQuestion[];
  meta: QuestionBankMeta | null;
  currentIndex: number;
  answers: Record<string, string>;
  result: MbtiResult | null;
  isSubmitted: boolean;
  isLoading: boolean;
  error: string | null;

  setQuestions: (questions: MbtiQuestion[], meta: QuestionBankMeta) => void;
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
    set({ questions, meta, error: null });
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
    const result = computeMbtiResult({ questions, answers });
    set({ result, isSubmitted: true });
    get().persist();
    saveRecord({
      timestamp: Date.now(),
      type: result.type,
      dimensionStrength: result.dimensionStrength,
      version: meta?.version,
    });
  },

  reset() {
    set({ ...defaultState });
    if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
  },

  persist() {
    if (typeof window === "undefined") return;
    const { questions, meta, currentIndex, answers, isSubmitted, result } = get();
    const payload = {
      v: meta?.version,
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
      const data = JSON.parse(raw) as { v?: string; currentIndex?: number; answers?: Record<string, string>; isSubmitted?: boolean; result?: MbtiResult; questionCount?: number };
      const { meta, questions } = get();
      const versionMatch = !data.v || !meta?.version || data.v === meta.version;
      const countMatch = data.questionCount === questions.length;
      if (!versionMatch || !countMatch) return false;
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
