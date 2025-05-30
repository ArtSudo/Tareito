import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		restoreMocks: true,

		// 👇 Corre los tests en orden, y sin reiniciar entorno entre archivos
		isolate: false,
		sequence: {
			concurrent: false,
			hooks: 'list',
		},

		coverage: {
			exclude: ["**/node_modules/**", "**/index.ts", "vite.config.mts"], // corregido coma extra
		},
	},
	plugins: [tsconfigPaths()],
});
