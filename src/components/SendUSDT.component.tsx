import { useState } from "react";
import { useSendUSDT } from "../context/wagmi";
import { networks } from "../context";
import { useAppKitNetwork } from "@reown/appkit/react";

export function SendUSDT() {
  const [recipient, setRecipient] = useState<`0x${string}`>("0x...");
  const [amount, setAmount] = useState("10"); // Default 10 USDT


  const { switchNetwork } = useAppKitNetwork();
  const { sendUSDT, isPending, isSuccess, isError, error } = useSendUSDT();

  const swithToPolygonNetwork = async () => {
    const networkNames = networks.map(x => x.name);
    const currentNetworkIndex = networkNames.indexOf('Polygon');

    switchNetwork(networks[currentNetworkIndex])

  }

  const handleSend = async () => {
    if (!recipient || recipient === "0x...") {
      alert("Please enter a valid recipient address!");
      return;
    }

    await swithToPolygonNetwork();

    // approveUSDT(recipient, amount)

    sendUSDT(recipient, amount);
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
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? "Sending..." : "Send USDT"}
      </button>
      {isSuccess && <p>✅ Transaction Successful!</p>}
      {isError && <p>❌ Error: {error?.message}</p>}
    </div>
  );
}
