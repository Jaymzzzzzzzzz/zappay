"use client";

import { useState } from "react";
import { connect } from "@starknet-io/get-starknet";
import { useRouter } from "next/navigation";

const TOKENS = {
  ETH: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
  STRK: {
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5f5e02e7d3d8d7d7c3e9c1f3c",
  },
};

export default function Send() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState<"ETH" | "STRK">("ETH");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Sending...");

      const starknet: any = await connect(); // ✅ FIX

      if (!starknet) return;

      await starknet.enable(); // ✅ NO ERROR NOW

      const account = starknet.account;

      const amountWei = BigInt(Math.floor(Number(amount || "0.001") * 1e18));

      const low = amountWei & ((1n << 128n) - 1n);
      const high = amountWei >> 128n;

      const tx = await account.execute({
        contractAddress: TOKENS[token].address,
        entrypoint: "transfer",
        calldata: [
          recipient || account.address,
          low.toString(),
          high.toString(),
        ],
      });

      setStatus("✅ Success");

      setTimeout(() => {
        router.push(
          `/success?tx=${tx.transaction_hash}&amount=${amount}&token=${token}`
        );
      }, 1000);

    } catch (err) {
      console.log(err);
      setStatus("❌ Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

      <h1 className="text-3xl mb-4">Send {token}</h1>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setToken("ETH")} className="bg-green-500 px-4 py-2 rounded">
          ETH
        </button>
        <button onClick={() => setToken("STRK")} className="bg-green-500 px-4 py-2 rounded">
          STRK
        </button>
      </div>

      <input
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="mb-3 p-2 text-black w-64"
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-3 p-2 text-black w-64"
      />

      {status && <p className="mb-2">{status}</p>}

      <button
        onClick={handlePayment}
        className="bg-green-500 px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Send"}
      </button>

    </main>
  );
}