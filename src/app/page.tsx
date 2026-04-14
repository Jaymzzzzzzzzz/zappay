"use client";

import { useState } from "react";
import { connect } from "@starknet-io/get-starknet";
import { motion } from "framer-motion";
import Scene from "@/components/Scene";

export default function Home() {
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    try {
      const starknet = await connect();
      if (!starknet) return;

      await starknet.enable();
      setAddress(starknet.selectedAddress);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Scene />
      <main className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl max-w-lg w-full text-center"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 drop-shadow-sm"
          >
            ZapPay ⚡
          </motion.h1>

          <p className="text-zinc-300 mb-10 text-lg leading-relaxed max-w-md font-medium">
            Send crypto instantly with a <span className="text-white font-semibold">gasless</span> experience powered by Starknet
          </p>

          {/* 🔗 CONNECT WALLET */}
          {!address ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
              className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
            >
              Connect Wallet
            </motion.button>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center"
            >
              <div className="bg-white/10 px-4 py-2 rounded-full mb-6 border border-green-500/30">
                 <p className="text-sm text-green-300 font-mono">
                   {address.slice(0, 6)}...{address.slice(-4)}
                 </p>
              </div>

              <a href="/send" className="w-full">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
                >
                  Start Sending →
                </motion.button>
              </a>
            </motion.div>
          )}
        </motion.div>
      </main>
    </>
  );
}