import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const reg = require("./make-registry.ts")

reg.makeRegistry()
