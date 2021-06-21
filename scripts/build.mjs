import esbuild from 'esbuild';

const baseConfig = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
};

function build(config) {
  esbuild
    .build({
      ...baseConfig,
      ...config,
    })
    .then(() => {
      console.log(`📦 ${config.outfile}`);
    })
    .catch((err) => {
      console.error(`❌  Problem building ${config.outfile}`);
      console.error(err);
      process.exit(1);
    });
}

const configs = [
  // universal, ESM
  {
    
    outfile: "dist/break-styled-lines.js",
    target: ['es2017'],
    format: "esm",
    conditions: ["browser"],
  },
  // universal, commonJS
  {

    outfile: "dist/break-styled-lines.cjs",
    target: ['es2017'],
    platform: "node",
 
    conditions: ["node"],
  },
  // universal, node, ESM
  {
 
    outfile: "dist/break-styled-lines.mjs",
    target: ['es2017'],
    platform: "node",
    format: "esm",
   
    conditions: ["node"],
  },
];

configs.forEach(build);