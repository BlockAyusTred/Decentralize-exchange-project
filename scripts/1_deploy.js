async function main() {
  console.log(`Preparing deployment... \n`);
  
  // Fetch contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  // Fetch accounts
  const accounts = await ethers.getSigners();

  console.log(`Accounts fetched: \n${accounts[0].address}\n${accounts[1].address}\n`);

  // Deploy contracts
  const Dapp = await Token.deploy("Dapp", "DApp", 1000000);
  await Dapp.deployed();
  console.log(`Dapp Deployed to: ${Dapp.address}`);

  const mETH = await Token.deploy("mETH", "mETH", 1000000);
  await mETH.deployed();
  console.log(`mETH Deployed to: ${mETH.address}`);

  const mDAI = await Token.deploy("mDAI", "mDAI", 1000000);
  await mDAI.deployed();
  console.log(`mDAI Deployed to: ${mDAI.address}`);

  const exchange = await Exchange.deploy(accounts[1].address,10);
  await exchange.deployed();
  console.log(`exchange Deployed to: ${exchange.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
