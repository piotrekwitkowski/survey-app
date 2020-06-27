console.log('blkchn-survey-app started!');

// import { getWeb3 } from './js/web3.js';

import Web3 from 'web3';
const web3 = new Web3('ws://localhost:8546');

const CONTRACT_ARTIFACT_NAME = 'Master.json';

console.log('web3:', web3);
console.log('web3.currentProvider:', web3.currentProvider);

fetch(CONTRACT_ARTIFACT_NAME)
  .then(response => response.json())
  .then(artifact => {
    console.log('artifact:', artifact);

    
    // const surveyContract = TruffleContract(artifact);
    const contract = new web3.eth.Contract(artifact);
    console.log(contract.methods)
    // contract.setProvider(web3.currentProvider);
    // contract.deploy({}).then(contractInstance => render(contractInstance))

  });


const render = contractInstance => {
  import('./js/components/App.js').then(m => m.init(web3, contractInstance));
}
