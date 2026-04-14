"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Scene from "@/components/Scene";

export default function Success() {
  const params = useSearchParams();

  const tx = params.get("tx");
  const amount = params.get("amount");
  const to = params.get("to");

  return (
    <>
      <Scene />
      <main className="min-h-screen relative z-10 flex flex-col items-center justify-center px-4 overflow-hidden text-white">

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl w-[400px] max-w-full text-center shadow-2xl">

          <div className="w-16 h-16 bg-green-500/20 text-green-400 flex items-center justify-center rounded-full mx-auto mb-6 border border-green-500/30">
            <svg xmlns="http://www.w3.org/2000/ বাতাসে/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 drop-shadow-sm mb-4">
            Payment Sent
          </h1>

          <div className="bg-black/40 rounded-xl p-4 text-sm text-zinc-300 space-y-3 mb-6 border border-white/5">
            <div className="flex justify-between">
               <span className="text-zinc-500">Amount</span>
               <span className="font-semibold">{amount} ETH</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-zinc-500">To</span>
               <span className="font-mono text-xs">{to?.slice(0,6)}...{to?.slice(-4)}</span>
            </div>
          </div>

          {tx && (
            <a
              href={`https://sepolia.starkscan.co/tx/${tx}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-emerald-400 hover:text-emerald-300 underline underline-offset-4 text-sm font-medium transition-colors mb-8"
            >
              View Transaction Details ↗
            </a>
          )}

          <div className="flex flex-col gap-3">
             <Link href="/send" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                New Payment
             </Link>
             
             <Link href="/" className="w-full bg-white/10 hover:bg-white/20 text-zinc-100 py-3 rounded-xl font-bold transition-all border border-white/5 hover:border-white/20">
                Go to Home
             </Link>
          </div>

        </div>

      </main>
    </>
  );
}