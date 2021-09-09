require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  
      rinkeby: {
        provider: function() {
          return new HDWalletProvider(
            process.env.MNEMONIC,
            'https://rinkeby.infura.io/v3/d0a782160c6546e3a3283893ef4a03ed'
          )
        },
        gas: 5000000,
        gasPrice: 25000000000,
        network_id: 4,
        confirmations: 2
      },
      mainnet: {
        provider: function() {
          return new HDWalletProvider(
            process.env.MNEMONIC,
            'https://mainnet.infura.io/${process.env.INFURA_API_KEY}'
            )
          },
          gas: 5000000,
          gasPrice: 25000000000,
          network_id: 1,
          confirmations: 2
        }
    },
  
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
       version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
