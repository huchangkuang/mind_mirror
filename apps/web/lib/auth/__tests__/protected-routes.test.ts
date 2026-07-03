import { authEntryHref, isAuthRequiredPath } from "@/lib/auth/protected-routes";

describe("protected-routes", () => {
  it("isAuthRequiredPath matches /profile and children", () => {
    expect(isAuthRequiredPath("/profile")).toBe(true);
    expect(isAuthRequiredPath("/profile/settings")).toBe(true);
    expect(isAuthRequiredPath("/profiles")).toBe(false);
    expect(isAuthRequiredPath("/")).toBe(false);
    expect(isAuthRequiredPath("/feedback")).toBe(false);
  });

  it("authEntryHref encodes next", () => {
    expect(authEntryHref("/profile", "login")).toBe("/auth?next=%2Fprofile&mode=login");
    expect(authEntryHref("/profile?tab=1", "register")).toBe(
      "/auth?next=%2Fprofile%3Ftab%3D1&mode=register"
    );
  });
});
