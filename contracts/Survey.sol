pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract Survey {
    address public _owner;
    string public _surveyname;
    string private _surveyURL = "123";
    uint private _amountparticipants;
    uint private _actual_participants = 0;
    enum State { Created, Open, Ended }
    State public state;
    string[] public survey_questionnair;
    string[][] private survey_storage;
    uint private _amountquestions; 

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
    
     function PrepareSurvey(string[] memory questions, uint amountquestions ) public _editor returns(string[] memory)  {
        require(state == State.Created);
        _amountquestions = amountquestions-1;
                for (uint i = 0; i < _amountquestions; i++) {
                         survey_questionnair[i] = questions[i];
                }
                return survey_questionnair;
        }

   function InitSurvey() public _editor returns(string[][] memory) {
        require (state == State.Created);
        state = State.Open;
        survey_storage[_amountparticipants][_amountquestions];
        return survey_storage;

        }
    function participate(string[] memory answers) public {
        require (state == State.Open && (_actual_participants < _amountparticipants) && (msg.sender != _owner));
        for (uint i = 0; i <= _amountquestions; i++ ) {
           survey_storage[_actual_participants][i] =  answers[i];
        }
        _actual_participants ++; 
        if (_actual_participants == _amountparticipants) {
            state = State.Ended; 
        }
    }
    
    function retrieve_results () public view _editor returns(string[][] memory) {
        require (state == State.Ended);
        return survey_storage;
    }

}



