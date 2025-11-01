// prisma.config.ts
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // The 'schema' property defines the path to your schema file(s).
  // It is resolved relative to the location of this config file.
  schema: path.join(__dirname, "prisma", "schema.prisma"),
});
