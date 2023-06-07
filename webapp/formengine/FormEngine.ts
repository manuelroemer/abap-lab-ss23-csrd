import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import Text from 'sap/m/Text';
import RenderManager from 'sap/ui/core/RenderManager';
import { render } from './Rendering';
import { FormSchema } from './Schema';

/**
 * Represents the internal state of the user-entered data that the form engine captures and renders.
 */
export type FormEngineState = Record<string, unknown>;

/**
 * Represents data that is provided by the form engine control to renderers.
 */
export interface FormEngineContext {
  readonly schema: FormSchema;
  readonly state: FormEngineState;
  readonly page: number;
  getValue(id: string): unknown;
  setValue(id: string, value: unknown): void;
}

/**
 * The form engine control which renders a dynamic UI based on a JSON document.
 * @namespace csrdreporting.formengine
 */
export default class FormEngine extends Control {
  static readonly metadata = {
    properties: {
      schema: { type: 'object', defaultValue: { pages: [] } },
      state: { type: 'object', defaultValue: {} },
      page: { type: 'number', defaultValue: 0 },
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

  setPage(page: number) {
    this.setProperty('page', page, true);
    this.updateRenderedContent();
  }

  private updateRenderedContent() {
    const schema = this.getSchema() as FormSchema;
    const state = this.getState() as FormEngineState;
    const page = this.getPage() as number;
    this.getContent().removeAllItems();

    try {
      const currentPage = schema.pages[page];
      const context: FormEngineContext = {
        schema,
        state,
        page,
        getValue: (id: string) => state[id],
        setValue: (id: string, value: unknown) => this.setState({ ...state, [id]: value }),
      };

      for (const element of currentPage.elements) {
        const control = render(element, context);
        this.getContent().addItem(control);
      }
    } catch (e: any) {
      const errorText = new Text({
        text: `An error occurred while rendering the form:\n${
          e?.message ?? e
        }.\n\nSee the developer console for details.`,
      });
      this.getContent().addItem(errorText);
      console.error('An error occurred while rendering the form:', e);
    }
  }
}
