// import fs from "fs";
// import https from "https";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: fs.readFileSync(process.env.PATH_TO_KEY_FILE),
    //   cert: fs.readFileSync(process.env.PATH_TO_CERT_FILE),
    // },
    host: "0.0.0.0",
    // port: 5173,
  },
});
