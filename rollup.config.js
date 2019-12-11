import { terser } from "rollup-plugin-terser";

export default {
  input: "dist/index.js",
  output: {
    file: "dist/really-big-bundle.js",
    format: "umd",
    name: "ows"
  },
  plugins: [
    terser({
      mangle: true,
      compress: true
    })
  ]
};
