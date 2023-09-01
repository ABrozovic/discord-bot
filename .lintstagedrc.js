module.exports = {
  "**/*.ts?(x)": () => "pnpm type-check",
  "**/*.(ts|tsx|js)": (filenames) => [
    `pnpm lint . ${filenames.join(" ")}`,
    `pnpm prettier --write ${filenames.join(" ")}`,
  ],
}
