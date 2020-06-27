import { LitElement, html, css } from 'lit-element';
class StateCreatedElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      web3: { type: Object },
      surveyInstance: { type: Object },
      participants: { type: Number },
      // questions will actually contain only empty strings, because lit-element uses one-way data binding.
      // the questions must be copied from textfields on submit (on initSurvey())
      questions: { type: Array },
    }
  }

  constructor() {
    super();
    this.questions = [''];
    this.participants = 1;
    console.log(this.web3)
  }

  addQuestion() {
    this.questions.push("");
    this.requestUpdate();
  }

  removeQuestion(question) {
    const index = this.questions.indexOf(question);
    if (index > -1) {
      this.questions.splice(index, 1);
      this.requestUpdate();
    }
  }

  initSurvey() {
    console.log('initSurvey', this.surveyInstance);
    const instance = this.surveyInstance;
    const questions = this.getQuestions();
    // const questionsBytes = questions.map(q=> web3.utils.utf8ToHex(q));
    const participants = this.participants;

    // const getData = instance.init.getData();
    // console.log('getData', getData)

    console.log('aaaa', web3)

    let account;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }    
      console.log('accounts[0]', accounts[0])
      account = accounts[0];

      console.log('calling surveyInstance.init with:', questions, participants, {from: account}); 
      instance.init(questions, participants, {from: account});
    });
  }

  getQuestions() {
    const questionInputs = document.querySelectorAll(".questionInput");
    return Array.from(questionInputs).map(input => input.value);
  }

  render() {
    return html`
      <h2>Time to create the survey!</h2>

      <form class="form-inline">
        <label class="flex-fill mr-2">How many participants?</label>
        <input type="number" class="flex-fill form-control m-2" value=${this.participants}>
        <button type="button" class="btn btn-secondary m-2" @click=${() => this.initSurvey()}>Init the survey</button>
        <button type="button" class="btn btn-success m-2" @click=${() => this.addQuestion()}>Add questions</button>
      </form>
      
      ${this.questions.map(q => html`
        <div class="form-group">              
          <label class="mr-2">Question:</label>
          <div class="d-flex">
            <input type="text" class="form-control mr-2 questionInput" placeholder="Please specify the question">
            <!-- <input type="text" class="form-control mr-2" @input=${event => this.editQuestion(event, q)} placeholder="Please specify the question"> -->
            <button type="button" class="btn btn-danger" @click=${() => this.removeQuestion(q)}>Remove question</button>
          </div>
        </div>      
      `)}
      
    `;
  }

}

customElements.define('x-state-created', StateCreatedElement);
