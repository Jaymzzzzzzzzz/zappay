"use client";

import { useState, useEffect } from "react";
import { connect } from "@starknet-io/get-starknet";
import { useRouter } from "next/navigation";
import { uint256 } from "starknet";
import Scene from "@/components/Scene";
import { ExternalLink } from "lucide-react";

interface Transaction {
  hash: string;
  recipient: string;
  amount: string;
  token: string;
  timestamp: number;
}

// Tokens (still needed for sending)
const TOKENS = {
  ETH: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    symbol: "ETH",
  },
  STRK: {
    address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5f5e02e7d3d8d7d7c3e9c1f3c",
    symbol: "STRK",
  },
};

// Username mapping
const users: Record<string, string> = {
  "@james": "0x015799A416aE053A48FA6faEC5",
};

export default function Send() {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState<"ETH" | "STRK">("ETH");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState<Transaction[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("zap_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tx history");
      }
    }
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatus("⏳ Sending transaction...");

      const starknet = await connect();
      if (!starknet) return;

      await starknet.enable();
      const account = starknet.account;

      const finalRecipient =
        users[recipient] || recipient || account.address;

      // Safely parse dynamically sized decimal amounts (bypassing Javascript floating-point exponential limitations)
      const parseWei = (amt: string) => {
        const val = amt || "0.001";
        const parts = val.replace(/,/g, "").split(".");
        const whole = parts[0] || "0";
        let fraction = parts[1] || "";
        if (fraction.length > 18) fraction = fraction.slice(0, 18);
        return BigInt(whole + fraction.padEnd(18, "0"));
      };
      
      const amountWei = parseWei(amount);

      const low = amountWei & ((1n << 128n) - 1n);
      const high = amountWei >> 128n;

      const tx = await account.execute({
        contractAddress: TOKENS[token].address,
        entrypoint: "transfer",
        calldata: [
          finalRecipient,
          low.toString(),
          high.toString(),
        ],
      });

      const newTx: Transaction = {
        hash: tx.transaction_hash,
        recipient: finalRecipient,
        amount: amount || "0.001",
        token,
        timestamp: Date.now(),
      };

      const updatedHistory = [newTx, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("zap_history", JSON.stringify(updatedHistory));

      setStatus("✅ Transaction successful!");

      setTimeout(() => {
        router.push(
          `/success?tx=${tx.transaction_hash}&token=${token}&amount=${amount}&to=${finalRecipient}`
        );
      }, 1200);

    } catch (error) {
      console.error(error);
      setStatus("❌ Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Scene />
      <main className="min-h-screen relative z-10 text-white flex flex-col items-center justify-center px-4 overflow-hidden">

        <h1 className="text-4xl font-bold mb-2 text-green-400">
          ZapPay ⚡
        </h1>

        <p className="text-xs text-zinc-300 mb-4 font-medium">
          Starknet Sepolia
        </p>

        {/* 🔄 Token Switch */}
        <div className="flex gap-3 mb-5">
          {["ETH", "STRK"].map((t) => (
            <button
              key={t}
              onClick={() => setToken(t as "ETH" | "STRK")}
              className={`px-4 py-2 rounded-xl transition-colors min-w-[90px] flex flex-col items-center justify-center ${
                token === t ? "bg-green-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-zinc-300"
              }`}
            >
              <span>{t}</span>
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">

          <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-xs p-3 rounded-xl mb-4 font-medium text-center">
            Send crypto instantly like UPI ⚡
          </div>

          <input
            type="text"
            placeholder="@username or address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 mb-4 focus:outline-none focus:border-green-500/50 transition-colors"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 mb-4 focus:outline-none focus:border-green-500/50 transition-colors"
          />

          {/* ⏳ STATUS */}
          {status && (
            <p className="text-sm text-center mb-3 animate-pulse text-green-300">
              {status}
            </p>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 text-black py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all"
          >
            {loading ? "Processing..." : `Send ${token}`}
          </button>

        </div>

        {/* 📚 Transaction History */}
        {history.length > 0 && (
          <div className="mt-8 w-full max-w-sm z-20">
            <h2 className="text-zinc-400 text-sm font-semibold mb-3 px-1 flex justify-between items-center">
              Recent Transactions
              <button 
                onClick={() => { setHistory([]); localStorage.removeItem("zap_history"); }}
                className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
              >
                Clear History
              </button>
            </h2>
            <div className="space-y-2">
              {history.map((tx, idx) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Sent {tx.amount} <span className="text-green-400">{tx.token}</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      To: {tx.recipient.substring(0, 6)}...{tx.recipient.slice(-4)}
                    </p>
                  </div>
                  <a 
                    href={`https://sepolia.voyager.online/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-lg text-emerald-500 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </>
  );
}