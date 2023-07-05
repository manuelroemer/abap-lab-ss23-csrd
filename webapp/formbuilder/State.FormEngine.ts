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
      const schema = parseObjectOr(schemaJson, emptySchema);
      get().setSchema(schema);
    },
  );

  watch(
    (s) => s.stateJson,
    ({ stateJson }) => {
      const state = parseObjectOr(stateJson, {});
      get().setState(state);
    },
  );

  watch(
    (s) => s.schema,
    ({ schema }) => {
      set({ schemaJson: stringifyJson(schema) });
    },
  );

  watch(
    (s) => s.state,
    ({ state }) => {
      set({ stateJson: stringifyJson(state) });
    },
  );

  return {
    ...createFormEngineContext(state, { schema: emptySchema }),
    schemaJson: stringifyJson(emptySchema),
    stateJson: '{}',
  };
}

function stringifyJson(value: any) {
  return JSON.stringify(value, null, 4);
}

function parseObjectOr(json: string, fallback) {
  try {
    const result = JSON.parse(json);
    return result && typeof result === 'object' ? result : fallback;
  } catch (e) {
    return fallback;
  }
}
