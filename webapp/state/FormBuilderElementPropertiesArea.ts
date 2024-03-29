import { ChoiceOption, FormSchemaElement } from '../formengine/Schema';
import { formSchemaJsonSchema } from '../formengine/Schema.JsonSchema.gen';
import { updateElement } from '../formengine/SchemaReducers';
import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStateElementPropertiesAreaSlice {
  /**
   * The index of the element which is currently being edited.
   * This index is relative to the `currentPage`.
   */
  elementToEditIndex?: number;
  /**
   * The element which is currently being edited.
   * When changed, this is synced back into the `schema`.
   */
  elementToEdit?: FormSchemaElement;
  /**
   * A list of all properties which exist on the form schema element which is currently being edited.
   * Used to conditionally hide input fields for properties which don't exist on the current element.
   * This is empty if no element is being edited.
   */
  elementToEditProperties: Array<string>;
  /**
   * Sets the element which should be edited.
   * @param index The index of the element which should be edited, relative to the `currentPage`.
   */
  setElementToEdit(index?: number): void;
  /**
   * Adds a new option to the currently edited element.
   */
  addChoiceOption(): void;
  /**
   * Deletes the options at the given indices from the currently edited element.
   * @param indices The indices of the options to be deleted.
   */
  deleteChoiceOption(indices: Array<number>): void;
  /**
   * Adds a new effect to the element.
   */
  addElementEffect(): void;
  /**
   * Deletes the effect at the given index from the currently edited element.
   * @param index The index of the effect to be deleted.
   */
  deleteElementEffect(index: number): void;
  /**
   * Adds a new validation rule to the element.
   */
  addElementValidationRule(): void;
  /**
   * Deletes the validation rule at the given index from the currently edited element.
   * @param index The index of the validation rule to be deleted.
   */
  deleteElementValidationRule(index: number): void;
}

/**
 * A record which maps the type of a form schema element to an array of its properties, e.g.,
 * ```ts
 * {
 *   'text': ['text'],
 *   // ...
 * }
 * ```
 *
 * These properties are generated/computed from the form schema JSON schema.
 * For details about its structure, look into the generated file.
 *
 * Note that the generation for this object is not perfect and may contain additional arrays that
 * come from schema definitions other than form schema elements.
 * In practice, this doesn't cause any problems, hence we can ignore it.
 */
const formSchemaElementProperties: Record<string, Array<string>> = Object.values(formSchemaJsonSchema.definitions)
  .filter((definition: any) => typeof definition?.properties?.type?.const === 'string')
  .reduce(
    (acc, definition: any) => ({ ...acc, [definition.properties.type.const]: Object.keys(definition.properties) }),
    {},
  );

export function createFormBuilderElementPropertiesAreaSlice({
  get,
  set,
  watch,
}: State<FormBuilderState>): FormBuilderStateElementPropertiesAreaSlice {
  // When the user updates `elementToEdit` (via the UI), the change needs to be merged
  // back into the schema.
  watch(
    (s) => [s.elementToEdit],
    ({ page, schema, elementToEdit, elementToEditIndex, setSchema }) => {
      if (elementToEdit && typeof elementToEditIndex === 'number') {
        setSchema(
          updateElement(schema, page, elementToEditIndex, (element) => ({
            ...element,
            ...elementToEdit,
          })),
        );
      }
    },
  );

  // It's possible to update the schema via other sources, e.g., the JSON editor.
  // When the current element is edited, the change needs to be reflected into `elementToEdit`,
  // otherwise it contains stale data.
  watch(
    (s) => s.schema,
    ({ setElementToEdit, elementToEditIndex }) => setElementToEdit(elementToEditIndex),
  );

  // Unset the element to edit when a new page is selected.
  watch(
    (s) => s.page,
    ({ setElementToEdit }) => setElementToEdit(undefined),
  );

  return {
    elementToEdit: undefined,
    elementToEditIndex: undefined,
    elementToEditProperties: [],

    setElementToEdit(index) {
      const { elementToEditIndex, currentPage, selectedTab } = get();
      const elementToEdit = typeof index === 'number' ? currentPage?.elements?.[index] : undefined;
      const elementToEditProperties = formSchemaElementProperties[elementToEdit?.type ?? ''] ?? [];

      set({
        elementToEditIndex: index,
        elementToEdit,
        elementToEditProperties,
        selectedTab: elementToEdit && elementToEditIndex !== index ? 'element' : selectedTab,
      });
    },

    addChoiceOption() {
      const { elementToEdit } = get();

      if (elementToEdit) {
        const options: Array<ChoiceOption> = elementToEdit['options'] ?? [];
        const nextElement = {
          ...elementToEdit,
          options: [...options, { value: '', display: '' }],
        };

        set({ elementToEdit: nextElement });
      }
    },

    deleteChoiceOption(indices: Array<number>) {
      const { elementToEdit } = get();

      if (elementToEdit) {
        const options: Array<ChoiceOption> = elementToEdit['options'] ?? [];
        const nextElement = {
          ...elementToEdit,
          options: options.filter((_, i) => !indices.includes(i)),
        };

        set({ elementToEdit: nextElement });
      }
    },

    addElementEffect() {
      const { elementToEdit } = get();

      if (elementToEdit) {
        const effects = elementToEdit['effects'] ?? [];
        const nextElement = {
          ...elementToEdit,
          effects: [...effects, { effect: 'show', condition: null } as const],
        };

        set({ elementToEdit: nextElement });
      }
    },

    deleteElementEffect(index: number) {
      const { elementToEdit } = get();

      if (elementToEdit) {
        const effects = elementToEdit['effects'] ?? [];
        const nextElement = {
          ...elementToEdit,
          effects: effects.filter((_, i) => i !== index),
        };

        set({ elementToEdit: nextElement });
      }
    },

    addElementValidationRule() {
      const { elementToEdit } = get();

      if (elementToEdit) {
        const validationRules = elementToEdit['validationRules'] ?? [];
        const nextElement = {
          ...elementToEdit,
          validationRules: [...validationRules, { message: '', condition: null } as const],
        };

        set({ elementToEdit: nextElement });
      }
    },

    deleteElementValidationRule(index: number) {
      const { elementToEdit } = get();

      if (elementToEdit) {
        const validationRules = elementToEdit['validationRules'] ?? [];
        const nextElement = {
          ...elementToEdit,
          validationRules: validationRules.filter((_, i) => i !== index),
        };

        set({ elementToEdit: nextElement });
      }
    },
  };
}
