// apps/web/src/server/index.ts
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./api/root";

const server = createHTTPServer({ router: appRouter });
server.listen(3000, () => console.log("🚀 Servidor tRPC corriendo en http://localhost:3000"));
