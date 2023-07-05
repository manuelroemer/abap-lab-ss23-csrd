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
    rm.class('form-engine');
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
    const content = this.getContent();
    content.removeAllItems();

    if (!context) {
      console.warn("The form engine's context property is not set. Unable to render any content.");
      return;
    }

    try {
      // Should not happen with a proper schema, but this is absolutely something that happens when
      // building a form schema.
      // Better show a specific error message here.
      if (!context.currentPage) {
        throw new Error(`No page exists at index ${context.page}.`);
      }

      // Hook: Allow modification of the rendered content prior to rendering.
      context.onBeforeRender?.(context, content);

      // Render the actual elements.
      const elements = context.currentPage.elements ?? [];
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const control = render(element, context, i);
        content.addItem(control);
      }

      // Hook: Allow modification of the rendered content after rendering.
      context.onAfterRender?.(context, content);
    } catch (e: any) {
      const errorText = new Text({
        text: `An error occurred while rendering the form:\n${
          e?.message ?? e
        }\n\nSee the developer console for details.`,
      });

      console.error('An error occurred while rendering the form:', e);
      content.addItem(errorText);
    }
  }
}
