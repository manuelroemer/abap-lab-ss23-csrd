import Control from 'sap/ui/core/Control';
import { State, createState } from '../utils/State';
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
 */
export interface FormEngineContext {
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
  setSchema(schema: FormSchema): void;
  setState(state: FormEngineState): void;
  setPage(page: number): void;
  goForward(): boolean;
  goBackward(): boolean;
  submit(): boolean;
  getValue(id: string): unknown;
  setValue(id: string, value: unknown): void;
  /**
   * A hook which is called before the form engine starts rendering elements.
   * Can be used to modify the content before rendering starts.
   * @param context The same form engine context.
   * @param content The control which will, after rendering, contain the rendered elements.
   */
  onBeforeRender?(context: FormEngineContext, content: VBox): void;
  /**
   * A hook which is called after the form engine rendered elements.
   * Can be used to modify the content after rendering finished-
   * @param context The same form engine context.
   * @param content The control which contains the rendered elements.
   */
  onAfterRender?(context: FormEngineContext, content: VBox): void;
  /**
   * A hook which is called by the form engine once a control to be rendered has been generated.
   * Can be used to modify the control before it is rendered.
   * @param element The element to be rendered.
   * @param context The same form engine context.
   * @param control The control that will be rendered.
   * @param elementIndex The index of the element within the current page's schema elements.
   */
  onRenderElement?(
    element: FormSchemaElement,
    context: FormEngineContext,
    control: Control,
    elementIndex: number,
  ): Control;
}

export type FormEngineContextInit = Partial<
  Pick<FormEngineContext, 'schema' | 'state' | 'page' | 'onBeforeRender' | 'onAfterRender' | 'onRenderElement'>
>;

export function createFormEngineContext({ get, set }: State<FormEngineContext>, init: FormEngineContextInit = {}) {
  // Update is used instead of `set` here to update the state.
  // The difference to `set` is that `update` auto-computes certain properties.
  const update = (context: Partial<FormEngineContext>) => {
    return set(withComputedProps({ ...get(), ...context }));
  };

  const withComputedProps = (context: FormEngineContext): FormEngineContext => {
    const { schema, state, page } = context;

    // The previous/next page is not, simply, the previous/next page in the schema, but instead the
    // page that is *not* hidden according to its effect rules.
    const pagesHidden = schema.pages.map((page) => evaluateRules(page, state).hide);
    const previousPageIndex = schema.pages.findLastIndex((_, index) => index < page && !pagesHidden[index]);
    const nextPageIndex = schema.pages.findIndex((_, index) => index > page && !pagesHidden[index]);

    const currentPage = schema.pages[page];
    const isLastPage = pagesHidden.slice(page + 1).filter((hidden) => !hidden).length === 0;

    const canGoForward = nextPageIndex >= 0;
    const canGoBackward = previousPageIndex >= 0;
    const canSubmit = isLastPage;

    const currentPageValidationErrors = currentPage ? getValidationErrorsForPage(currentPage, page, state) : [];

    return {
      ...context,
      canGoForward,
      canGoBackward,
      canSubmit,
      previousPageIndex,
      nextPageIndex,
      currentPage,
      currentPageValidationErrors,
    };
  };

  return withComputedProps({
    showValidationErrors: false,
    schema: init.schema ?? emptySchema,
    state: init.state ?? {},
    page: init.page ?? 0,

    setSchema(schema) {
      update({ schema });
    },

    setState(state) {
      update({ state });
    },

    setPage(page) {
      const { schema } = get();
      const maxPages = schema.pages.length;
      const clampedPage = Math.max(0, Math.min(page, maxPages - 1));
      update({ page: clampedPage, showValidationErrors: false });
    },

    goForward() {
      const { canGoForward, nextPageIndex, currentPageValidationErrors, setPage } = get();

      if (currentPageValidationErrors.length > 0) {
        set({ showValidationErrors: true });
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
        set({ showValidationErrors: true });
        return false;
      }

      return true;
    },

    getValue(id) {
      const { state } = get();
      return state[id];
    },

    setValue(id, value) {
      update({ state: { ...get().state, [id]: value } });
    },
  } as FormEngineContext);
}

export function createFormEngineContextState(init?: FormEngineContextInit) {
  return createState<FormEngineContext>((state) => createFormEngineContext(state, init));
}
