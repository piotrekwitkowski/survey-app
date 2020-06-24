pragma solidity >=0.5.0;
import "./Survey.sol";

contract Master{
    uint number_surveys = 0;
    Survey[] all_surveys;
    function NewSurvey(bytes[] quest) public{
        // can be called by everyone who wants to start a new survey via front end
        // erstellt eine Instanz von Survey
        address initiator = msg.sender;
        Survey this_survey = new Survey(); //heißt dann jede neue Survey gleich?
        this_survey.init(quest);
        all_surveys[number_surveys] = this_survey;
        number_surveys ++;
    }

    function ParticipateInSurvey(string memory public_key, string memory contract_key, Survey survey,  string[3] memory answers ) public{
        address caller = msg.sender;
         survey.participate(public_key,contract_key, answers, caller);
    }
    function FinishSurvey(Survey survey) public {
        //survey.release_deposits()
    }

    function ResultSurvey(Survey survey) public{
        //survey.retrieve_results()
    }
}