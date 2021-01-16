App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load cars.
    $.getJSON('../cars.json', function(data) {
      var carsRow = $('#carsRow');
      var carTemplate = $('#carTemplate');

      for (i = 0; i < data.length; i ++) {
        carTemplate.find('.panel-title').text(data[i].name);
        carTemplate.find('img').attr('src', data[i].picture);
        carTemplate.find('.car-speed').text(data[i].speed);
        carTemplate.find('.car-fully_charger').text(data[i].fully_charger);
        carTemplate.find('.car-battery').text(data[i].battery);
        carTemplate.find('.btn-book').attr('data-id', data[i].id);

        carsRow.append(carTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
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

  initContract: function() {
    $.getJSON('Booking.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var BookingArtifact = data;
      App.contracts.Booking = TruffleContract(BookingArtifact);

      // Set the provider for our contract
      App.contracts.Booking.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markBooked();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-book', App.handleAdopt);
  },

  markBooked: function() {
    var bookingInstance;

    App.contracts.Booking.deployed().then(function (instance) {
      bookingInstance = instance;

      return bookingInstance.getBookers.call();
    }).then(function (bookers) {
      for (i = 0; i < bookers.length; i++) {
        if (bookers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-car').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handleBook: function(event) {
    event.preventDefault();

    var carId = parseInt($(event.target).data('id'));
    
    var bookingInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Booking.deployed().then(function (instance) {
        bookingInstance = instance;

        // Execute adopt as a transaction by sending account
        return bookingInstance.book(carId, { from: account });
      }).then(function (result) {
        return App.markBooked();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
