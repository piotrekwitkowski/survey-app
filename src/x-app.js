console.log('app.js loaded');
// import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';
import { LitElement, html, css } from 'lit-element';
const Transaction = require('ethereumjs-tx').Transaction;
const utils = require('ethereumjs-util');

console.log('Transaction:', Transaction)

import './x-survey.js';

class AppElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      masterInstance: { type: Object },
      surveys: { type: Array },
      answersEncryption: { type: Boolean }
    }
  }

  constructor() {
    super();
    ethereum.enable();
    console.log('web3 version:', web3.version);
    console.log('switching to window.web3 provider...');
    web3 = new Web3(window.web3.currentProvider);
    console.log('web3:', web3);
    console.log('new web3 version:', web3.version);

    fetch("Master.json")
      .then(res => res.json())
      .then(contractJSON => {
        console.log('contractJSON:', contractJSON);

        // this.masterInstance = new web3.eth.Contract(contractJSON.abi)
        web3.eth.net.getId().then(networkId => {
          const deployedAddress = contractJSON.networks[networkId].address;
          this.masterInstance = new web3.eth.Contract(contractJSON.abi, deployedAddress)
        })
      })
  }

  updated(changedProperties) {
    if (changedProperties.has('masterInstance')) {
      console.log('masterInstance', this.masterInstance);
      this.reloadSurveys();
    }
  }

  reloadSurveys() {
    this.masterInstance.methods.getSurveys().call().then(surveys => {
      console.log('surveys:', surveys);
      this.surveys = surveys;
    })
  }

  createSurvey() {

    const name = this.renderRoot.querySelector('#newSurveyName').value;
    const participants = this.renderRoot.querySelector('#newSurveyParticipants').value || 0;
    const deposit = this.renderRoot.querySelector('#newSurveyDeposit').value || 0;
    const reward = this.renderRoot.querySelector('#newSurveyReward').value || 0;
    const questions = this.renderRoot.querySelector('#newSurveyQuestions').value.split(';').filter(x => x);


    const options = {
      from: web3.currentProvider.selectedAddress,
      value: web3.utils.toWei("" + participants * reward, 'wei')
      // it really works, wei is really small and MetaMask will often show it as simply '0 eth'
      // but Ganache displays the value of the transaction correctly
    };

    console.log('createSurvey', 'name:', name, 'participants:', participants, 'deposit:', deposit, 'reward:', reward, 'questions', questions);

    this.masterInstance.methods.createSurvey(name, participants, deposit, reward, questions).send(options).then(transaction => {
      console.log('createSurvey transaction:', transaction);

      web3.shh.newKeyPair();

      const txHash = transaction.transactionHash;

      web3.eth.getTransaction(txHash).then(function (tx) {
        const pubkey = new Transaction({
          nonce: tx.nonce,
          gasPrice: utils.bufferToHex(new utils.BN(tx.gasPrice)),
          gasLimit: tx.gas,
          to: tx.to,
          value: utils.bufferToHex(new utils.BN(tx.value)),
          data: tx.input,
          r: tx.r,
          s: tx.s,
          v: tx.v,
        }, {
          chain: 2,//'localhost 7545',
          hardfork: 'spuriousDragon' //aber auch muirGlacier habe ich ausprobiert 
        }).getSenderPublicKey();
        console.log(pubkey.toString('hex'))
      }).catch(console.log)

      // const tr = new Transaction({
      //   ...transaction,
      //   gasPrice: utils.bufferToHex(new utils.BN(transaction.gasPrice)),
      //   gasLimit: transaction.gas,
      //   value: utils.bufferToHex(new utils.BN(transaction.value)),
      //   data: transaction.input,
      // },{
      //   chain: 1,//'testnet',
      //   hardfork: 'spuriousDragon'
      // });
      // const pubKey = tr.getSenderPublicKey();
      // console.log('pubKey:', pubKey)
      this.reloadSurveys();
    })
  }

  render() {
    return html`
      <div class="container">
        <div class="row">
          <div class="col">
            ${this.masterInstance ?
        html`<span class="badge badge-pill badge-success">Master contract OK</span>` :
        html`<span class="badge badge-pill badge-danger">Master contract instance not loaded!</span>`}
            
            <!-- <br> -->
            <!-- <button type="button" class="btn btn-outline-secondary btn-sm" @click=${this.reloadSurveys}>Reload surveys</button> -->

            ${this.surveys ? html`
              <p>Surveys count: ${this.surveys.length}</p>
              ${this.surveys.map(address => html`
                <x-survey .address=${address}></x-survey>
                `)}` : html`<p>No surveys</p>`}

            <button type="button" class="btn btn-success" data-toggle="modal" data-target='#createSurveyModal'>New survey</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="createSurveyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">New survey</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body">
              <div class="m-2">
                <label class="flex-fill mr-2">Survey name</label>
                <input type="text" class="form-control" id="newSurveyName">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Number of participants</label>
                <input type="number" class="form-control" id="newSurveyParticipants">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Deposit of this survey (wei per participant)</label>
                <input type="number" class="form-control" id="newSurveyDeposit">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Reward for this survey (wei per participant)</label>
                <input type="number" class="form-control" id="newSurveyReward">
              </div>
              <div class="m-2">
                <label class="flex-fill mr-2">Questions (split with ;)</label>
                <input type="text" class="form-control" id="newSurveyQuestions">
              </div>
              <div class="m-2 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1" @input=${console.log}>
                <label class="form-check-label" for="exampleCheck1">I want to encrypt the answers</label>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-success" data-dismiss="modal"  @click=${this.createSurvey}>Create survey</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('x-app', AppElement);