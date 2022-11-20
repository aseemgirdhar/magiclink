
import './App.css';
import { useState } from 'react';
import Web3 from 'web3';
import { Magic } from 'magic-sdk';
import { ConnectExtension } from '@magic-ext/connect';
const customNodeOptions = {
  rpcUrl: 'https://polygon-rpc.com', // your ethereum, polygon, or optimism mainnet/testnet rpc URL
  chainId: 137
}

const magic = new Magic('pk_live_45921B8B20488214', {
  extensions: [new ConnectExtension()],
  network: customNodeOptions,
});
const web3 = new Web3(magic.rpcProvider);

web3.eth.getAccounts().then(accounts => console.log(accounts[0]));
function App() {
    const [account, setAccount] = useState(null);

    const sendTransaction = async () => {
      const publicAddress = (await web3.eth.getAccounts())[0];
      const txnParams = {
        from: publicAddress,
        to: publicAddress,
        value: web3.utils.toWei("0.01", "ether"),
        gasPrice: web3.utils.toWei("30", "gwei")
      };
      web3.eth
        .sendTransaction(txnParams)
        .on("transactionHash", (hash) => {
          console.log("the txn hash that was returned to the sdk:", hash);
        })
        .then((receipt) => {
          console.log("the txn receipt that was returned to the sdk:", receipt);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    const login = async () => {
      web3.eth
        .getAccounts()
        .then((accounts) => {
          setAccount(accounts?.[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    const signMessage = async () => {
      const publicAddress = (await web3.eth.getAccounts())[0];
      const signedMessage = await web3.eth.personal
        .sign("My Message", publicAddress, "")
        .catch((e) => console.log(e));
      console.log(signedMessage);
    };
  
    const showWallet = () => {
      magic.connect.showWallet().catch((e) => {
        console.log(e);
      });
    };
  
    const disconnect = async () => {
      await magic.connect.disconnect().catch((e) => {
        console.log(e);
      });
      setAccount(null);
    };
  return (
    <div className="App">
     <>
     <h2>Magic Connect</h2>
      {!account && (
        <button onClick={login} className="button-row">
          Sign In
        </button>
      )}

      {account && (
        <>
          <button onClick={showWallet} className="button-row">
            Show Wallet
          </button>
          <button onClick={sendTransaction} className="button-row">
            Send Transaction
          </button>
          <button onClick={signMessage} className="button-row">
            Sign Message
          </button>
          <button onClick={disconnect} className="button-row">
            Disconnect
          </button>
        </>
      )}
  
  </>
    </div>
  )
}

export default App;
