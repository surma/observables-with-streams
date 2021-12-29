import { build } from "https://deno.land/x/dnt@0.11.0/mod.ts";
import { rollup } from "https://esm.sh/rollup@2.62.0";
import { minify } from "https://esm.sh/terser@5.10.0";

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./dist",
  test: false,
  cjs: false,
  shims: {},
  package: {
    // package.json properties
    name: "observables-with-streams",
    version: "0.6.1",
    description: "A library of observables built with streams",
    author: "Surma <surma@surma.link>",
    license: "Apache-2.0",
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "dist/LICENSE");
Deno.copyFileSync("README.md", "dist/README.md");

const res = await rollup({
  input: "dist/esm/index.js",
  plugins: [
    {
      name: "terser",
      async renderChunk(code) {
        const result = await minify(code, { compress: true, mangle: true });
        return {
          code: result.code!,
          map: result.map,
        };
      },
    },
  ],
});
await res.write({
  file: "dist/dist/really-big-bundle.js",
  format: "umd",
  name: "ows",
});
