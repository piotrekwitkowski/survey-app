// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

contract Participate {
    string public_key;
    address contract_pub_key;
    // todo: how to store deposit in conract
    // store depoit deposit;
    string static_token = "I love surveys";

    /*
    To be called by the survey
    param public_key: user public key
    param contract_pub_key: public key of the calling contract
    */
    constructor(address contract_key) public {
        //stores the contract key for authentication
        // set_contract_key(contract_pub_key);
        contract_pub_key = contract_key;

        // store users depositie
        if (
            store_deposit() /*deposit?*/
        ) {
            // store users pub key
            setPubKey(public_key);

            // pass user
            survey_user();
        }
    }

    /*
    Function to store deposit in contract
    */
    function store_deposit() public pure returns (bool) {
        // todo: store deposit
        if (
            1 == 1 /*success*/
        ) {
            return true;
        } else {
            return false;
        }
    }

    /*
    Setter for the users public key
    */
    function setPubKey(string memory user_pub_key) private {
        public_key = user_pub_key;
    }

    /*
    Takes the static token encoded by the users private key and
    decodes it with the public key provided when the deposite was placed

    param public_key: users public_key
    param token: the private key encoded static token
    */
    function decode(string memory pub_key, string memory token)
        private
        pure
        returns (string memory)
    {
        string memory decoded_token = "";
        // todo: decode token with public key
        // return
        return decoded_token;
    }

    /*
    Pass user public key to survey for participation
    */
    function survey_user() private {
        // todo: register user with survey by passing public key
        // the pub key can be used later on for verification:
        // surveyKey(userKey(respone))) => user signed, contract encoded
    }

    /*
    Getter for the users public key
    */
    function getPubKey() public view returns (string memory) {
        return public_key;
    }

    /*
    param: private key encoded static token
    return: boolean if priv key belongs to pub key
    */
    function verify_user_participation(string memory token)
        public
        view
        returns (bool)
    {
        return compare(static_token, decode(public_key, token));
    }

    /*
    If the survey is completed it calls the participation contract to release the participants deposite
    */
    function release_deposit(string memory token) public view{
        if (compare(static_token, decode(public_key, token))) {
            // release deposite to user
        }
    }

    function compare(string memory _a, string memory _b) public pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint256 minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint256 i = 0; i < minLength; i++)
            if (a[i] < b[i]) return false;
            else if (a[i] > b[i]) return false;
        if (a.length < b.length) return false;
        else if (a.length > b.length) return false;
        else return true;
    }
}
