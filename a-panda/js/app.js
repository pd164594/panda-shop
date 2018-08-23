App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    return App.initWeb3();
  },
  
  initWeb3: function() {
    // metamask and mist inject their own web3 instances, so just 
    // set the provider if it exists
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider("http://localhost:8545");
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PandaOwnership.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var PandaArtifact = data;
      App.contracts.Panda = TruffleContract(PandaArtifact);

      // Set the provider for our contract.
      App.contracts.Panda.setProvider(App.web3Provider);

      // // Use our contract to retieve and mark the adopted pets.
      // return App.markAdopted();
    });

    return App.getOwnerPandas();
  },

  // bindEvents: function() {
  //   $(document).on('click', '.btn-buy', App.buy);
  // },

  getOwnerPandas: () => {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      $('#account').text("Account: " + account)

      App.contracts.Panda.deployed().then(function(instance) {
        pandaInstance = instance;
        debugger
        // pandaInstance.createRandomPanda({from: account});
        pandaInstance.pandasOf(account).then(function(result) {
          console.log(result)
          for(var i = 0; i < result.length; i++){
            // console.log(result[i].c[0])
            App.getPandaById(result[i].c[0])
          }
        }).catch(function(err) {
          debugger
          // console.log(err.message);
        });
      })
    });
  },

  getPandaById: (id) => {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Panda.deployed().then(function(instance) {
        pandaInstance = instance;

        // return pandaInstance.createRandomPanda({from: account});
        pandaInstance.pandas(id).then(function(result) {
          appendPanda(result.c[1])
        }).catch(function(err) {
          debugger
          // console.log(err.message);
        });
      })
    });
  },

  handleBuy: function() {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Panda.deployed().then(function(instance) {
        pandaInstance = instance;

        // return pandaInstance.createRandomPanda({from: account});
        pandaInstance.sendTransaction({
          from: account,
          gas: 210000,
          value: 100000000000000000
        }).then(function(result) {
          debugger
          // return App.markAdopted();
        }).catch(function(err) {
          debugger
          // console.log(err.message);
        });
      })
    });
  },

  // markAdopted: function(adopters, account) {
  //   var adoptionInstance;

  //   App.contracts.Adoption.deployed().then(function(instance) {
  //     adoptionInstance = instance;

  //     return adoptionInstance.getAdopters.call();
  //   }).then(function(adopters) {
  //     for (i = 0; i < adopters.length; i++) {
  //       if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
  //         $('.panel-pet').eq(i).find('button').text('Pending...').attr('disabled', true);
  //       }
  //     }
  //   }).catch(function(err) {
  //     console.log(err.message);
  //   });
  // }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

console.log("app")