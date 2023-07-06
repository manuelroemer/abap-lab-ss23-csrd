import { FormSchemaElement } from '../formengine/Schema';
import { formSchemaJsonSchema } from '../formengine/Schema.JsonSchema.gen';
import { updateElement } from '../formengine/SchemaReducers';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateElementPropertiesAreaSlice {
  elementToEditIndex?: number;
  elementToEdit?: FormSchemaElement;
  elementToEditProperties: Array<string>;
  setElementToEdit(index?: number): void;
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
  watch(
    (s) => s.elementToEdit,
    ({ elementToEdit, elementToEditIndex }) => {
      if (elementToEdit && typeof elementToEditIndex === 'number') {
        const { page, schema, setSchema } = get();

        setSchema(
          updateElement(schema, page, elementToEditIndex, (element) => ({
            ...element,
            ...elementToEdit,
          })),
        );
      }
    },
  );

  return {
    elementToEdit: undefined,
    elementToEditIndex: undefined,
    elementToEditProperties: [],

    setElementToEdit(index) {
      const { currentPage } = get();
      const elementToEdit = typeof index === 'number' ? currentPage?.elements?.[index] : undefined;
      const elementToEditProperties = formSchemaElementProperties[elementToEdit?.type ?? ''] ?? [];

      set({
        elementToEdit: typeof index === 'number' ? currentPage?.elements?.[index] : undefined,
        elementToEditIndex: index,
        elementToEditProperties,
      });
    },
  };
}
