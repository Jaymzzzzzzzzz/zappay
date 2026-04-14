"use client";

import { useEffect, useState } from "react";

export default function Success() {
  const [tx, setTx] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      setTx(params.get("tx"));
      setAmount(params.get("amount"));
      setToken(params.get("token"));
    }
  }, []);

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

        {tx && (
          <a
            href={`https://sepolia.voyager.online/tx/${tx}`}
            target="_blank"
            className="text-blue-400 underline"
          >
            View on Explorer
          </a>
        )}

      </div>

    </main>
  );
}