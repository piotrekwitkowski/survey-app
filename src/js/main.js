console.log('blkchn-survey-app started!');

import { getWeb3 } from './web3.js';

const CONTRACT_ARTIFACT_NAME = 'Survey.json';

getWeb3().then(web3 => {
  console.log('web3:', web3);
  console.log('web3.currentProvider:', web3.currentProvider);

  fetch(CONTRACT_ARTIFACT_NAME)
    .then(response => response.json())
    .then(artifact => {
      console.log('artifact:', artifact);

      const surveyContract = TruffleContract(artifact);
      surveyContract.setProvider(web3.currentProvider);

      surveyContract.deployed().then(surveyContractInstance => render(surveyContractInstance))

    });
});

const render = surveyContractInstance => {
  import('./components/App.js').then(m => m.init(web3, surveyContractInstance));
}
