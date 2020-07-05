// import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';
import { LitElement, html, css } from 'lit-element';
import { Buffer } from 'safe-buffer';

// import * as EthCrypto from 'https://unpkg.com/eth-crypto@1.6.0/dist/es/index.js?module';
// import * as EthCrypto from 'eth-crypto';
// console.log('ethCrypto:', EthCrypto)

const ecies = require("eth-ecies");
console.log('ecies', ecies)
// console.log('ecies', ecies, Buffer)
window.ecies = ecies;

const publicKey = '4Aaa35F4E88c867d7643dA44B51e649AB8b2aEd8';
const data = '{foo:"bar",baz:42}';


// const enc = ecies.encrypt('4Aaa35F4E88c867d7643dA44B51e649AB8b2aEd8', [new Buffer('test', 'utf-8'));
// window.Buffer = ecies.Buffer
// console.log('enc:', enc)

console.log(web3.shh.version)
// web3.shh.newSymKey()
// .then(console.log);

class SurveyElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      address: { type: String },
      instance: { type: Object },
      instanceData: { type: Object },
    }
  }

  constructor() {
    super();
    this.loadContractInstance().then(instance => {
      this.instance = instance;
      this.loadInstanceData();
    })

    // console.log(web3.shh)
    // console.log(web3.shh.getInfo())
    // console.log(web3.shh.getVersion())
  }

  async loadContractInstance() {
    return fetch("Survey.json")
      .then(res => res.json())
      .then(contractJSON => new web3.eth.Contract(contractJSON.abi, this.address));
  }

  loadInstanceData() {
    this.instance.methods.getInfo().call().then(data => {
      this.instanceData = {
        name: data[0],
        totalParticipants: data[1],
        deposit: data[2],
        reward: data[3],
        questions: data[4],
        answersLength: data[5],
        state: data[6]
      }
    })
  }

  logInstance() {
    console.log('instance:', this.instance, this.instanceData);
  }

  sendAnswer() {
    console.log('sendAnswer');
    const answers = Array.from(this.renderRoot.querySelectorAll('input')).map(input => input.value);
    const options = {
      from: web3.currentProvider.selectedAddress,
      value: web3.utils.toWei("" + this.instanceData.deposit, 'wei')
    };

    console.log('answers:', answers, 'options:', options);
    this.instance.methods.participate(answers).send(options).then(transaction => {
      console.log('sendAnswer transaction:', transaction);
      this.loadInstanceData();
    })
  }

  stateDictionary(state) {
    if (state == 0) return "CREATED";
    if (state == 1) return "OPEN";
    if (state == 2) return "ENDED";
    return `UNKNOWN ${state}`
  }

  seeAnswers() {
    this.instance.methods.getAnswers().call().then(answers => {
      console.log('seeAnswers:', answers);
    })
  }

  render() {
    const participateModalId = `participateModal${this.address}`;
    return html`
      <div style="padding-bottom:1rem">
        ${this.instanceData ? html`
          <h4>${this.instanceData.name ? this.instanceData.name : '(no title saved)'}</h4>
          <b>Address:</b> ${this.address}<br>
          <b>State:</b> ${this.stateDictionary(this.instanceData.state)},
          <b>Participants:</b> ${this.instanceData.answersLength}/${this.instanceData.totalParticipants},
          <b>Deposit:</b> ${this.instanceData.deposit} wei,
          <b>Reward:</b> ${this.instanceData.reward} wei<br>
          <b>Questions:</b> ${this.instanceData.questions.length ? html`
            <ol>${this.instanceData.questions.map(q => html`<li>${q}</li>`)}</ol>
          `: html`(no questions saved)<br>`}

          <button type="button" class="btn btn-outline-primary btn-sm" @click=${this.logInstance}>Log instance</button>
          ${this.instanceData.answersLength < this.instanceData.totalParticipants ? html`
            <button type="button" class="btn btn-outline-success btn-sm" data-toggle="modal" data-target=${'#' + participateModalId}>Participate</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" disabled>See answers</button>
            ` : html`
            <button type="button" class="btn btn-outline-secondary btn-sm" disabled>All participants reached</button>
            <button type="button" class="btn btn-outline-success btn-sm" @click=${this.seeAnswers}>See answers</button>
          `}
          
        `: html`Instance data not loaded yet, check console.`}
      </div>


      <!-- Modal -->
      <div class="modal fade" id=${participateModalId} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Participate</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p><b>Deposit of this survey:</b> ${this.instanceData.deposit}wei</p>
              <p><b>Reward for this survey:</b> ${this.instanceData.reward}wei (paid when the survey is complete)</p>
              ${this.instanceData.questions.map(question => html`
                <div class='my-2'>
                  <label class="flex-fill mr-2">${question}</label>
                  <input class="flex-fill form-control">
                </div>
                `)}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-success" data-dismiss="modal" @click=${this.sendAnswer}>Save answers</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('x-survey', SurveyElement);
