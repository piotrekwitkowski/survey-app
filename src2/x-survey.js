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
        questions: data[1],
        participants: data[2],
        maxParticipants: data[3],
        deposit: data[4],
        reward: data[5]
      }
    })
  }

  logInstance() {
    console.log('instance:', this.instance);
  }

  render() {
    return html`
      <div style="padding-bottom:1rem">
        ${this.instanceData ? html`
          <h4>${this.instanceData.name}</h4>
          <b>Address:</b> ${this.address}<br>
          <b>Participants:</b> ${this.instanceData.participants}/${this.instanceData.maxParticipants},
          <b>Deposit:</b> ${this.instanceData.deposit} wei,
          <b>Reward:</b> ${this.instanceData.reward} wei<br>
          <b>Questions:</b>
            <ol>
              ${this.instanceData.questions.map(q => html`<li>${q}</li>`)}
            </ol>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click=${this.logInstance}>Log instance</button>
          <!-- <button type="button" class="btn btn-outline-success btn-sm" @click=${this.participate}>Participate</button> -->
          <button type="button" class="btn btn-outline-success btn-sm" data-toggle="modal" data-target="#paritcipateModal">Participate</button>
        `: html`Instance data not loaded yet, check console.`}
      </div>


      <!-- Modal -->
      <div class="modal fade" id="paritcipateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                <div class='m-2'>
                  <label class="flex-fill mr-2">${question}</label>
                  <input class="flex-fill form-control">
                </div>
                `)}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-success">Save answers</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('x-survey', SurveyElement);
