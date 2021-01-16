pragma solidity ^0.5.0;

contract Booking {
    address[7] public bookers;

    function book(uint carId) public returns (uint) {
        require(carId >= 0 && carId <=6);
        bookers[carId] = msg.sender;
        return carId;
    }

    function getBookers() public view returns (address[7] memory) {
        return bookers;
    }
}