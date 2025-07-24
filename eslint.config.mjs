import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Configuración inteligente para console.log
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      // Permitir any en algunos casos específicos
      "@typescript-eslint/no-explicit-any": "warn",
      // Permitir require en tests
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Reglas específicas para archivos de testing y desarrollo
    files: [
      "src/components/recaptcha-testing-panel.tsx",
      "src/examples/**/*.tsx",
      "src/__tests__/**/*.{ts,tsx}",
      "scripts/**/*.js",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
