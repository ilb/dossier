import config from "@ilb/eslint-config";

config.push({
  ignores: ["**/node_modules/**", "apps/dossier/node_modules/**", ".git/**", ".next/**", "**/test/**"],
});

export default config;
