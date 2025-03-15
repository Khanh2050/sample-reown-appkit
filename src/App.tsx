
import { Address } from 'viem';
import { useBalance } from 'wagmi';
import './App.css'
import { AppKitProvider, networks } from './context'
import { useDisconnect, useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useState } from 'react';
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
    const balance = await readBalance_USDT(address as Address)
    setUSDT_balance(`${balance}`)
  }

  const handleGetBalance = async () => {
    const balance = await refetch()
    setBalance(balance?.data?.value.toString() + " " + balance?.data?.symbol.toString())
  }

  handleGetBalance();

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
      <button onClick={() => { open({ view: 'Connect' }) }}>Open</button> <br />
      {isConnected ?
        (
          <div>
            Address: {address}<br />
            Connected: {isConnected.toString()}<br />
            Status: {status}<br />
            Network: {caipNetwork?.name}<br />
            <button onClick={async () => { await disconnect() }}>Disconnect</button><br />
            <button onClick={handleSwitchNetwork}>Switch Network</button><br />
            {/* <button onClick={SendTransaction}>Get Transaction</button><br /> */}
            Balance: {balance}<br />
            <button onClick={addUSDTToMetaMask}>Add USDT to MetaMask</button><br />
            <button onClick={handleGetUSDTBalance}>USDT Balance on Polygon</button><br />
            USDT Balance: {USDT_balance}<br />
            SendUSDT
            <SendUSDT />
            <br /><br /><br />
            <p>Test transaction</p>
            <SendTransaction />
          </div>
        )
        : <></>
      }


    </div >
  )
}

export default App
