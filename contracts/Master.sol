// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;
import "./Survey.sol";

contract Master {
    Survey[] public surveys;

    function getSurveys() public view returns (Survey[] memory) {
        return surveys;
    }

    function createSurvey(
        string memory name,
        uint256 participants,
        uint256 deposit,
        uint256 reward,
        string[] memory questions,
        bool answersEncrypted
    ) public payable {
        Survey survey = new Survey(msg.sender);
        survey.init.value(msg.value)(name, participants, deposit, reward, questions, answersEncrypted);
        surveys.push(survey);
    }

}
