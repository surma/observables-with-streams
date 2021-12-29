fmt:
	deno fmt ./{src,tests}/**/*.ts *.{md,json,js}

fmt-check:
	deno fmt --check ./{src,tests}/**/*.ts *.{md,json,js}

build:
	deno run --allow-read --allow-write --allow-run --allow-env --unstable build.ts

test:
	deno test --unstable tests/**/*.ts