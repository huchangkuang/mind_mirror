/** @jest-environment jsdom */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server.node";
import { AuthStatusPanel } from "@/components/auth/AuthStatusPanel";
import { TestCompletionLoginPrompt } from "@/components/auth/TestCompletionLoginPrompt";

const mockAuthState = {
  status: "guest",
  user: null as { id: number; username: string } | null,
  logout: jest.fn(),
};

const mockPromptState = {
  shouldShowPrompt: true,
  isAuthLoading: false,
};

jest.mock("@/stores/auth-store", () => ({
  useAuthStore: (selector: (state: typeof mockAuthState) => unknown) => selector(mockAuthState),
}));

jest.mock("@/hooks/use-test-completion-auth-prompt", () => ({
  useTestCompletionAuthPrompt: () => mockPromptState,
}));

jest.mock("next/link", () => {
  return function MockLink(props: { href: string; children: React.ReactNode; className?: string }) {
    return React.createElement("a", { href: props.href, className: props.className }, props.children);
  };
});

describe("auth UI components", () => {
  beforeEach(() => {
    mockAuthState.status = "guest";
    mockAuthState.user = null;
    mockPromptState.shouldShowPrompt = true;
    mockPromptState.isAuthLoading = false;
  });

  it("AuthStatusPanel shows login link for guest", () => {
    const html = renderToStaticMarkup(React.createElement(AuthStatusPanel));
    expect(html).toContain("/auth");
    expect(html).toContain("登录 / 注册");
  });

  it("AuthStatusPanel shows username for authenticated user", () => {
    mockAuthState.status = "authenticated";
    mockAuthState.user = { id: 1, username: "alice" };
    const html = renderToStaticMarkup(React.createElement(AuthStatusPanel));
    expect(html).toContain("alice");
    expect(html).toContain("退出");
  });

  it("completion prompt appears only for guest", () => {
    const guestHtml = renderToStaticMarkup(
      React.createElement(TestCompletionLoginPrompt, { testName: "MBTI 测试" })
    );
    expect(guestHtml).toContain("登录后可长期保存测试数据");

    mockPromptState.shouldShowPrompt = false;
    const authHtml = renderToStaticMarkup(
      React.createElement(TestCompletionLoginPrompt, { testName: "MBTI 测试" })
    );
    expect(authHtml).toBe("");
  });
});
