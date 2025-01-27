import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig((mode) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            "process.env.SERVER_URL": JSON.stringify(env.REACT_APP_SERVER_URL),
            "process.env.POSTHOG_KEY": JSON.stringify(env.REACT_APP_PUBLIC_POSTHOG_KEY),
            "process.env.POSTHOG_HOST": JSON.stringify(env.REACT_APP_PUBLIC_POSTHOG_HOST),
            "process.env.GH_CLIENT_ID": JSON.stringify(
                env.REACT_APP_GH_CLIENT_ID,
            ),
        },
    };
});
