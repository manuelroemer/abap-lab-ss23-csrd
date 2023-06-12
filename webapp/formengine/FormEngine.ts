import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import Text from 'sap/m/Text';
import RenderManager from 'sap/ui/core/RenderManager';
import { render } from './Rendering';
import { FormEngineContext } from './FormEngineContext';

/**
 * The form engine control which renders a dynamic UI based on a JSON document.
 * @namespace csrdreporting.formengine
 */
export default class FormEngine extends Control {
  static readonly metadata = {
    properties: {
      formEngineContext: { type: 'object', defaultValue: null },
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

  setFormEngineContext(context: FormEngineContext) {
    this.setProperty('formEngineContext', context, true);
    this.updateRenderedContent();
  }

  private updateRenderedContent() {
    const context = this.getFormEngineContext() as FormEngineContext;
    this.getContent().removeAllItems();

    if (!context) {
      console.warn("The form engine's context property is not set. Unable to render any content.");
      return;
    }

    try {
      for (const element of context.currentPage?.elements ?? []) {
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
