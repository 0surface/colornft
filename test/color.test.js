const Color = artifacts.require("Color");
const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Color", (accounts) => {
  let contract;

  before("", async () => {
    contract = await Color.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      contract = await Color.deployed();
      const _address = contract.address;
      const addressIsValid = _address !== "" && _address !== 0x0 && _address !== null && _address !== undefined;
      assert.isTrue(addressIsValid, "deployed contract address is invald");
    });

    it("has the correct ERC721Metadata name", async () => {
      const name = await contract.name();
      assert.strictEqual(name, "Color");
    });

    it("has the correct ERC721Metadata symbol", async () => {
      const symbol = await contract.symbol();
      assert.strictEqual(symbol, "COLOR");
    });
  });
});
