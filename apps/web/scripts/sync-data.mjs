import { cpSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const webRoot = join(scriptDir, "..");
const dataPkgRoot = dirname(require.resolve("@mind-mirror/data/package.json"));
const publicData = join(webRoot, "public", "data");

rmSync(publicData, { recursive: true, force: true });
mkdirSync(publicData, { recursive: true });
cpSync(join(dataPkgRoot, "mbti"), join(publicData, "mbti"), { recursive: true });
cpSync(join(dataPkgRoot, "city-match"), join(publicData, "city-match"), { recursive: true });

console.log("[sync:data] copied @mind-mirror/data -> public/data");
