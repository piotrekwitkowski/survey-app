import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

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
        participants: data[1],
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
    const options = { from: web3.currentProvider.selectedAddress };

    console.log('answers:', answers, 'options:', options);
    this.instance.methods.participate(answers).send(options).then(transaction => {
      console.log('sendAnswer transaction:', transaction);
      this.loadInstanceData();
    })
  }

  render() {
    const participateModalId = `participateModal${this.address}`;
    return html`
      <div style="padding-bottom:1rem">
        ${this.instanceData ? html`
          <h4>${this.instanceData.name ? this.instanceData.name : '(no title saved)'}</h4>
          <b>Address:</b> ${this.address}<br>
          <b>Participants:</b> ${this.instanceData.answersLength}/${this.instanceData.participants},
          <b>Deposit:</b> ${this.instanceData.deposit} wei,
          <b>Reward:</b> ${this.instanceData.reward} wei<br>
          <b>Questions:</b> ${this.instanceData.questions.length ? html`
            <ol>${this.instanceData.questions.map(q => html`<li>${q}</li>`)}</ol>
          `: html`(no questions saved)<br>`}

          <button type="button" class="btn btn-outline-primary btn-sm" @click=${this.logInstance}>Log instance</button>
          ${this.instanceData.answersLength < this.instanceData.participants ?
          html`<button type="button" class="btn btn-outline-success btn-sm" data-toggle="modal" data-target=${'#' + participateModalId}>Participate</button>` :
          html`<button type="button" class="btn btn-outline-secondary btn-sm" disabled>All participants reached</button>`}
          
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
