"use client";

import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic"; // ✅ FIX

export default function Success() {
  const params = useSearchParams();

  const tx = params.get("tx");
  const amount = params.get("amount");
  const token = params.get("token");

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-white/5 p-6 rounded-xl text-center w-80">

        <h1 className="text-2xl text-green-400 mb-4">
          Payment Successful 🎉
        </h1>

        <p className="mb-2">
          {amount} {token} sent
        </p>

        <p className="text-xs break-all mb-4">
          Tx: {tx}
        </p>

        <a
          href={`https://sepolia.voyager.online/tx/${tx}`}
          target="_blank"
          className="text-blue-400 underline"
        >
          View on Explorer
        </a>

      </div>

    </main>
  );
}