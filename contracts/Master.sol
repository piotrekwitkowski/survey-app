// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
import "./Survey.sol";

contract Master {
    Survey[] public surveys;

    function createSurvey(string[] memory questions) public {
        // can be called by everyone who wants to start a new survey via frontend
        // erstellt eine Instanz von Survey
        address initiator = msg.sender;
        Survey survey = new Survey(initiator); //heißt dann jede neue Survey gleich?
        survey.init(questions);
        surveys.push(survey);
    }

    function participateInSurvey(
        address contract_key,
        string[] memory answers,
        // address memory public_key,
        Survey survey
    ) public {
        // address caller = msg.sender;
        // survey.participate(public_key, contract_key, answers, caller);
        survey.participate(contract_key, answers);
    }

    function getSurveyAnswers(Survey survey) public view returns (string[][] memory) {
        return survey.getAnswers();
    }

    // should be fired automatically!
    // function finishSurvey(Survey survey) public {
    //     //survey.release_deposits()
    // }
}
