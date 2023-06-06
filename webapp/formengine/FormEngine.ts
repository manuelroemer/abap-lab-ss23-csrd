import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import RenderManager from 'sap/ui/core/RenderManager';
import { FormEngineRenderingContext, FormEngineState, render } from './render';
import { FormSchema } from './schema';

/**
 * @namespace csrdreporting.formengine
 */
export default class FormEngine extends Control {
  static readonly metadata = {
    properties: {
      schema: { type: 'object', defaultValue: { pages: [] } },
      state: { type: 'object', defaultValue: {} },
    },
    aggregations: {
      _content: { type: 'sap.ui.core.Control', multiple: false, visibility: 'hidden' },
    },
  };

  static renderer = (rm: RenderManager, control: FormEngine) => {
    const content = control.getContent();
    rm.openStart('section', control);
    rm.openEnd();
    rm.renderControl(content);
    rm.close('section');
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
    const schema = this.getSchema() as FormSchema;
    const state = this.getState() as FormEngineState;
    this.getContent().removeAllItems();

    // TODO: Get current page.
    const currentPage = schema.pages[0];
    const context: FormEngineRenderingContext = {
      schema,
      state,
      getState: (id: string) => state[id],
      setState: (id: string, value: unknown) => this.setState({ ...state, [id]: value }),
    };

    for (const element of currentPage.elements) {
      const control = render(element, context);
      this.getContent().addItem(control);
    }
  }
}
