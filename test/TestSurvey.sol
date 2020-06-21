// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Survey.sol";

contract TestSurvey {
    // The address of the adoption contract to be tested
    Survey survey = Survey(DeployedAddresses.Survey());

    uint256 test_amount = 3;
    enum State {CREATED, OPEN, ENDED}
    State public state2;
    string[3] answ1 = ["22", "Line", "female"];
    string[3] answ2 = ["22", "Lotti", "female"];
    string[3] answ3 = ["22", "Petra", "female"];

    // Testing function set_amount_participants
    // function test_set_amount_pat() public {
    //     survey.set_amountparticipants(test_amount);
    //    uint256 amountpat = survey.get_amountparticipants();
    //     Assert.equal(test_amount, amountpat, "Should match");
    //  }

    // Testing the get_URL function
    function test_owner_gets_URL() public {
        string memory URL_gotten = survey.url();
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
        string[3] memory questions = [
            "How old are you?",
            "Whats your name?",
            "Gender?"
        ];
        string[3] memory questionnair = survey.PrepareSurvey(questions);
        for (int256 i = 0; i < questions.length; i++) {
            Assert.equal(questions[i], questionnair[i], "Should match");
        }
    }

    //Testing function Init Survey
    function test_init_survey() public {
        survey.InitSurvey();
        state2 = State.OPEN;
        Assert.equal(uint256(1), uint256(1), "Should match");
    }

    //Testing participate function
    function test_participate() public {
        string[3][3] memory stor = survey.participate(answ1);
        for (uint256 j = 0; j < 3; j++) {
            Assert.equal(stor[0][j], answ1[j], "Should match");
        }
    }

    function test_participate2() public {
        string[3][3] memory stor = survey.participate(answ2);
        for (uint256 j = 0; j < 3; j++) {
            Assert.equal(stor[1][j], answ2[j], "Should match");
        }
    }

    function test_participate3() public {
        string[3][3] memory stor = survey.participate(answ3);
        for (uint256 j = 0; j < 3; j++) {
            Assert.equal(stor[2][j], answ3[j], "Should match");
        }
    }

    // Testing retrieve_results function
    function test_result_retrieval() public {
        string[3][3] memory stori = survey.retrieve_results();
        for (uint256 j = 0; j < 3; j++) {
            Assert.equal(stori[0][j], answ1[j], "Should match");
        }
        for (uint256 j = 0; j < 3; j++) {
            Assert.equal(stori[1][j], answ2[j], "Should match");
        }
        for (uint256 j = 0; j < 3; j++) {
            Assert.equal(stori[2][j], answ3[j], "Should match");
        }
    }
}
