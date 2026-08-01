import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There is a stray package-lock.json in the home directory above this
  // project, and Turbopack would otherwise infer that as the workspace root.
  // Pin it to this folder so file resolution stays correct.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
