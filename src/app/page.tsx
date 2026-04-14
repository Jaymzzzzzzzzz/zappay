"use client";

import { useState } from "react";
import { connect } from "@starknet-io/get-starknet";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const starknet = await connect();

      if (!starknet) {
        alert("Wallet not found");
        return;
      }

      await starknet.connect();

      setAddress(starknet.selectedAddress || null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        {!address ? (
          <button
            onClick={handleConnect}
            className="bg-green-500 px-6 py-3 rounded-xl font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <p>Connected: {address}</p>
        )}
      </div>
    </main>
  );
}