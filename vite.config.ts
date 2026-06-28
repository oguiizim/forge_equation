import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	cacheDir: ".vite",
	resolve: {
		alias: {
			"#": fileURLToPath(new URL("./src", import.meta.url)),
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		devtools(),
		tailwindcss(),
		viteReact(),
	],
});

export default config;
