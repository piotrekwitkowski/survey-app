// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

//import "./Participate.sol";

contract Survey {
    enum State {CREATED, OPEN, ENDED}

    address private _owner;

    string private _name;
    uint256 private _maxParticipants;
    uint256 private _deposit;
    uint256 private _reward;
    string[] private _questions;

    address[] private participantsList;
    string[][] private _answers;

    State public state;

    constructor(address owner) public {
        _owner = owner;
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

    function init(string memory name, uint256 maxParticipants, uint256 deposit, uint256 reward, string[] memory questions)
        public
        // onlyOwner
        requireStateCreated
    {
        _name = name;
        _maxParticipants = maxParticipants;
        _deposit = deposit * 1 wei;
        _reward = reward * 1 wei;
        _questions = questions;
        state = State.OPEN;
    }

    function getInfo() public view returns (string memory, string[] memory, uint256, uint256, uint256, uint256) {
        return (_name, _questions, _answers.length, _maxParticipants, _deposit, _reward);
    }

    function participate(
        // address public_key,
        // address participantAddress,
        string[] memory answers
    ) public requireStateOpen {
        //Participate participant = new Participate(this, caller);
        _answers.push(answers);

        if (_answers.length == _maxParticipants) {
            state = State.ENDED;
            // TODO: move state change to another private function that will
            // handle rewarding the participants when the survey is ended
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
