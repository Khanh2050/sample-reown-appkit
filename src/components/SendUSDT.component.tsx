import { useState } from "react";
import { readBalance_USDT, sendUsdtTransaction } from "../context/wagmi";
import { useAppKitAccount } from "@reown/appkit/react";
import { Address, parseUnits } from "viem";

export function SendUSDT() {
  const [recipient, setRecipient] = useState<`0x${string}`>("0x...");
  const [amount, setAmount] = useState("10"); // Default 10 USDT
  const { address } = useAppKitAccount()

  const handleGetUSDTValue = async () => {
    const result = await readBalance_USDT(address as Address)
    return parseUnits(amount, result.decimal)
  }

  const handleSend = async () => {
    if (!recipient || recipient === "0x...") {
      alert("Please enter a valid recipient address!");
      return;
    }

    // sendUSDT(recipient, await handleGetUSDTValue());

    sendUsdtTransaction(recipient, await handleGetUSDTValue())


  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
      />
      <input
        type="text"
        placeholder="Amount (USDT)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSend} >

      </button>

    </div>
  );
}
