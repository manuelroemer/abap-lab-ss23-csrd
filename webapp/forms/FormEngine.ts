import Input from 'sap/m/Input';
import Event from 'sap/ui/base/Event';
import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import RenderManager from 'sap/ui/core/RenderManager';

/**
 * @namespace csrdreporting.forms
 */
export default class FormEngine extends Control {
  static readonly metadata = {
    properties: {
      schema: { type: 'object', defaultValue: {} },
      state: { type: 'object', defaultValue: {} },
    },
    aggregations: {
      _content: { type: 'sap.ui.core.Control', multiple: false, visibility: 'hidden' },
    },
  };

  static renderer = (rm: RenderManager, control: FormEngine) => {
    const content = control.getContent();
    rm.renderControl(content);
  };

  private getContent() {
    return this.getAggregation('_content') as VBox;
  }

  init() {
    this.setAggregation('_content', new VBox());
  }

  setSchema(schema: object) {
    this.setProperty('schema', schema, true);
    this.updateRenderedContent();
  }

  setState(state: object) {
    this.setProperty('state', state, true);
    this.updateRenderedContent();
  }

  private updateRenderedContent() {
    const schema = this.getSchema();
    const state = this.getState();
    console.log('update: ', schema, state);

    this.getContent().removeAllItems();

    const messageInput = new Input({
      value: (state as any).message,
      change: (e: Event) => {
        this.setState({ ...state, message: e.getParameter('value') });
      },
    });

    this.getContent().addItem(messageInput);
  }
}
