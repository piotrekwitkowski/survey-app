// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

contract Survey {
    enum State {CREATED, OPEN, ENDED}

    address private _owner;
    string[] private _questions;
    bytes[] private _answers;
    uint256 private _participants;
    uint256 private _maxParticipants;

    string public name;
    string public url;
    State public state;

    constructor() public {
        _owner = msg.sender;
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

    function init(string[] memory questions)
        public
        onlyOwner
        requireStateCreated
    {
        _questions = questions;
        state = State.OPEN;
    }

    // function participate(string[3] memory answers)
    //     public
    //     returns (string[3][3] memory)
    // {
    //     require(state == State.OPEN, "State is not OPEN");
    //     require(msg.sender != owner, "Sender is not the owner");
    //     require(
    //         _actual_participants < _amountparticipants,
    //         "too many participants"
    //     );

    //     for (uint256 i = 0; i < _amountquestions; i++) {
    //         survey_storage[_actual_participants][i] = answers[i];
    //     }
    //     _actual_participants++;
    //     if (_actual_participants == _amountparticipants) {
    //         state = State.ENDED;
    //     }
    //     return survey_storage;
    // }

    // function retrieve_results() public view returns (string[3][3] memory) {
    //     require(state == State.ENDED, "State is not ENDED");
    //     return survey_storage;
    // }
}
