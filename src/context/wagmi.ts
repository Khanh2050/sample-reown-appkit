type EthereumProvider = {
  request: (args: unknown) => Promise<unknown>;
};

import {
  createPublicClient,
  http,
  erc20Abi,
  Address,
  getAddress,
  createWalletClient,
  custom,
  encodeFunctionData,
} from "viem";
import { polygon } from "viem/chains";
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

export const walletClient = createWalletClient({
  account: METAMASK_ACCOUNT_2,
  chain: polygon,
  transport: custom(window.ethereum! as unknown as EthereumProvider),
});

export const readBalance_USDT = async (address: Address) => {
  const balance = await client.readContract({
    abi: erc20Abi,
    address: USDT_CONTRACT,
    functionName: "balanceOf",
    args: [address as Address],
  });

  const decimal = await client.readContract({
    abi: erc20Abi,
    address: USDT_CONTRACT,
    functionName: "decimals",
  });

  return { balance, decimal };
};

export const sendUsdtTransaction = async (
  recipient: `0x${string}`,
  amount: bigint
) => {
  const data = encodeFunctionData({
    abi: USDT_ABI,
    functionName: "transfer",
    args: [recipient, amount],
  });

  const hash = await walletClient.sendTransaction({
    to: USDT_CONTRACT, 
    data: data,
  });

  // const receipt = await client.waitForTransactionReceipt({ hash });
};
