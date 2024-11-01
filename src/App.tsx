
import { Connector, useAccount, useChains, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import './App.css'
import { useCallback, } from "react";
import { hexToBigInt, toHex } from 'viem';
import eruda from "eruda"

eruda.init()
export const App = () => {
  const { address, isConnecting, chainId } = useAccount()
  const { connectors, connectAsync, } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const chains = useChains()
  const { switchChainAsync } = useSwitchChain()
  const [metamask] = connectors
  const connect = useCallback(
    (connector: Connector) =>
      new Promise<readonly `0x${string}`[]>((resolve, reject) => {
        if (isConnecting) return reject(Error("failed to connect:connecting"))

        connectAsync({
          connector,
        })
          .then((res) => {
            console.log(res);

            resolve(res.accounts)
          })
          .catch((err) => {
            console.log(err);

            reject(err)
          })
      }),
    [connectAsync, isConnecting,]
  )


  const disconnect = useCallback(async (connector: Connector) => {
    await disconnectAsync({
      connector: connector,
    })
  }, [disconnectAsync,])


  const switchChain = async (id: number) => {
    await switchChainAsync({
      chainId: id
    })
  }

  const cache = localStorage.getItem('.MMSDK_cached_chainId')
  return (
    <div className="App">
      {(
        <div>
          <>
            <p>{cache && `cache chain: ${Number(hexToBigInt(cache as `0x${string}`))}/${cache}`}</p>
            <p>{chainId && `Connected chain: ${chainId}/${toHex(chainId)}`}</p>
            <p style={{
              fontSize: 12
            }}> {address && `Connected account: ${address}`}</p>

          </>
        </div>
      )}
      {
        address ? <button style={{ padding: 10, margin: 10 }} onClick={() => disconnect(metamask)}>
          disconnect
        </button> : <button style={{ padding: 10, margin: 10 }} onClick={() => connect(metamask)}>
          Connect
        </button>
      }
      {chainId && <div>
        <h3>   switch chain</h3>
        {
          chains.map(chain => <div style={{
            backgroundColor: "#aaaa",
            borderRadius: 8,
            padding: 4,
            margin: 4
          }}>
            <p>
              {chain.name}
            </p>
            <p>
              id: {chain.id}/ {toHex(chain.id)}
            </p>
            <button style={{ margin: "0 5px" }} onClick={() => switchChain(chain.id)}>
              select
            </button>
          </div>)
        }
      </div>}
    </div>
  );
};
