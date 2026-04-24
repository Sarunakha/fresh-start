import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrisma() {
  return new PrismaClient({
    log: ["error"]
  });
}

const cached = globalThis.prisma;
const shouldRecreateClient =
  // When Prisma schema changes during dev, a cached client instance can be stale
  // (missing newly-generated model delegates). In that case, recreate.
  Boolean(
    cached &&
      (!(cached as any).quoteRequest ||
        !(cached as any).admin ||
        !(cached as any).quoteRequestStatusHistory ||
        !(cached as any).quoteRequestAddOn ||
        !(cached as any).siteContent)
  );

export const prisma = cached && !shouldRecreateClient ? cached : createPrisma();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

