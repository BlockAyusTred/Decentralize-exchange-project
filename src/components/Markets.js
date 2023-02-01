import config from "../config.json";
import { useSelector, useDispatch } from "react-redux";
import { loadTokens } from "../store/interactions";

const Markets = () => {
  const dispatch = useDispatch();

  const chainId = useSelector((state) => state.provider.chainId);
  const provider = useSelector((state) => state.provider.connection);

  const marketHandler = async (e) => {
    loadTokens(provider, (e.target.value).split(','), dispatch)
  }

  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2>Select Market</h2>
      </div>

      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
        <option
          value={`${config[chainId].Dapp.address},${config[chainId].mETH.address}`}
        >
          Dapp / mETH
        </option>
        <option
          value={`${config[chainId].Dapp.address},${config[chainId].mDAI.address}`}
        >
          Dapp / mDAI
        </option>
      </select>
      ) : (
        <div>
          <p>Not deployed to network</p>
        </div>
      )}
      <hr />
    </div>
  );
};

export default Markets;
