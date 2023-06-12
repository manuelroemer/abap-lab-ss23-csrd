import { StateSet, createState } from '../utils/State';
import { FormSchema, FormSchemaPage, emptySchema } from './Schema';

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
  readonly currentPage?: FormSchemaPage;
  readonly canGoForward: boolean;
  readonly canGoBackward: boolean;
  setSchema(schema: FormSchema): void;
  setState(state: FormEngineState): void;
  setPage(page: number): void;
  goForward(): boolean;
  goBackward(): boolean;
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

  const withComputedProps = (context: FormEngineContext) => ({
    ...context,
    canGoForward: context.page < context.schema.pages.length - 1,
    canGoBackward: context.page > 0,
    currentPage: context.schema.pages[context.page],
  });

  return createState<FormEngineContext>(({ get, set }) =>
    withComputedProps({
      schema,
      state,
      page,

      setSchema(schema: FormSchema) {
        update(set, { schema });
      },

      setState(state: FormEngineState) {
        update(set, { state });
      },

      setPage(page: number) {
        const { schema } = get();
        const maxPages = schema.pages.length;
        const clampedPage = Math.max(0, Math.min(page, maxPages - 1));
        update(set, { page: clampedPage });
      },

      goForward() {
        const { canGoForward, page, setPage } = get();

        if (canGoForward) {
          setPage(page + 1);
          return true;
        }

        return false;
      },

      goBackward() {
        const { canGoBackward, page, setPage } = get();

        if (canGoBackward) {
          setPage(page - 1);
          return true;
        }

        return false;
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
