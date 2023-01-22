const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", function () {
  let token;
  let deployer, receiver, exchange;

  beforeEach(async () => {
    // Fetch token contract from blockchain
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Ayush Anand", "AAND", 1000000);

    [deployer, receiver, exchange] = await ethers.getSigners();
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
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("should transfer token balances", async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
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
        expect(args.receiver).to.equal(receiver.address);
        expect(args.amount).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("should reject insufficient balances", async () => {
        let invalidAmount = tokens(10000000);
        await expect(
          token.connect(deployer).transfer(receiver.address, invalidAmount)
        ).to.be.reverted;
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

  describe("Approving Tokens", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      it("allocates an allowance for delegated token spending", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(amount);
      });

      it("emits an approval events", async () => {
        const event = result.events[0];
        expect(event.event).to.equal("Approval");
        // console.log(event)
        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects invalid spenders", async () => {
        await expect(
          token
            .connect(deployer)
            .approve("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });
});
