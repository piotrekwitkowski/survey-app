App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    console.log('initContract');
    // $.getJSON('Survey.json', function (data) {
    $.getJSON('Master.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SurveyArtifact = data;
      // App.contracts.Survey = TruffleContract(SurveyArtifact);
      App.contracts.Survey = new web3.eth.Contract(SurveyArtifact);

      // Set the provider for our contract
      App.contracts.Survey.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.readState();
    });

  },

  readState: () => {
    App.contracts.Survey.deployed().then(instance => {
      console.log('instance', instance)
      const state = instance.state().then(state => {
        console.log('state:', state)
      });
    })
  }
};
