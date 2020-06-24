// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
import "./Participate.sol";

contract Survey {
    enum State {CREATED, OPEN, ENDED}
    address private _owner;
    bytes[] private _questions;
    bytes[] private _answers;
    bytes[][] private survey_storage;
    uint256 private _participants = 0;
    uint256 private _maxParticipants = 3; 
    Participate[3] List_of_participants; 

    string public name;
    State public state;

    constructor() public {
        _owner = msg.sender; // macht das noch Sinn wenn es immer Master ist der aufruft
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

    function init(bytes[] memory questions)
        public
        onlyOwner
        requireStateCreated
    {
        _questions = questions; 
        state = State.OPEN;
    }



    function participate(string memory public_key, string memory contract_key, string[3] memory answers, address part) public
        returns (string[3][3] memory) { 
        require(
             _participants <= _maxparticipants,
             "too many participants"
);
         Participate this_participant = new Participate(public_key, contract_key); //speichern!!
        if(this_participant.store_deposit()) {
            Participant[_participants] = Participant(this_participant);

         for (uint256 i = 0; i < 3; i++) {
             survey_storage[_participants][i] = answers[i];
         }
         _participants++;
         if (_participants == _maxparticipants) {
             state = State.ENDED;
         }
        return survey_storage;
         }
     }

     function retrieve_results() public view returns (string[3][3] memory) {
         require(state == State.ENDED, "State is not ENDED");
         return survey_storage;
     }
}
