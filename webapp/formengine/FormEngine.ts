import VBox from 'sap/m/VBox';
import Control from 'sap/ui/core/Control';
import RenderManager from 'sap/ui/core/RenderManager';
import { render, renderError } from './Rendering';
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
    rm.openStart('section', control);
    rm.class('form-engine');
    rm.openEnd();
    rm.renderControl(control.getContent());
    rm.close('section');
  };

  private lastRenderedContent?: Control;
  private lastRenderedVersion = -1;

  public override init() {
    this.setAggregation('_content', new VBox());
  }

  public override onBeforeRendering(): void {
    const content = this.getContent();
    content.removeAllItems();
    content.addItem(this.getContentToRender());
  }

  private getContent() {
    return this.getAggregation('_content') as VBox;
  }

  public setFormEngineContext(context: FormEngineContext) {
    this.setProperty('formEngineContext', context);
  }

  private getContentToRender() {
    const context = this.getFormEngineContext() as FormEngineContext;
    const container = new VBox();

    if (context.renderVersion === this.lastRenderedVersion && this.lastRenderedContent) {
      return this.lastRenderedContent;
    }

    try {
      // Should not happen with a proper schema, but this is absolutely something that happens when
      // building a form schema.
      // Better show a specific error message here.
      if (!context.currentPage) {
        throw new Error(`No page exists at index ${context.page}.`);
      }

      // Hook: Allow modification of the rendered content prior to rendering.
      context.onBeforeRender?.(context, container);

      // Render the actual elements.
      const elements = context.currentPage.elements ?? [];
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const control = render({ element, context, elementIndex: i });
        container.addItem(control);
      }

      // Hook: Allow modification of the rendered content after rendering.
      context.onAfterRender?.(context, container);
    } catch (e: any) {
      console.error('An error occurred while rendering the form:', e);
      container.addItem(
        renderError(
          `An error occurred while rendering the form:\n${e?.message ?? e}\n\nSee the developer console for details.`,
        ),
      );
    }

    this.lastRenderedContent = container;
    this.lastRenderedVersion = context.renderVersion;
    return container;
  }
}
