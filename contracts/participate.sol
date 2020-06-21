pragma solidity >=0.5.0;

contract participate {
    bytes32 public_key;
    bytes32 contract_pub_key;
    // todo: how to store deposit in conract
    // store depoit deposit;
    string static_token = "I love surveys";

    /*
    To be called by the survey
    param public_key: user public key
    param contract_pub_key: public key of the calling contract
    */
    constructor(byte32 memory public_key, bytes32 contract_pub_key){
        //stores the contract key for authentication
        set_contract_key(contract_pub_key);
        
        // store users depositie
        if (store_deposit(/*deposit?*/)) {
            // store users pub key
            setPubKey(user_pub_key);
            
            // pass user 
            survey_user();
        }
    }

    /*
    Function to store deposit in contract
    */
    private function store_deposit() {
        // todo: store deposit
        if(/*success*/) {
            return true
        } else {
            return false
        }
    }

    /* 
    Setter for the users public key
    */
    private function setPubKey(bytes32 user_pub_key) {
        public_key = user_pub_key;
    }

    /*
    Takes the static token encoded by the users private key and 
    decodes it with the public key provided when the deposite was placed

    param public_key: users public_key
    param token: the private key encoded static token
    */
    private function decote(bytes32 public_key, string token) {
        string decoded_token = '';
        // todo: decode token with public key
        // return 
        return decoded_token;
    }

    /* 
    Pass user public key to survey for participation
    */
    private function survey_user() {
        // todo: register user with survey by passing public key
        // the pub key can be used later on for verification:
        // surveyKey(userKey(respone))) => user signed, contract encoded 
    }

    /* 
    Getter for the users public key
    */
    function getPubKey() constant returns (bytes32) {
        return pubKey;
    }

    /*
    param: private key encoded static token
    return: boolean if priv key belongs to pub key
    */
    function verify_user_participation(string token) {
        if(static_token == decode(public_key, token)){
            return true
        } else {
            return false
        }
    }


    /*
    If the survey is completed it calls the participation contract to release the participants deposite
    */
    function release_deposit(string token) {
        if(static_token == decode(contract_pub_key, token)){
            // release deposite to user
        }
    }
}
