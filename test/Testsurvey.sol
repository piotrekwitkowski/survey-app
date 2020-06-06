pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Survey.sol";

contract Testsurvey{
 // The address of the adoption contract to be tested
 Survey survey1 = Survey(DeployedAddresses.Survey("89","89",4));

// Testing the get_URL function
function test_owner_gets_URL() public {
 string URL_gotten = survey1.get_URL();

  Assert.equal("89", URL_gotten, "Should match.");
}

}
