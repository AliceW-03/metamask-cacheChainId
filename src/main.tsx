import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { hashFn } from "@wagmi/core/query"
import { App } from './App'
import { http, createConfig, WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  base,
  linea,
  bsc,
  sei,
  zkLinkNova as zklink,
  mantle as Mantle
} from "wagmi/chains"
import { metaMask } from 'wagmi/connectors'
const chains = [linea, base,
  Mantle,
  bsc,
  zklink,] as const

const config = createConfig({
  connectors: [
    metaMask({
      dappMetadata: {
        name: "PredX-miniapp",
        url: window.location.protocol + "//" + window.location.host,
      },
      useDeeplink: false,
      logging: {
        developerMode: import.meta.env.DEV,
        sdk: true,
      },
    }),
  ],
  multiInjectedProviderDiscovery: false,
  chains,
  transports: {
    [sei.id]: http(),
    [base.id]: http(),
    [linea.id]: http(),
    [bsc.id]: http(),
    [Mantle.id]: http(),
    [zklink.id]: http(),
  },
})
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
