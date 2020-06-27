# blkchn-survey-app

## Frontend
1. Install dependencies with `npm install`
2. Run the www server with `npm start`
This will compile and deploy the truffle contracts and start the webserver.

## Web3
We are currently using Web3.js of version 1.2.9. https://web3js.readthedocs.io/en/v1.2.9/

The "Version 1" branch is differs significantly from the web3.js version 0.x.x used by the pet-shop example.

### Creating contract instance
The contract instance will be created using `new web3.eth.Contract()` like this:
```js
fetch("CompiledContractName.json")
      .then(res => res.json())
      .then(contractJSON => {
        web3.eth.net.getId().then(networkId => {
          const deployedAddress = contractJSON.networks[networkId].address;
          this.masterInstance = new web3.eth.Contract(contractJSON.abi, deployedAddress);
        })
      })
```

### Using Metamask
The webpage will connect to the wallet using the [MetaMask extension for Chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn). To start connecting call 
```js
ethereum.enable();
```
at the beginning of your js code.

### Connecting to the Contract instance
Make sure that the contract is deployed. Open the tab *Contracts* in [Ganache](https://www.trufflesuite.com/ganache) and make sure the addresses of the contracts are present.

### Metamask called multiple times
Make sure only one tab of the webapp (webpage) is open at a given time.
