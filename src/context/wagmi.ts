import { createPublicClient, http, erc20Abi, Address, getAddress, parseUnits } from "viem";
import { polygon } from "viem/chains";
import { useWriteContract } from "wagmi";
import { USDT_ABI } from "../config/USDT-Polygon.abi";

const USDT_CONTRACT: `0x${string}` = getAddress(
  import.meta.env.VITE_USDT_CONTRACT_POLYGON
);

const METAMASK_ACCOUNT_2: `0x${string}` = getAddress(
  import.meta.env.VITE_METAMASK_ACCOUNT_2
);

const client = createPublicClient({
  chain: polygon,
  transport: http(),
});

export const readBalance_USDT = async (address: Address) => {
  const balance = await client.readContract({
    abi: erc20Abi,
    address: USDT_CONTRACT,
    functionName: "balanceOf",
    args: [address as Address],
  });

  return Number(balance);
};

export function useApproveUSDT() {
    const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();
  
    const approveUSDT = (spender: `0x${string}`, amount: string) => {
      console.log("Approving USDT transfer for:", spender, "Amount:", amount);
  
      writeContract({
        address: USDT_CONTRACT,
        abi: USDT_ABI,
        functionName: "approve",
        args: [spender, parseUnits(amount, 6)], // Convert amount to USDT decimals
      });
    };
  
    return { approveUSDT, isPending, isSuccess, isError, error };
  }

export function useSendUSDT() {
  const { writeContract, data, isPending, isError, isSuccess, error } =
    useWriteContract();

  const sendUSDT = (recipient: `0x${string}`, amount: string) => {
    console.log("Sending USDT to:", recipient, "Amount:", amount);


    try {
      writeContract({
        address: USDT_CONTRACT,
        abi: USDT_ABI,
        functionName: "transferFrom",
        args: [METAMASK_ACCOUNT_2, recipient, parseUnits(amount, 6)],
      });
    } catch (err) {
      console.error("Transaction Failed:", err);
    }
  };

  return { sendUSDT, isPending, isSuccess, isError, error, data };
}
