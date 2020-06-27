// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
import "./Survey.sol";

contract Master {
    uint256 constant deposit = 10 ether;
    uint256 constant payment = 4 ether;
    Survey[] public surveys;

    function getSurveys() public view returns (Survey[] memory) {
        return surveys;
    }

    function createSurvey(string[] memory questions) public payable {
        // can be called by everyone who wants to start a new survey via frontend
        // erstellt eine Instanz von Survey
        address initiator = msg.sender;
        Survey survey = new Survey(initiator);
        if (msg.value < survey._maxParticipants() * payment) {
            revert("Payment for participants is not sufficient");
        } else {
            survey.init(questions);
            surveys.push(survey);
        }
    }

    function participateInSurvey(string[] memory answers, Survey survey)
        public
        payable
    {
        address caller = msg.sender;
        // deposit hinterlegen
        if (msg.value < deposit) {
            revert("Payment was lower than requested deposit");
        } else {
            survey.participate(answers, caller);
            if (survey.finish() == true) {
                returnDeposit(survey.getParticipantList(), survey);
            }
        }
    }

    function getSurveyAnswers(Survey survey)
        public
        view
        returns (string[][] memory)
    {
        return survey.getAnswers();
    }

    function returnDeposit(address[] memory participantsList, Survey survey)
        private
    {
        for (uint256 i = 0; i < survey._maxParticipants(); i++) {
            address participant = participantsList[i];
            address(uint160(participant)).transfer(deposit + payment);
        }
    }

    // should be fired automatically!
    // function finishSurvey(Survey survey) public {
    //     //survey.release_deposits()
    // }
}
