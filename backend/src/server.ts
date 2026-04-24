import "dotenv/config";
import cors from "cors";
import express from "express";
import { pricingRouter } from "./modules/pricing/routes/pricing";
import { bookingsRouter } from "./modules/inquiry/routes/bookings";
import { quoteRequestsRouter } from "./modules/inquiry/routes/quote-requests";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// This API has no SPA on `/`. Browsers hitting `localhost:4000` see this instead of "Cannot GET /".
app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"/><title>FSC API</title></head>
<body style="font-family:system-ui;max-width:42rem;margin:2rem;line-height:1.5">
  <h1>Fresh Start Facility Solutions — API</h1>
  <p>This port is the <strong>Express API</strong>, not Prisma Studio.</p>
  <ul>
    <li><strong>Prisma Studio (database GUI):</strong> start it with <code>npm run prisma:studio</code> in the <code>backend</code> folder, then open <a href="http://localhost:5555">http://localhost:5555</a></li>
    <li><strong>Frontend:</strong> <a href="http://localhost:5173">http://localhost:5173</a></li>
    <li><strong>Health:</strong> <a href="/health">/health</a></li>
  </ul>
</body></html>`);
});

app.use("/api/pricing", pricingRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/quote-requests", quoteRequestsRouter);

const port = Number(process.env.PORT ?? 4000);
const server = app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[api] Port ${port} is already in use (another API instance is probably running).\n` +
        `  From repo root: npm run ports:kill\n` +
        `  From backend:    npm run dev:clean`
    );
    process.exit(1);
  }
  throw err;
});

