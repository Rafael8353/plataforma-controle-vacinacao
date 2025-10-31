const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"], 
    languageOptions: {
      sourceType: "commonjs", 
      globals: {
        ...globals.node, 
      }
    },
    rules: { // regras extras
      // Ex: forçar ponto e vírgula no final das linhas
      // "semi": ["error", "always"] 
    }
  }
];