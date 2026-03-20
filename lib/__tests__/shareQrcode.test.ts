import {
  generatePosterShareQrcodeDataUrl,
  generateShareQrcodeDataUrl,
  getDefaultShareUrlFromPageUrl,
} from "../shareQrcode";

describe("getDefaultShareUrlFromPageUrl", () => {
  it("uses origin plus first path segment and drops query", () => {
    expect(
      getDefaultShareUrlFromPageUrl("http://39.102.102.50:3000/mbti/test?mode=deep"),
    ).toBe("http://39.102.102.50:3000/mbti");
  });

  it("handles single-segment path", () => {
    expect(getDefaultShareUrlFromPageUrl("https://example.com/mbti")).toBe("https://example.com/mbti");
  });

  it("returns origin only for root path", () => {
    expect(getDefaultShareUrlFromPageUrl("https://example.com/")).toBe("https://example.com");
    expect(getDefaultShareUrlFromPageUrl("https://example.com")).toBe("https://example.com");
  });

  it("uses first segment for deeper paths", () => {
    expect(getDefaultShareUrlFromPageUrl("http://host/app/foo/bar")).toBe("http://host/app");
  });

  it("throws on invalid URL", () => {
    expect(() => getDefaultShareUrlFromPageUrl("not a url")).toThrow(TypeError);
    expect(() => getDefaultShareUrlFromPageUrl("not a url")).toThrow(/Invalid page URL/);
  });
});

describe("generateShareQrcodeDataUrl", () => {
  it("returns a PNG data URL for a valid target", async () => {
    const dataUrl = await generateShareQrcodeDataUrl("https://example.com/mbti", { width: 120 });
    expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
    expect(dataUrl.length).toBeGreaterThan(100);
  });
});

describe("generatePosterShareQrcodeDataUrl", () => {
  it("prefers explicit target over default from page URL", async () => {
    const dataUrl = await generatePosterShareQrcodeDataUrl(
      "https://example.com/custom",
      "http://example.com/mbti/deep",
      { width: 80 },
    );
    expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("uses default from page URL when explicit is empty", async () => {
    const dataUrl = await generatePosterShareQrcodeDataUrl(
      undefined,
      "http://example.com/mbti/deep",
      { width: 80 },
    );
    expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
  });
});
