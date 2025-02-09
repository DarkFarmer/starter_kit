import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import Color from '../abis/Color.json'
import { transferPromiseness } from 'chai-as-promised';
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-ethereum browser detected. Use MetaMask!')
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3
    //load account
    const accounts = await web3.eth.getAccounts()
    this.setState( {account : accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if(networkData) {
      const abi = Color.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract})
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({totalSupply})

      for(var i = 1; i <= totalSupply; i++) {
				const color = await contract.methods.colors(i - 1).call()
        
				this.setState ({
          colors: [...this.state.colors, color]
        })
			}
      
      for(var i = 1; i <= totalSupply; i++) {
				const owner = await contract.methods.ownerOf(i).call()
        
				this.setState ({
          owners: [...this.state.owners, owner]
        })
			}
      
    }
    else {
      window.alert('Smart contract is not deployed on this network.')
    }
    //0xAe06D3A4700a8E4b777723e66De8740cB24b01ED

    
  }

  mint= (color) => {
    console.log(color)
    this.state.contract.methods.mint(color).send({from : this.state.account})
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors,color]
      })
    })
  }
  constructor(props) {
    super(props);
    this.state = { 
      account: '',
      contract: null,
      totalSupply:0,
      colors: [],
      owners: [] 
    }
    
  }
  render() {
    console.log("owners was " + this.state.owners.length);
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
              </li>

          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event)=> {
                    event.preventDefault()
                    const color = this.color.value
                    this.mint(color)
                }}>
                  <input
                  type='text'
                  className='form-control mb-1'
                  placeholder ='e.g. #FFFFFF'
                  ref = {(input) => { this.color = input}}
                  />

                  <input
                  type = 'submit'
                  className='btn btn-block btn-primary'
                  value= 'MINT'/>
                </form>
                
                
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            {this.state.colors.map((color, key) => {
                var _owner  = ""
                if(this.state.owners[key])
                  _owner = this.state.owners[key].substring(0,5);
                return(<div key={key} className = "col-md-4 mb-2">
                  <div className = "token" style = {{backgroundColor: color}}></div>
                  <div>{color}</div>
                  <div>{_owner}</div>
                  </div>)
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
