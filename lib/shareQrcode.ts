/**
 * 分享海报用：默认落地 URL 推导与二维码 PNG Data URL 生成。
 *
 * - `getDefaultShareUrlFromPageUrl` 为纯字符串逻辑，可在任意环境使用。
 * - `generateShareQrcodeDataUrl`、`generatePosterShareQrcodeDataUrl` 通过动态 `import('qrcode')`
 *   生成图像，依赖运行时与 `qrcode` 的渲染路径；请在**客户端**或带 `"use client"` 的组件中调用，
 *   勿在 React Server Component 中调用（避免打包/运行时问题）。
 */

export type ShareQrcodeOptions = {
  /** 图像宽度（像素），默认 256 */
  width?: number;
  /** 静默区模块数，默认 2 */
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
};

/**
 * 从完整页面 URL 推导「origin + pathname 第一段」作为默认分享落地（无 query/hash）。
 * @throws {TypeError} 非法 URL 字符串
 */
export function getDefaultShareUrlFromPageUrl(pageUrl: string): string {
  let url: URL;
  try {
    url = new URL(pageUrl);
  } catch {
    throw new TypeError(`Invalid page URL: ${JSON.stringify(pageUrl)}`);
  }
  const trimmed = url.pathname.replace(/^\/+|\/+$/g, "");
  const segments = trimmed ? trimmed.split("/") : [];
  const first = segments[0];
  if (!first) {
    return url.origin;
  }
  return `${url.origin}/${first}`;
}

/**
 * 将目标链接编码为 PNG Data URL，供 `<img>` 或 canvas 使用。
 */
export async function generateShareQrcodeDataUrl(
  targetUrl: string,
  options?: ShareQrcodeOptions,
): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  const width = options?.width ?? 256;
  const margin = options?.margin ?? 2;
  const errorCorrectionLevel = options?.errorCorrectionLevel ?? "M";
  return QRCode.toDataURL(targetUrl, {
    width,
    margin,
    errorCorrectionLevel,
    type: "image/png",
  });
}

function resolveShareTargetUrl(explicitUrl: string | undefined | null, pageUrl: string): string {
  const trimmed = explicitUrl?.trim();
  if (trimmed) {
    return trimmed;
  }
  return getDefaultShareUrlFromPageUrl(pageUrl);
}

/**
 * 可选显式目标链接 + 页面 URL；显式非空时优先，否则按 `getDefaultShareUrlFromPageUrl(pageUrl)` 推导后再生成二维码。
 */
export async function generatePosterShareQrcodeDataUrl(
  explicitTargetUrl: string | undefined | null,
  pageUrl: string,
  options?: ShareQrcodeOptions,
): Promise<string> {
  const target = resolveShareTargetUrl(explicitTargetUrl, pageUrl);
  return generateShareQrcodeDataUrl(target, options);
}
