
import { Address, BaseError, parseEther } from 'viem';
import { useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import './App.css'
import { AppKitProvider } from './context'
import { useDisconnect, useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useState } from 'react';

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

  const { open } = useAppKit()
  const { disconnect } = useDisconnect();
  const { address, isConnected, status } = useAppKitAccount()
  const { refetch } = useBalance({
    address: address as Address
  });

  const handleGetBalance = async () => {
    const balance = await refetch()
    setBalance(balance?.data?.value.toString() + " " + balance?.data?.symbol.toString())
  }

  handleGetBalance();

  return (
    <div >
      <button onClick={() => { open({ view: 'Connect' }) }}>Open</button> <br />
      {isConnected ?
        (
          <div>
            Address: {address}<br />
            Connected: {isConnected.toString()}<br />
            Status: {status}<br />
            <button onClick={async () => { await disconnect() }}>Disconnect</button><br />
            {/* <button onClick={() => switchNetwork(networks[1])}>Switch</button> */}

            {/* <button onClick={handleGetBalance}>Get Balance</button><br /> */}
            {/* <button onClick={SendTransaction}>Get Transaction</button><br /> */}

            Balance: {balance}<br />
          </div>
        )
        : <></>
      }


    </div >
  )
}

export default App
