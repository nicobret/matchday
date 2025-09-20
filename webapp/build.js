#!/usr/bin/env bun
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";

// Load environment variables from .env
function loadEnv() {
  try {
    const envContent = readFileSync(".env", "utf-8");
    const env = {};
    envContent.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.trim().split("=");
      if (key && valueParts.length) {
        let value = valueParts.join("=").replace(/^["']|["']$/g, "");
        if (key.startsWith("VITE_")) env[key] = value;
      }
    });
    return env;
  } catch {
    return {};
  }
}

// Copy public directory to dist
function copyPublic() {
  if (!existsSync("public")) return;

  function copyRecursive(src, dest) {
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

    readdirSync(src, { withFileTypes: true }).forEach((entry) => {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);

      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    });
  }

  copyRecursive("public", "dist");
}

// Process HTML template
function processHTML() {
  let html = readFileSync("index.html", "utf-8");

  // Add CSS
  html = html.replace(
    "</head>",
    '  <link rel="stylesheet" href="/index.css">\n</head>',
  );

  // Update script to use built version
  html = html.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="/main.js"></script>',
  );

  writeFileSync("dist/index.html", html);
}

// Generate environment config file
function generateEnvConfig() {
  const env = loadEnv();
  const envConfig = `// Auto-generated environment config
export const env = {
${Object.entries(env)
  .map(([key, value]) => `  ${key}: "${value}",`)
  .join("\n")}
};
`;

  // Ensure src/config directory exists
  if (!existsSync("src/config")) mkdirSync("src/config", { recursive: true });

  writeFileSync("src/config/env.ts", envConfig);
  console.log("📝 Generated environment config");
}

// Main build function
async function build() {
  const isProduction = process.argv.includes("--production");
  const shouldServe = process.argv.includes("--serve");

  console.log(
    `🏗️ Building in ${isProduction ? "production" : "development"} mode...`,
  );

  // Ensure dist exists
  if (!existsSync("dist")) mkdirSync("dist", { recursive: true });

  // Generate environment config
  generateEnvConfig();

  // Build CSS
  const cssCmd = `bunx tailwindcss -i src/index.css -o dist/index.css ${isProduction ? "--minify" : ""}`;
  console.log("🎨 Building CSS...");
  const cssResult = Bun.spawnSync(cssCmd.split(" "));
  if (!cssResult.success) throw new Error("CSS build failed");

  // Build JavaScript
  const jsArgs = [
    "build",
    "src/main.tsx",
    "--outdir",
    "dist",
    "--target",
    "browser",
    "--sourcemap",
  ];

  if (isProduction) jsArgs.push("--minify");

  console.log("⚡ Building JavaScript...");
  const jsResult = Bun.spawnSync(["bun", ...jsArgs]);
  if (!jsResult.success) throw new Error("JS build failed");

  // Copy public files and process HTML
  copyPublic();
  processHTML();

  console.log("✅ Build complete!");

  // Start dev server if requested
  if (shouldServe) {
    console.log("🚀 Starting development server...");
    Bun.spawn(["bun", "serve.js", "--dev"], {
      stdio: ["inherit", "inherit", "inherit"],
    });
  }
}

// Run build
build().catch(console.error);
