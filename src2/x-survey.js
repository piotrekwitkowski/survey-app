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
      <b>Address:</b> ${this.address}<br>
      ${this.instanceData ? html`
        <b>Name:</b> ${this.instanceData.name}<br>
        <b>Questions:</b> ${this.instanceData.questions}<br>
        <b>Participants:</b> ${this.instanceData.participants}/${this.instanceData.maxParticipants}<br>
        <b>Deposit:</b> ${this.instanceData.deposit} wei, <b>Reward:</b> ${this.instanceData.reward} wei<br>
      `: html`Instance data not loaded yet.`}
      
      <p>
        <button type="button" class="btn btn-secondary" @click=${this.logInstance}>Log instance</button>
        <!-- <button type="button" class="btn btn-secondary" @click=${this.logQuestions}>Log questions</button> -->
        <!-- <button type="button" class="btn btn-secondary" @click=${() => this.logParticipants()}>Log participants</button> -->
        <!-- <button type="button" class="btn btn-secondary" @click=${this.logMaxParticipants}>Log max participants</button> -->
      </p>
    `;
  }
}

customElements.define('x-survey', SurveyElement);
