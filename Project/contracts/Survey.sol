pragma solidity ^0.5.16;

contract Survey {
    address public _owner;
    string public _surveyname;
    string private _surveyURL;
    uint private _amountparticipants;
    enum State { Created, Open, Ended }
    State public state;
    
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
    
    function InitSurvey() public  _editor{
        state = State.Open;
        //Links need to be created, other stuff needs to be done :)
    }
}
    
