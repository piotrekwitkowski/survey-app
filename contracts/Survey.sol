// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

contract Survey {
    enum State {CREATED, OPEN, ENDED}

    address private _owner;

    string private _name;
    uint256 private _participants;
    uint256 private _deposit;
    uint256 private _reward;
    string[] private _questions;

    address[] private participantsList;
    string[][] private _answers;

    State public state;

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

    constructor(address owner) public {
        _owner = owner;
        state = State.CREATED;
    }

    function init(
        string memory name,
        uint256 participants,
        uint256 deposit,
        uint256 reward,
        string[] memory questions
    ) public payable requireStateCreated {
        if (msg.value == participants * reward) {
            _name = name;
            _participants = participants;
            _deposit = deposit * 1 wei;
            _reward = reward * 1 wei;
            _questions = questions;
            state = State.OPEN;
        } else {
            revert(
                "createSurvey transaction value doesn't match rewards for participants"
            );
        }
    }

    function getInfo()
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            string[] memory,
            uint256,
            State
        )
    {
        return (
            _name,
            _participants,
            _deposit,
            _reward,
            _questions,
            _answers.length,
            state
        );
    }

    function participate(
        // address public_key,
        // address participantAddress,
        string[] memory answers
    ) public requireStateOpen {
        //Participate participant = new Participate(this, caller);
        _answers.push(answers);
        if (_answers.length == _participants) {
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
