// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

//import "./Participate.sol";

contract Survey {
    enum State {CREATED, OPEN, ENDED}

    address private _owner;

    string private _name;
    string[] private _questions;
    uint256 private _participants;
    uint256 public _maxParticipants;
    uint256 constant _deposit = 10 wei;
    uint256 constant _reward = 1 wei;

    address[] private participantsList;
    string[][] private _answers;

    State public state;

    constructor(address owner) public {
        _owner = owner;
        _participants = 0;
        state = State.CREATED;
    }

    modifier onlyOwner {
        require(msg.sender == _owner, "Sender is not the owner");
        _;
    }

    modifier requireStateCreated {
        require(state == State.CREATED, "Current state must be CREATED");
        _;
    }

    modifier requireStateOpen {
        require(state == State.OPEN, "Current state must be OPEN");
        _;
    }

    function init(string memory name, string[] memory questions, uint256 maxParticipants)
        public
        // onlyOwner
        requireStateCreated
    {
        _name = name;
        _questions = questions;
        _maxParticipants = maxParticipants;
        state = State.OPEN;
    }

    function getInfo() public view returns (string memory, string[] memory, uint256, uint256, uint256, uint256) {
        return (_name, _questions, _participants, _maxParticipants, _deposit, _reward);
    }

    function participate(
        // address public_key,
        // address participantAddress,
        string[] memory answers,
        address caller
    ) public requireStateOpen {
        //Participate participant = new Participate(this, caller);
        participantsList.push(caller);
        _answers[_participants] = answers;
        _participants++;

        if (_participants == _maxParticipants) {
            state = State.ENDED;
        }
    }

    function getAnswers() public view returns (string[][] memory) {
        require(state == State.ENDED, "State is not ENDED");
        return _answers;
    }

    function getParticipantList() public view returns (address[] memory) {
        address[] memory List = participantsList;
        return List;
    }
}
