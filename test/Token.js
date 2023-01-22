const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", function () {
  let token;
  let account1;
  let deployer;

  beforeEach(async () => {
    // Fetch token contract from blockchain
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Ayush Anand", "AAND", 1000000);

    [deployer, account1] = await ethers.getSigners();
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

    it("assign total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(tokens(1000000));
    });
  });

  describe("Sending Token", () => {
    let amount, transaction, result;

    describe("Success", () => {
      beforeEach(async () => {
        amount = tokens(100);
        transaction = await token
          .connect(deployer)
          .transfer(account1.address, amount);
        result = await transaction.wait();
      });

      it("should transfer token balances", async () => {
        expect(await token.balanceOf(account1.address)).to.equal(amount);
        expect(await token.balanceOf(deployer.address)).to.equal(
          tokens(999900)
        );
      });

      it("emits a Transfer event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.equal("Transfer");
        const args = event.args;
        expect(args.sender).to.equal(deployer.address);
        expect(args.receiver).to.equal(account1.address);
        expect(args.amount).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("should reject insufficient balances", async () => {
        let invalidAmount = tokens(10000000);
        await expect(token.connect(deployer).transfer(account1.address, invalidAmount))
          .to.be.reverted;
      });

      it("should rejects invalid recipent", async () => {
        await expect(
          token
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });
});
