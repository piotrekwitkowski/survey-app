// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
import "./Survey.sol";

contract Master {
    enum State {CREATED, OPEN, ENDED}
    Survey[] public surveys;
    uint constant deposit = 10;
    uint constant payment = 4;

    function createSurvey(string[] memory questions) public payable {
        // can be called by everyone who wants to start a new survey via frontend
        // erstellt eine Instanz von Survey
        address initiator = msg.sender;
        Survey survey = new Survey(initiator);
        if (msg.value < survey._maxParticipants * payment) {
            revert("Payment for participants is not sufficient");
        } else {
        survey.init(questions);
        surveys.push(survey);
        }
    }

    function participateInSurvey (
        string[] memory answers,
        Survey survey
    ) public payable {
         address caller = msg.sender;
         // deposit hinterlegen
        if (msg.value < deposit){
            revert("Payment was lower than requested deposit"); 
        } else
        {
            survey.participate(answers, caller);
            if (survey.state == State.ENDED)  {
                returnDeposit(survey.getParticipantList, survey);
            }
        } 
    }

    function getSurveyAnswers(Survey survey) public view returns (string[][] memory) {
        return survey.getAnswers();
    }

    function returnDeposit(address[] memory participantsList, Survey survey) private {
        for (uint i = 0; i < survey._maxParticipants; i++) {
            address participant = participantsList[i];
            participant.send(deposit+payment);
        }


    }

    // should be fired automatically!
    // function finishSurvey(Survey survey) public {
    //     //survey.release_deposits()
    // }
}
