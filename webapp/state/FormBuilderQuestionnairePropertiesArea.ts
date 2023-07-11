import { FormSchemaExpressionOrPrimitive } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStateQuestionnairePropertiesAreaSlice {
  /**
   * The name of the questionnaire.
   */
  readonly name: string;
  /**
   * The description of the questionnaire.
   */
  readonly description?: string;
  /**
   * The questionnaire's/schema's ref conditions, represented as array.
   */
  refConditions: Array<{
    key: string;
    condition: FormSchemaExpressionOrPrimitive;
  }>;
  /**
   * Adds a new ref condition.
   */
  addRefCondition(): void;
  /**
   * Deletes the ref condition at the given index.
   * @param index The index of the ref condition to be deleted.
   */
  deleteRefCondition(index: number): void;
}

export function createFormBuilderQuestionnairePropertiesAreaSlice({
  get,
  set,
  watch,
}: State<FormBuilderState>): FormBuilderStateQuestionnairePropertiesAreaSlice {
  watch(
    (s) => s.schema,
    ({ schema }) =>
      set({
        refConditions: Object.entries(schema.refs?.conditions ?? {}).map(([key, condition]) => ({ key, condition })),
      }),
  );

  watch(
    (s) => s.refConditions,
    ({ refConditions, schema, setSchema }) =>
      setSchema({
        ...schema,
        refs: {
          conditions: refConditions.reduce((acc, { key, condition }) => ({ ...acc, [key]: condition }), {}),
        },
      }),
  );

  return {
    name: '',
    description: '',
    refConditions: [],

    addRefCondition() {
      const findKey = () => {
        let i = 1;
        let key;

        do {
          key = `condition-${i++}`;
        } while (refConditions.some((condition) => condition.key === key));

        return key;
      };

      const { refConditions } = get();
      const next = [...refConditions, { key: findKey(), condition: null }];
      set({ refConditions: next });
    },

    deleteRefCondition(index: number) {
      const { refConditions } = get();
      const next = refConditions.filter((_, i) => i !== index);
      set({ refConditions: next });
    },
  };
}
