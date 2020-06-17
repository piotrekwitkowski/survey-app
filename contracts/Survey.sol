// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

contract Survey {
    address public _owner;
    string public _surveyname;
    string private _surveyURL;
    uint256 private _amountparticipants=3;
    uint256 private _actual_participants = 0;
    enum State {CREATED, OPEN, ENDED}
    State public state;
    string[3] public survey_questionnair;
    string[3][3] private survey_storage;
    uint256 private _amountquestions = 3;

    constructor(
        string memory name,
        string memory URL,
        uint256 participants
    ) public {
        _owner = msg.sender;
        _surveyname = name;
        _surveyURL = URL;
        _amountparticipants = participants;
        state = State.CREATED;
    }

    function get_URL() public view returns (string memory) {
        return _surveyURL;
    }

    function get_amountparticipants() public view returns (uint256) {
        return _amountparticipants;
    }

    modifier _editor {
        require(msg.sender == _owner, "Sender is not the owner");
        _;
        // can add other contracts that need to do something
    }

    function set_amountparticipants(uint256 new_participantnumber)
        public
    {
        require(state == State.CREATED, "State is not CREATED");
        _amountparticipants = new_participantnumber;
    }

    function set_amountquestions(uint256 amount) public
    {
        require(state == State.CREATED, "State is not CREATED");
        _amountquestions = amount;
    } 
    
    function get_amountquestions() 
    public
    returns(uint amount) 
    {
        return _amountquestions;
    }

    function PrepareSurvey(string[3] memory questions)
        public
        returns (string[3] memory)
    {
        require(state == State.CREATED, "State is not CREATED");
        for (uint256 i = 0; i < _amountquestions; i++) {
            survey_questionnair[i] = questions[i];
        }
        return survey_questionnair;
    }

    function InitSurvey() public  returns (string[3][3] memory) {
        require(state == State.CREATED, "State is not CREATED");
        state = State.OPEN;
        survey_storage[_amountparticipants][_amountquestions];
        return survey_storage;
    }

    function participate(string[3] memory answers) public {
        require(state == State.OPEN, "State is not OPEN");
        require(msg.sender != _owner, "Sender is not the owner");
        require(
            _actual_participants < _amountparticipants,
            "too many participants"
        );

        for (uint256 i = 0; i <= _amountquestions; i++) {
            survey_storage[_actual_participants][i] = answers[i];
        }
        _actual_participants++;
        if (_actual_participants == _amountparticipants) {
            state = State.ENDED;
        }
    }

    function retrieve_results()
        public
        view
        returns (string[3][3] memory)
    {
        require(state == State.ENDED, "State is not ENDED");
        return survey_storage;
    }
}
