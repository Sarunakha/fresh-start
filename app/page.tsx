import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Fresh Start Facility Solutions Sydney</h1>
      <p className="mt-2 text-sm text-slate-600">
        Next.js site root is ready. Go to{" "}
        <Link className="font-medium text-slate-900 underline" href="/frontend/src/modules/service/pages/HomePage.tsx">
          /admin/login
        </Link>
        .
      </p>
    </main>
  );
}

