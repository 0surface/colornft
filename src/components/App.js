import React, { Component } from "react";
import Web3 from "web3";
import Color from "../abis/Color.json";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable(); // get permission to access accounts
    } else {
      //Fall back local provider
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }
  }

  async loadBlockChainData() {
    const web3 = window.web3;

    const gas = 300000;
    this.setState({ gas });

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[1] });
    console.log(" this.state.account", this.state.account);

    const networkId = await web3.eth.net.getId();
    const data = Color.networks[networkId];
    if (data) {
      const abi = Color.abi;
      const address = data.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });

      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });

      for (let i = 0; i < totalSupply; i++) {
        let color = await contract.methods.colors(i).call();
        this.setState({ colors: [...this.state.colors, color] });
      }
    } else {
      console.error("smart contract not deployed on detected network");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      gas: 0,
      contract: null,
      totalSupply: 0,
      colors: [],
    };
  }

  mint = (color) => {
    if (color === undefined || color.length < 6) {
      return;
    }

    color.length === 6 && (color = `#${color}`);

    try {
      this.state.contract.methods
        .mint(color)
        .send({ from: this.state.account, gas: this.state.gas })
        .once("receipt", (receipt) => {
          this.setState({ colors: [...this.state.colors, color] });
        });
    } catch (err) {
      console.error("Exception in mint(): ", err);
    }
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" target="_blank" rel="noopener noreferrer">
            Color NFTs
          </a>

          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">{this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Tokens</h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const color = this.color.value;
                    this.mint(color);
                  }}
                >
                  <input
                    type="text"
                    className="from-control mb-1"
                    placeholder="e.g. #FFEE34"
                    ref={(input) => (this.color = input)}
                  />
                  <input type="submit" className="btn btn-block btn-success" value="MINT"></input>
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.colors.map((color, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
