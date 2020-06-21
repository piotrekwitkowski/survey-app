// import { LitElement, html, css, customElement, property } from 'lit-element';
import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';

import './StateCreated.js'

export const init = surveyInstance => {
  const appNode = document.querySelector("x-app");
  appNode.surveyInstance = surveyInstance;
}

class AppElement extends LitElement {
  createRenderRoot() { return this; }

  static get properties() {
    return {
      surveyInstance: { type: Object },
      surveyState: { type: Object }
    }
  }

  updated(changedProperties) {
    const instanceChanged = changedProperties.has('surveyInstance');
    if (instanceChanged) {
      console.log('surveyInstance', this.surveyInstance);
        this.surveyInstance.state().then(state => {
          console.log('state', state);
          this.surveyState = state.c;
        })

    }
    // console.log('changedProperties:', changedProperties.has('surveyInstance'));
    // super.connectedCallback();

    // if (this.surveyInstance) {
    // }
  }

  render() {
    console.log('render');

      return html`
      <div class="container">
        <div class="row">
          <p>surveyInstance is ${this.surveyInstance ? 'present' : 'not present'}</p>
          <p>surveyState is ${this.surveyState ? this.surveyState : 'not present'}</p>
          ${this.surveyState == 0 ? html`<p>State is 0</p>` : ''}
          ${this.surveyState == 0 ? html`<x-state-created/>` : ''}
          ${this.surveyState == 1 ? html`<p>State is 1</p>` : ''}
          ${this.surveyState == 1 ? html`<x-state-open/>` : ''}
          ${this.surveyState == 2 ? html`<p>State is 2</p>` : ''}
          ${this.surveyState == 2 ? html`<x-state-ended/>` : ''}
        </div>
      </div>
    `;
  }
}
customElements.define('x-app', AppElement);




{/* <div class="container-fluid">

<div id="questionsRow">
  <!-- PETS LOAD HERE -->
</div>
<button class="btn btn-default btn-submit" type="button">Submit</button>
</div>

<div id="questionTemplate" style="display: none;">
<div class="row">
  <div class="col-md-6">
    <div class="form-group">
      <label>Question</label>
      <input type="text" class="form-control" placeholder="Please fill in your answer">
    </div>
  </div>
</div>
</div> */}

