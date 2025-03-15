type EthereumProvider = {
  request: (args: unknown) => Promise<unknown>;
};

export const addUSDTToMetaMask = async () => {
  const ethereum = window.ethereum as unknown as EthereumProvider;

  if (!ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0xc2132D05D31c914A87C6611C10748AEB04B58E8F",
          symbol: "USDT",
          decimals: 6,
          image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
        },
      },
    });

    alert("✅ USDT has been added to MetaMask!");
  } catch (error) {
    console.error("Error adding USDT:", error);
  }
};
