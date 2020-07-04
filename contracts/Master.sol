// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
import "./Survey.sol";

contract Master {
    Survey[] public surveys;

    function getSurveys() public view returns (Survey[] memory) {
        return surveys;
    }

    function createSurvey(
        string memory name,
        uint256 participants,
        uint256 deposit,
        uint256 reward,
        string[] memory questions
    ) public payable {
        Survey survey = new Survey(msg.sender);
        survey.init.value(msg.value)(name, participants, deposit, reward, questions);
        surveys.push(survey);
    }

    // function participateInSurvey(string[] memory answers, Survey survey)
    //     public
    //     payable
    // {
    //     address caller = msg.sender;
    //     // deposit hinterlegen
    //     if (msg.value < deposit) {
    //         revert("Payment was lower than requested deposit");
    //     } else {
    //         survey.participate(answers, caller);
    //         if (survey.finish() == true) {
    //             returnDeposit(survey.getParticipantList(), survey);
    //         }
    //     }
    // }

    // function getSurveyAnswers(Survey survey)
    //     public
    //     view
    //     returns (string[][] memory)
    // {
    //     return survey.getAnswers();
    // }

    // function returnDeposit(address[] memory participantsList, Survey survey)
    //     private
    // {
    //     for (uint256 i = 0; i < survey._maxParticipants(); i++) {
    //         address participant = participantsList[i];
    //         address(uint160(participant)).transfer(deposit + payment);
    //     }
    // }

    // should be fired automatically!
    // function finishSurvey(Survey survey) public {
    //     //survey.release_deposits()
    // }
}
