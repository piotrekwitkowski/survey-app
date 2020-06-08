pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Survey {
    address public _owner;
    string public _surveyname;
    string private _surveyURL = "123";
    uint private _amountparticipants;
    enum State { Created, Open, Ended }
    State public state;
    string[] survey_questionnair;
    string[][] survey_storage;

    constructor(string memory name, string memory URL, uint participants) public{
        _owner = msg.sender;
        _surveyname = name;
        _surveyURL = URL;
        _amountparticipants = participants;
        state = State.Created;

    }
function get_URL() public view returns (string memory) {
        return _surveyURL;
    }

    function get_amountparticipants() public view  returns (uint) {
        return _amountparticipants;
    }

    modifier _editor{
        require(msg.sender == _owner);
        _;
        // can add other contracts that need to do something
    }

    function set_amountparticipants(uint new_participantnumber) public  _editor{
        require(state == State.Created);
        _amountparticipants = new_participantnumber;
    }
    
     function PrepareSurvey(string[] memory questions ) public _editor returns(string[] memory)  {
        require(state == State.Created);
                for (uint i = 0; i < _amountparticipants; i++) {
                         survey_questionnair[i] = questions[i];
                }
                return survey_questionnair;
        }

   function InitSurvey(uint _amountquestions) public _editor returns(string[][] memory) {
        require (state == State.Created);
        state = State.Open;
        survey_storage[_amountparticipants][_amountquestions];
        return survey_storage;

        }


}
