import fs from "fs";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const useHttps = process.env.VITE_ENABLE_HTTPS === "true";
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      https: useHttps
        ? {
            cert: fs.readFileSync(process.env.VITE_PATH_TO_CERT_FILE),
            key: fs.readFileSync(process.env.VITE_PATH_TO_KEY_FILE),
          }
        : false,
      port: process.env.VITE_PORT,
    },
  });
};
