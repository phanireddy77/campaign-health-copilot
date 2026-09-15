import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        env: {
            NODE_ENV: "DEVELOPMENT",
        },
        exclude: ["**/node_modules/**", "**/dist/**"],
    },
});
