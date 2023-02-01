import { useEffect } from "react";
import { useDispatch } from "react-redux";
import config from "../config.json";
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange
} from "../store/interactions";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // connect Ethers to blockchain
    const provider = loadProvider(dispatch);

    // Fetch current network's chainId
    const chainId = await loadNetwork(provider, dispatch);

    // Fetch current account & balance from Metamask
    await loadAccount(provider, dispatch);

    // Load Token Smart Contract
    const Dapp = config[chainId].Dapp
    const mETH = config[chainId].mETH
    await loadTokens(provider, [Dapp.address, mETH.address], dispatch);

    // Load Exchange Smart Contract
    const exchangeConfig = config[chainId].exchange
    await loadExchange(provider, exchangeConfig.address, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
