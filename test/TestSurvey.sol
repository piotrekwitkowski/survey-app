pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Survey.sol";

contract Testsurvey {
    // The address of the adoption contract to be tested
    Survey survey = Survey(DeployedAddresses.Survey());

    uint256 test_amount = 3;

    // Testing function set_amount_participants
    function test_set_amount_pat() public {
        survey.set_amountparticipants(test_amount);
        uint256 amountpat = survey.get_amountparticipants();
        Assert.equal(test_amount, amountpat, "Should match");
    }

    // Testing the get_URL function
    function test_owner_gets_URL() public {
        string memory URL_gotten = survey.get_URL();
        Assert.equal("SurveyURL", URL_gotten, "Should match.");
    }

    // Testing set_amount_questions 
   // function test_set_amount_qu() public {
     //   uint am = 3;
       // survey.set_amount_questions(am);
        //uint am2 = surey.get_amountparticipants();
       // Assert.equal(am, am2, "Should match");
    //}

    // Testing preparing Survey
    function test_prepare_survey() public {
        string[3]memory questions = ["How old are you?","Whats your name?","Gender?"];
        string[3] memory questionnair = survey.PrepareSurvey(questions);
        for( uint i = 0; i < questions.length; i++) {
            Assert.equal(questions[i], questionnair[i], "Should match");
        }
    }
}
