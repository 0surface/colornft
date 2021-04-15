const Color = artifacts.require("Color");
const truffleAssert = require("truffle-assertions");
const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Color", (accounts) => {
  let contract;

  const deployer = accounts[0];
  const minter = accounts[1];

  const color1 = "#ED097F";
  const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

  describe("deployment", async () => {
    before("deploy contract", async () => {
      contract = await Color.new({ from: deployer });
    });

    it("deploys successfully", async () => {
      const _address = contract.address;
      const addressIsValid = _address !== "" && _address !== 0x0 && _address !== null && _address !== undefined;
      assert.isTrue(addressIsValid, "deployed contract address is invald");
    });

    it("should have the correct ERC721Metadata name", async () => {
      const name = await contract.name();
      assert.strictEqual(name, "Color");
    });

    it("should have the correct ERC721Metadata symbol", async () => {
      const symbol = await contract.symbol();
      assert.strictEqual(symbol, "COLOR");
    });
  });

  describe("minting", async () => {
    beforeEach("deploy contract", async () => {
      contract = await Color.new({ from: deployer });
    });

    it("should mint a new token", async () => {
      const txObj = await contract.mint(color1, { from: minter });
      const totalSupply = await contract.totalSupply();
      const eventArgs = txObj.logs[0].args;

      assert.strictEqual(Number(totalSupply), 1);
      assert.strictEqual(eventArgs.tokenId.toNumber(), 1, "incorrect token id");
      assert.strictEqual(eventArgs.from, NULL_ADDRESS, "incorrect from address");
      assert.strictEqual(eventArgs.to, minter, "incorrect to address");
    });

    it("should not mint invalid color", async () => {
      await truffleAssert.reverts(contract.mint("#E", { from: minter }));
    });

    it("should not mint existing color", async () => {
      const txObj = await contract.mint(color1, { from: minter });
      assert.isDefined(txObj, "transaction not mined");

      await truffleAssert.reverts(contract.mint(color1, { from: minter }));
    });
  });

  describe("indexing", async () => {
    const colors = ["#ED097A", "#ED097B", "#ED097C"];

    before("deploy contract", async () => {
      contract = await Color.new({ from: deployer });
    });

    it("should index minted colors", async () => {
      for (let _color of colors) {
        let txObj = await contract.mint(_color, { from: minter });
        assert.isDefined(txObj);
      }
      const totalSupply = Number(await contract.totalSupply());

      let indexedColor;
      let result = [];
      for (let i = 0; i < totalSupply; i++) {
        indexedColor = await contract.colors(i);
        result.push(indexedColor);
      }

      assert.equal(result.join(","), colors.join(","));
    });
  });
});
