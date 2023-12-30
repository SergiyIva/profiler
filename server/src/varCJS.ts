import { fileURLToPath } from "url";
import { dirname } from "path";

// если нужны эти константы, кот не были определены в ESM
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
