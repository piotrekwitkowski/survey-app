import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';
class StateCreatedElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      questions: { type: Array },
    }
  }

  constructor() {
    super();
    this.questions = [''];
  }

  addQuestion() {
    this.questions.push("");
    this.requestUpdate();
  }

  removeQuestion(q) {
    const index = this.questions.indexOf(q);
    if (index > -1) {
      this.questions.splice(index, 1);
      this.requestUpdate();
    }
  }

  initSurvey() {
    console.log('initSurvey');
    
  }

  render() {
    return html`
      <h2>Time to create the survey!</h2>

      <div class="mb-2">

        <form class="form-inline mb-2">
          <div class="form-group">
          <label for="inputState" class="mr-2">How many participants?</label>
            <select id="inputState" class="form-control mr-2">
              <option selected>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <button type="button" class="btn btn-secondary mr-2" @click=${() => this.initSurvey()}>Init the survey</button>
          <button type="button" class="btn btn-success" @click=${() => this.addQuestion()}>Add more questions</button>
        </form>
      </div>

      <div class="form-group my-2">
      </div>

      ${this.questions.map(q => html`
        <form class="">
          <div class="form-group">              
            <label class="mr-2">Question:</label>
            <input type="text" class="form-control" placeholder="Please specify the question">
            <button type="button" class="btn btn-danger" @click=${() => this.removeQuestion(q)}>Remove question</button>
          </div>      
        </form>
      `)}
          

    `;
  }

}

customElements.define('x-state-created', StateCreatedElement);
