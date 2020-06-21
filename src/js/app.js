App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    $.getJSON('../questions.json', function (data) {
      var questionsRow = $('#questionsRow');
      var questionTemplate = $('#questionTemplate');

      for (i = 0; i < data.length; i++) {
        questionTemplate.find('label').text(data[i].question);
        // questionTemplate.find('.pet-breed').text(data[i].breed);
        // questionTemplate.find('.pet-age').text(data[i].age);
        // questionTemplate.find('.pet-location').text(data[i].location);
        // questionTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        questionsRow.append(questionTemplate.html());
      }
    });

    return await App.initWeb3();
  },

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
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    console.log('initContract')
    $.getJSON('Survey.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SurveyArtifact = data;
      App.contracts.Survey = TruffleContract(SurveyArtifact);

      // Set the provider for our contract
      App.contracts.Survey.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-submit', App.handleSubmit);
  },

  // markAdopted: function (adopters, account) {
  //   var surveyInstance;

  //   App.contracts.Survey.deployed().then(function (instance) {
  //     console.log('instance', instance)
  //     surveyInstance = instance;

  //     return surveyInstance.getAdopters.call();
  //   }).then(function (adopters) {
  //     for (i = 0; i < adopters.length; i++) {
  //       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
  //         $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
  //       }
  //     }
  //   }).catch(function (err) {
  //     console.log(err.message);
  //   });
  // },

  // handleAdopt: function (event) {
  //   console.log('handleAdopt', event)
  //   event.preventDefault();

  //   // var petId = parseInt($(event.target).data('id'));

  //   var adoptionInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }
    
  //     var account = accounts[0];
    
  //     App.contracts.Adoption.deployed().then(function(instance) {
  //       adoptionInstance = instance;
    
  //       // Execute adopt as a transaction by sending account
  //       return adoptionInstance.adopt(petId, {from: account});
  //     }).then(function(result) {
  //       // return
  //       return App.markAdopted();
  //     }).catch(function(err) {
  //       console.log(err.message);
  //     });
  //   });
  // },

  handleSubmit: event => {
    console.log('handleSubmit', event)
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
