import { THEME_STORAGE_KEY } from "./constants";

/**
 * 与 `resolveEffectiveMode` / `readValidOverride` 行为一致的内联启动脚本（beforeInteractive）。
 * 键名须与 constants 保持同步。
 */
export const THEME_BOOT_SCRIPT = `(function(){var k=${JSON.stringify(THEME_STORAGE_KEY)};var r=document.documentElement;function s(){try{return window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){return false}}function e(){try{var x=localStorage.getItem(k);if(x){var o=JSON.parse(x);if(o&&typeof o.expiresAt==="number"&&(o.mode==="dark"||o.mode==="light")){if(Date.now()<=o.expiresAt)return o.mode;localStorage.removeItem(k)}}}catch(z){}return s()?"dark":"light"}var m=e();r.classList.toggle("dark",m==="dark")})();`;
