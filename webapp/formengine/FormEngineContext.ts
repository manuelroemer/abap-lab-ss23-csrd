import { StateSet, createState } from '../utils/State';
import { evaluateRules } from './Rules';
import { FormSchema, FormSchemaPage, emptySchema } from './Schema';
import { ValidationError, getValidationErrorsForPage } from './Validation';

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
}

export function createFormEngineContext(schema: FormSchema = emptySchema, state: FormEngineState = {}, page = 0) {
  // Update performs a two-staged update of the context state.
  // Stage 1 updates the state with the values provided by the caller.
  // Stage 2 sets all computed properties derived from the base state.
  // Only stage 2 notifies subscribers.
  const update = (set: StateSet<FormEngineContext>, context: Partial<FormEngineContext>) => {
    const next = set(context, false, false);
    return set(withComputedProps(next));
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

    const currentPageValidationErrors = currentPage ? getValidationErrorsForPage(currentPage, state) : [];

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

  return createState<FormEngineContext>(({ get, set }) =>
    withComputedProps({
      schema,
      state,
      page,
      showValidationErrors: false,

      setSchema(schema) {
        update(set, { schema });
      },

      setState(state) {
        update(set, { state });
      },

      setPage(page) {
        const { schema } = get();
        const maxPages = schema.pages.length;
        const clampedPage = Math.max(0, Math.min(page, maxPages - 1));
        update(set, { page: clampedPage, showValidationErrors: false });
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
        update(set, { state: { ...get().state, [id]: value } });
      },
    } as FormEngineContext),
  );
}
