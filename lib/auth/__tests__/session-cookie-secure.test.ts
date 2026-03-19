import { isSessionCookieSecure } from "@/lib/auth/session";

const savedNodeEnv = process.env.NODE_ENV;
const hadCookieSecure = Object.prototype.hasOwnProperty.call(process.env, "COOKIE_SECURE");
const savedCookieSecure = process.env.COOKIE_SECURE;

describe("isSessionCookieSecure", () => {
  afterEach(() => {
    process.env.NODE_ENV = savedNodeEnv;
    if (hadCookieSecure) {
      process.env.COOKIE_SECURE = savedCookieSecure;
    } else {
      delete process.env.COOKIE_SECURE;
    }
  });

  it("returns false when COOKIE_SECURE is false in production", () => {
    process.env.NODE_ENV = "production";
    process.env.COOKIE_SECURE = "false";
    expect(isSessionCookieSecure()).toBe(false);
  });

  it("returns true when COOKIE_SECURE is true in development", () => {
    process.env.NODE_ENV = "development";
    process.env.COOKIE_SECURE = "true";
    expect(isSessionCookieSecure()).toBe(true);
  });

  it("defaults to secure in production when COOKIE_SECURE unset", () => {
    process.env.NODE_ENV = "production";
    delete process.env.COOKIE_SECURE;
    expect(isSessionCookieSecure()).toBe(true);
  });

  it("defaults to non-secure in development when COOKIE_SECURE unset", () => {
    process.env.NODE_ENV = "development";
    delete process.env.COOKIE_SECURE;
    expect(isSessionCookieSecure()).toBe(false);
  });
});
