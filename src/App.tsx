
import { Address, formatUnits, getAddress } from 'viem';
import { useBalance } from 'wagmi';
import './App.css'
import { AppKitProvider, networks } from './context'
import { useDisconnect, useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useEffect, useState } from 'react';
import { SendTransaction } from './components/transaction-form.component';
import { readBalance_USDT } from './context/wagmi';
import { SendUSDT } from './components/SendUSDT.component';
import { addUSDTToMetaMask } from './context/add-USDTH';

function App() {
  return (
    <AppKitProvider>
      <p>Build-in components</p>
      <appkit-button />
      <br />
      <br />
      <p>Hook tests</p>
      <HookList />
    </AppKitProvider>
  )
}


export const HookList = () => {


  const [balance, setBalance] = useState('');
  const [USDT_balance, setUSDT_balance] = useState('');

  const { open } = useAppKit()
  const { disconnect } = useDisconnect();
  const { switchNetwork, caipNetwork } = useAppKitNetwork();
  const { address, isConnected, status } = useAppKitAccount()
  const { refetch } = useBalance({
    address: address as Address,
  });


  const handleGetUSDTBalance = async () => {
    if (!address) {
      alert('Wallet was not connected')
    }
    const result = await readBalance_USDT(getAddress(address!))
    const UsdtBalance = formatUnits(result.balance, result.decimal)
    setUSDT_balance(`${UsdtBalance}`)
  }

  const handleGetBalance = async () => {
    const fetchedData = await refetch()
    const balance = formatUnits(fetchedData?.data?.value ?? BigInt(NaN), fetchedData.data?.decimals ?? NaN)
    setBalance(balance.toString() + " " + fetchedData?.data?.symbol.toString())
  }


  const handleSwitchNetwork = () => {
    const networkNames = networks.map(x => x.name);
    const currentNetworkIndex = networkNames.indexOf(caipNetwork!.name);
    if (currentNetworkIndex == (networkNames.length - 1)) {
      switchNetwork(networks[0]);
    }
    else {
      switchNetwork(networks[currentNetworkIndex + 1]);
    }
  }



  return (
    <div >
      <button onClick={() => {
        open({ view: 'Connect' });
      }}>Open</button> <br />
      {isConnected ?
        (
          <div>
            Address: {address}<br />
            Connected: {isConnected.toString()}<br />
            Status: {status}<br />
            Network: {caipNetwork?.name}<br />
            <button onClick={async () => { await disconnect() }}>Disconnect</button><br />
            <button onClick={handleSwitchNetwork}>Switch Network</button><br />
            <button onClick={handleGetBalance}>Get Balance</button><br />
            Balance: {balance}<br />
            <button onClick={addUSDTToMetaMask}>Add USDT to MetaMask</button><br />
            <button onClick={handleGetUSDTBalance}>USDT Balance on Polygon</button><br />
            USDT Balance: {USDT_balance}<br />
            <p>Send USDT</p>
            <SendUSDT onTransaction={async () => await handleGetUSDTBalance()} />
            <br />
            <p>Test transaction</p>
            <SendTransaction onTransaction={async () => await handleGetBalance()} />
          </div>
        )
        : <></>
      }


    </div >
  )
}

export default App
