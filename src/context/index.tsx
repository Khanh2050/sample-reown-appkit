
import { createAppKit } from '@reown/appkit/react'
import { ReactNode } from "react";
import { WagmiProvider } from 'wagmi'
import { AppKitNetwork, mainnet, polygon } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

type ProviderProps = {
    children: ReactNode;
}

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_PROJECT_ID

if (!projectId) {
    throw Error("projectId is not defined.")
}

// 2. Create a metadata object - optional
const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://example.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
export const networks = [mainnet, polygon, ] as [AppKitNetwork, ...AppKitNetwork[]]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true
})

// 5. Create modal
const generalConfig = {
    projectId,
    networks,
    metadata,
    themeMode: 'light' as const,
    themeVariables: {
        '--w3m-accent': '#000000',
    }
}

createAppKit({
    adapters: [wagmiAdapter],
    ...generalConfig,
    features: {
        analytics: true // Optional - defaults to your Cloud configuration
    }
})

export function AppKitProvider({ children }: ProviderProps) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
