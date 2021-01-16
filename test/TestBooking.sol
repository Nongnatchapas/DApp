pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Booking.sol";

contract TestBooking {
  // The address of the Booking contract to be tested
  Booking booking = Booking(DeployedAddresses.Booking());

  // The id of the pet that will be used for testing
  uint expectedCarId = 5;

  //The expected owner of adopted pet is this contract
  address expectedBooker = address(this);

  function testUserCanBookCar() public {
    uint returnedId = booking.book(expectedCarId);
    Assert.equal(returnedId, expectedCarId, "Booking of the expected pet should match what is returned.");
  }

  // Testing retrieval of a single pet's owner
  function testGetBookerAddressByCarId() public {
    address booker = booking.bookers(expectedCarId);
    Assert.equal(booker, expectedBooker, "Booker of the expected pet should be this contract");
  }

  // Testing retrieval of all pet owners
  function testGetBookerAddressByCarIdInArray() public {
    // Store adopters in memory rather than contract's storage
    address[7] memory bookers = booking.getBookers();
    Assert.equal(bookers[expectedCarId], expectedBooker, "Booker of the expected pet should be this contract");
  }
}