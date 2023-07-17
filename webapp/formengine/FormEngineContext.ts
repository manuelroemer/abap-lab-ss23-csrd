import Control from 'sap/ui/core/Control';
import { State } from '../utils/State';
import { evaluateRules } from './Rules';
import { FormSchema, FormSchemaElement, FormSchemaPage } from './Schema';
import { ValidationError, getValidationErrorsForPage } from './Validation';
import VBox from 'sap/m/VBox';
import { emptySchema } from './SchemaUtils';

/**
 * Represents the internal state of the user-entered data that the form engine captures and renders.
 */
export type FormEngineState = Record<string, unknown>;

/**
 * Represents data that is provided by the form engine control to renderers.
 * This context is required by the form engine control to render its UI.
 *
 * **⚠️ Important:** DO NOT directly modify any of the context's properties via `set` calls.
 * Instead, use the functions provided by the state, e.g., `setSchema` or `setPage`.
 * Manually setting context specific properties *will* lead to inconsistencies within the form engine.
 */
export interface FormEngineContext {
  /**
   * An incrementing version of the form engine context.
   * Whenever the form engine needs to re-render, this version is incremented.
   *
   * This is introduced as a performance optimization.
   * The form engine context is frequently merged into other states in this project.
   * Those other states may update very frequently, causing the form engine to re-render by default.
   * By introducing this version field, the engine can determine whether a state change was caused
   * by the context itself - and can thus more efficiently render.
   *
   * If the project had had more time, this would not be necessary - instead, we'd have a more
   * sophisticated state management solution (probably a 3rd party library and nothing custom)
   * which would support isolated states and/or more fine-grained updates/subscriptions, making
   * this version here unnecessary.
   */
  renderVersion: number;
  /**
   * The form schema that is tracked by the context.
   */
  readonly schema: FormSchema;
  /**
   * The current form engine state tracked by the context.
   */
  readonly state: FormEngineState;
  /**
   * The index of the currently displayed page, relative to `schema.pages`.
   */
  readonly page: number;
  /**
   * The index of the previous page to be displayed.
   */
  readonly previousPageIndex: number;
  /**
   * The index of the next page to be displayed.
   */
  readonly nextPageIndex: number;
  /**
   * The currently displayed page or `undefined` if the schema contains no pages.
   */
  readonly currentPage?: FormSchemaPage;
  /**
   * Whether it's possible to go forward.
   * False if the current page is the last visible page.
   */
  readonly canGoForward: boolean;
  /**
   * Whether it's possible to go backward.
   * False if the current page is the first visible page.
   */
  readonly canGoBackward: boolean;
  /**
   * Whether it's possible to submit the form.
   * True if the last page has been reached.
   */
  readonly canSubmit: boolean;
  /**
   * The validation errors for the current page.
   */
  readonly currentPageValidationErrors: Array<ValidationError>;
  /**
   * Whether validation errors should be displayed by the UI.
   * This is `false` until the user attempts to navigate to the next page.
   */
  readonly showValidationErrors: boolean;
  /**
   * A hook which is called before the form engine starts rendering elements.
   * Can be used to modify the content before rendering starts.
   * @param context The same form engine context.
   * @param content The control which will, after rendering, contain the rendered elements.
   */
  readonly onBeforeRender?: (context: FormEngineContext, content: VBox) => void;
  /**
   * A hook which is called after the form engine rendered elements.
   * Can be used to modify the content after rendering finished-
   * @param context The same form engine context.
   * @param content The control which contains the rendered elements.
   */
  readonly onAfterRender?: (context: FormEngineContext, content: VBox) => void;
  /**
   * A hook which is called by the form engine once a control to be rendered has been generated.
   * Can be used to modify the control before it is rendered.
   * @param element The element to be rendered.
   * @param context The same form engine context.
   * @param control The control that will be rendered.
   * @param elementIndex The index of the element within the current page's schema elements.
   */
  readonly onRenderElement?: (
    element: FormSchemaElement,
    context: FormEngineContext,
    control: Control,
    elementIndex: number,
  ) => Control;
  /**
   * A hook which is called by the form engine when an element is hidden.
   * Can be used to modify how elements are hidden.
   * @param element The element to be rendered.
   * @param context The same form engine context.
   * @param control The control that will be rendered.
   * @param elementIndex The index of the element within the current page's schema elements.
   */
  readonly onHideElement?: (
    element: FormSchemaElement,
    context: FormEngineContext,
    control: Control,
    elementIndex: number,
  ) => Control;

  goForward(): boolean;
  goBackward(): boolean;
  submit(): boolean;
  getValue(id: string): unknown;
  setValue(id: string, value: unknown): void;
  setSchema(schema: FormSchema): void;
  setState(state: FormEngineState): void;
  setPage(page: number): void;
  setOnBeforeRender(value: FormEngineContext['onBeforeRender']): void;
  setOnAfterRender(value: FormEngineContext['onAfterRender']): void;
  setOnRenderElement(value: FormEngineContext['onRenderElement']): void;
  setOnHideElement(value: FormEngineContext['onHideElement']): void;
}

export type FormEngineContextInit = Partial<
  Pick<
    FormEngineContext,
    'schema' | 'state' | 'page' | 'onBeforeRender' | 'onAfterRender' | 'onRenderElement' | 'onHideElement'
  >
>;

export function createFormEngineContext({ get, set }: State<FormEngineContext>, init: FormEngineContextInit = {}) {
  const setContext = (context: Partial<FormEngineContext>) => {
    return set(withComputedProps({ ...get(), ...context }));
  };

  const withComputedProps = (context: FormEngineContext): FormEngineContext => {
    const { schema, state, page, renderVersion } = context;

    // The previous/next page is not, simply, the previous/next page in the schema, but instead the
    // page that is *not* hidden according to its effect rules.
    const pagesHidden = schema.pages.map((page) => evaluateRules(page, schema, state).hide);
    const previousPageIndex = schema.pages.findLastIndex((_, index) => index < page && !pagesHidden[index]);
    const nextPageIndex = schema.pages.findIndex((_, index) => index > page && !pagesHidden[index]);

    const currentPage = schema.pages[page];
    const isLastPage = pagesHidden.slice(page + 1).filter((hidden) => !hidden).length === 0;

    const canGoForward = nextPageIndex >= 0;
    const canGoBackward = previousPageIndex >= 0;
    const canSubmit = isLastPage;

    const currentPageValidationErrors = currentPage ? getValidationErrorsForPage(currentPage, page, schema, state) : [];

    return {
      ...context,
      canGoForward,
      canGoBackward,
      canSubmit,
      previousPageIndex,
      nextPageIndex,
      currentPage,
      currentPageValidationErrors,
      renderVersion: renderVersion + 1,
    };
  };

  return withComputedProps({
    showValidationErrors: false,
    schema: init.schema ?? emptySchema,
    state: init.state ?? {},
    page: init.page ?? 0,
    renderVersion: 0,
    onBeforeRender: init.onBeforeRender,
    onAfterRender: init.onAfterRender,
    onRenderElement: init.onRenderElement,
    onHideElement: init.onHideElement,

    goForward() {
      const { canGoForward, nextPageIndex, currentPageValidationErrors, setPage } = get();

      if (currentPageValidationErrors.length > 0) {
        setContext({ showValidationErrors: true });
        return false;
      }

      if (canGoForward) {
        setPage(nextPageIndex);
        return true;
      }

      return false;
    },

    goBackward() {
      const { canGoBackward, previousPageIndex, setPage } = get();

      if (canGoBackward) {
        setPage(previousPageIndex);
        return true;
      }

      return false;
    },

    submit() {
      const { canSubmit, currentPageValidationErrors } = get();

      if (!canSubmit) {
        return false;
      }

      if (currentPageValidationErrors.length > 0) {
        setContext({ showValidationErrors: true });
        return false;
      }

      return true;
    },

    getValue(id) {
      const { state } = get();
      return state[id];
    },

    setValue(id, value) {
      setContext({ state: { ...get().state, [id]: value } });
    },

    setSchema(schema) {
      setContext({ schema });
    },

    setState(state) {
      setContext({ state });
    },

    setPage(page) {
      const { schema } = get();
      const maxPages = schema.pages.length;
      const clampedPage = Math.max(0, Math.min(page, maxPages - 1));
      setContext({ page: clampedPage, showValidationErrors: false });
    },

    setOnBeforeRender(onBeforeRender) {
      setContext({ onBeforeRender });
    },

    setOnAfterRender(onAfterRender) {
      setContext({ onAfterRender });
    },

    setOnRenderElement(onRenderElement) {
      setContext({ onRenderElement });
    },

    setOnHideElement(onHideElement) {
      setContext({ onHideElement });
    },
  } as FormEngineContext);
}
