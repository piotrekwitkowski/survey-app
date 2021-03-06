import { LitElement, html } from 'lit-element';
const cryptico = require('cryptico-es6');

class SurveyElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      address: { type: String },
      instance: { type: Object },
      instanceData: { type: Object },
      answers: { type: Array },
      answersDecrypted: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.loadContractInstance().then(instance => {
      this.instance = instance;
      this.loadInstanceData();
    })
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
        state: data[6],
        publicKey: data[7]
      }
    })
  }

  logInstance() {
    console.log('instance:', this.instance, this.instanceData);
  }

  sendAnswers() {
    console.log('sendAnswers');
    const answers = Array.from(this.renderRoot.querySelectorAll('.answerInput'))
      .map(input => input.value)
      .map(answer => this.instanceData.publicKey ? cryptico.encrypt(answer, this.instanceData.publicKey).cipher : answer);

    const options = {
      from: web3.currentProvider.selectedAddress,
      value: web3.utils.toWei("" + this.instanceData.deposit, 'wei')
    };

    console.log('answers:', answers, 'options:', options);
    this.instance.methods.participate(answers).send(options).then(transaction => {
      console.log('sendAnswers transaction:', transaction);
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
    if (!this.answers) {
      this.instance.methods.getAnswers().call().then(answers => {
        this.answers = this.instanceData.questions.map((question, i) => ({
          q: question,
          a: answers.map(participantAnswers => participantAnswers[i])
        }))
        // console.log('seeAnswers:', answers, this.answers);
      })
    }
  }

  decryptAnswers() {
    const passphrase = this.renderRoot.querySelector('#passphrase').value;
    const privateKey = cryptico.generateRSAKey(passphrase, 1024);

    this.answers = this.answers.map(questionAndAnswers => ({
      q: questionAndAnswers.q,
      a: questionAndAnswers.a.map(answer => cryptico.decrypt(answer, privateKey).plaintext)
    }
    ));

    this.answersDecrpted = true;
  }

  render() {
    const participateModalId = `participateModal${this.address}`;
    const seeAnswersModalId = `seeAnswersModal${this.address}`;
    return html`
      <div style="padding-bottom:1rem">
        ${this.instanceData ? html`
          <h4>${this.instanceData.name ? this.instanceData.name : '(no title saved)'}</h4>
          <b>Address:</b> ${this.address}<br>
          <b>State:</b> ${this.stateDictionary(this.instanceData.state)},
          <b>Encryption:</b> ${this.instanceData.publicKey ? html`<a style="color:black" href='#' @click=${() => alert(`Public key: ${this.instanceData.publicKey}`)}>enabled` : html`disabled`},
          <b>Participants:</b> ${this.instanceData.answersLength}/${this.instanceData.totalParticipants},
          <b>Deposit:</b> ${this.instanceData.deposit} wei,
          <b>Reward:</b> ${this.instanceData.reward} wei<br>
          <b>Questions:</b> ${this.instanceData.questions.length ? html`
            <ol>${this.instanceData.questions.map(q => html`<li>${q}</li>`)}</ol>` : html`
            (no questions saved)<br>`}

          <button type="button" class="btn btn-outline-primary btn-sm" @click=${this.logInstance}>Log instance</button>
          ${this.instanceData.answersLength < this.instanceData.totalParticipants ? html`
            <button type="button" class="btn btn-outline-success btn-sm" data-toggle="modal" data-target=${'#' + participateModalId}>Participate</button>` : html`
            <button type="button" class="btn btn-outline-secondary btn-sm" disabled>All participants reached</button>`}

          ${this.instanceData.state < 2 ? html`
            <button type="button" class="btn btn-outline-secondary btn-sm" disabled>To see the answers the survey must be ENDED</button>` : html`
            <button type="button" class="btn btn-outline-success btn-sm" data-toggle="modal" data-target=${'#' + seeAnswersModalId} @click=${this.seeAnswers}>See answers</button>`}
          
        `: html`Instance data not loaded yet, check console.`}
      </div>


      <!-- Modal for participation -->
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
                  <input class="flex-fill form-control answerInput">
                </div>
                `)}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-success" data-dismiss="modal" @click=${this.sendAnswers}>Save answers</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal to see survey answers -->
      <div class="modal fade" id=${seeAnswersModalId} tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Answers</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

            ${this.instanceData.publicKey && !this.answersDecrpted ? html`
              <label class="flex-fill mr-2">Passphrase to decrypt the answers:</label>
              <input class="form-control" id='passphrase'>
              <button type="button" class=" mt-2 btn btn-outline-success btn-sm" @click=${this.decryptAnswers}>Decrypt</button>` : ''}
            
            ${this.answers ? this.answers.map(answersForQuestion => html`
                <div class='my-2'>
                  <label class="flex-fill mr-2">${answersForQuestion.q}</label>
                  <ol>${answersForQuestion.a.map(answer => html`<li style="overflow-wrap: break-word;">${answer}</li>`)}</ol>
                </div>
                `) : html`No answers for this survey yet or the answers can not be loaded!`}

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-success" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('x-survey', SurveyElement);
