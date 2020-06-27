// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

//import "./Participate.sol";

contract Survey {
    enum State {CREATED, OPEN, ENDED}

    address private _owner;
    string[] private _questions;
    string[][] private _answers;
    uint256 private _participants;
    uint256 public _maxParticipants = 3;
    address[] private participantsList;
    bool public finish = false;

    string public name;
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

    // function init(string[] memory questions, uint memory maxParticipants)
    function init(string[] memory questions)
        public
        // onlyOwner
        requireStateCreated
    {
        _questions = questions;
        // _maxParticipants = maxParticipants;
        state = State.OPEN;
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
            finish = true;
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
