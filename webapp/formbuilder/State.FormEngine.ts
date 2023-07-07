import Button from 'sap/m/Button';
import FlexBox from 'sap/m/FlexBox';
import VBox from 'sap/m/VBox';
import { FormEngineContext, createFormEngineContext } from '../formengine/FormEngineContext';
import { emptySchema } from '../formengine/Schema';
import { State } from '../utils/State';
import type { FormBuilderState } from './State';

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

  const createAddNewElementButton = (elementIndex = 0) => {
    return new FlexBox({
      justifyContent: 'Center',
      alignItems: 'Center',
      items: [
        new Button({
          text: 'Add New Element',
          type: 'Transparent',
          icon: 'sap-icon://add',
          press: () => get().showAddElementDialog(elementIndex),
        }).addStyleClass('sapUiSmallMargin'),
      ],
    });
  };

  return {
    schemaJson: stringifyJson(emptySchema),
    stateJson: '{}',

    ...createFormEngineContext(state, {
      schema: emptySchema,

      // Hooks into the form engine to display an "Add New Element" button before each element and
      // on empty pages.
      onBeforeRender: (_, content) => {
        return content.addItem(createAddNewElementButton());
      },

      // Hooks into the form engine to display an "Add New Element" button after each rendered element
      // and enriches each rendered elements with controls for modifying it.
      onRenderElement: (_, __, control, elementIndex) => {
        return new VBox({
          items: [
            new FlexBox({
              justifyContent: 'End',
              items: [
                new Button({
                  icon: 'sap-icon://slim-arrow-up',
                  press: () => get().moveElementUp(elementIndex),
                }).addStyleClass('sapUiTinyMarginEnd'),
                new Button({
                  icon: 'sap-icon://slim-arrow-down',
                  press: () => get().moveElementDown(elementIndex),
                }).addStyleClass('sapUiTinyMarginEnd'),
                new Button({
                  icon: 'sap-icon://edit',
                  press: () => get().setElementToEdit(elementIndex),
                }).addStyleClass('sapUiTinyMarginEnd'),
                new Button({
                  icon: 'sap-icon://delete',
                  press: () => get().deleteElement(elementIndex),
                }),
              ],
            }).addStyleClass('sapUiTinyMarginBottom'),

            control,
            createAddNewElementButton(elementIndex + 1),
          ],
        });
      },
    }),
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
