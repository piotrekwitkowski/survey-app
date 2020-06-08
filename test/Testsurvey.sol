pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Survey.sol";

contract Testsurvey{
 // The address of the adoption contract to be tested
 Survey survey1 = Survey(DeployedAddresses.Survey());
 uint test_amount = 9;
// Testing function set_amount_participants
function test_set_amount_pat() public {
survey1.set_amountparticipants(test_amount);
uint amountpat = survey1.get_amountparticipants();
Assert.equal (test_amount, amountpat, "Should match");
}

// Testing the get_URL function
//function test_owner_gets_URL() public {
 //string memory URL_gotten = survey1.get_URL();
 // Assert.equal("123", URL_gotten, "Should match.");
//}

}
