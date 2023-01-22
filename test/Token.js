const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", function () {
  let token;

  beforeEach(async () => {
    // Fetch token contract from blockchain
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Ayush Anand", "AAND", 1000000);
  });

  describe("Deployment", () => {
    it("has correct name", async () => {
      expect(await token.name()).to.equal("Ayush Anand");
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal("AAND");
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal("18");
    });

    it("has correct totalSupply", async () => {
      expect(await token.totalSupply()).to.equal(tokens(1000000));
    });
  });
});
