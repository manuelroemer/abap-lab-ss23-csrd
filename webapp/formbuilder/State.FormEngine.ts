import { FormEngineContext, createFormEngineContext } from '../formengine/FormEngineContext';
import { emptySchema } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateFormEngineSlice extends FormEngineContext {
  /**
   * JSON representation of the current `schema`.
   * Mutable. When updated to a valid JSON string, `schema` will be updated accordingly.
   */
  readonly schemaJson: string;
  /**
   * JSON representation of the current `state`.
   * Mutable. When updated to a valid JSON string, `state` will be updated accordingly.
   */
  readonly stateJson: string;
}

export function createFormBuilderFormEngineSlice({
  state,
  get,
  set,
  watch,
}: State<FormBuilderState>): FormBuilderStateFormEngineSlice {
  // Simply sync the schema/schemaJson and state/stateJson by watching all possible changes.
  watch(
    (s) => s.schemaJson,
    ({ schemaJson }) => {
      const schema = tryParseJson(schemaJson);
      schema && get().setSchema(schema);
    },
  );

  watch(
    (s) => s.stateJson,
    ({ stateJson }) => {
      const state = tryParseJson(stateJson);
      state && get().setState(state);
    },
  );

  watch(
    (s) => s.state,
    ({ state }) => {
      set({ stateJson: stringifyJson(state) });
    },
  );

  return {
    ...createFormEngineContext(state, {
      schema: emptySchema,
      onRenderElement(element, context, control) {
        // TODO: Inject elements for adding new elements.
        return control;
      },
    }),

    schemaJson: stringifyJson(emptySchema),
    stateJson: '{}',
  };
}

function stringifyJson(value: any) {
  return JSON.stringify(value, null, 4);
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
