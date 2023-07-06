import { FormSchemaElementType } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateAddElementDialogSlice {
  /**
   * Stores the index at which a new element should be added.
   * Not supposed to be edited, except by this file.
   */
  addElementDialogElementIndex?: number;
  /**
   * Whether the Add Element dialog is supposed to be open.
   */
  isAddElementDialogOpen: boolean;
  /**
   * A list of all items to be displayed in the Add Element dialog, for the purpose of list binding.
   */
  addElementDialogItems: Array<AddElementDialogItem>;
  /**
   * The current filter string of the Add Element dialog.
   */
  addElementDialogItemsFilter?: string;

  /**
   * Shows the Add Element dialog.
   * @param index The index within the current page at which the new element should be added.
   */
  showAddElementDialog(index: number): void;
  /**
   * Closes the Add Element dialog and, if `result` is given, inserts a new element in the schema.
   * @param result The result of the Add Element dialog, i.e., the selected {@link AddElementDialogItem}.
   */
  closeAddElementDialog(result?: AddElementDialogItem): void;
}

/**
 * Represents an item that appears in the list of the Add Element dialog.
 * There is supposed to be one item per form schema element that's supported by the form engine.
 */
export interface AddElementDialogItem {
  type: FormSchemaElementType;
  title: string;
  icon: string;
  description: string;
}

// Declare all items as Record, so that we get TS errors if we're missing new items.
const allDialogItemsRecord: Record<FormSchemaElementType, AddElementDialogItem> = {
  heading: {
    type: 'heading',
    title: 'Heading',
    description: 'Displays a heading ("title").',
    icon: 'sap-icon://heading1',
  },
  text: {
    type: 'text',
    title: 'Text',
    description: 'Display normal or HTML-formatted text.',
    icon: 'sap-icon://text',
  },
  'text-input': {
    type: 'text-input',
    title: 'Text Input',
    description: 'Allows users to enter textual content.',
    icon: 'sap-icon://document-text',
  },
  'number-input': {
    type: 'number-input',
    title: 'Number Input',
    description: 'Allows users to enter numerical content.',
    icon: 'sap-icon://number-sign',
  },
  'boolean-choice': {
    type: 'boolean-choice',
    title: 'Yes / No',
    description: 'Presents a simple "Yes" or "No" choice.',
    icon: 'sap-icon://question-mark',
  },
  checkbox: {
    type: 'checkbox',
    title: 'Checkbox',
    description: 'A single checkbox which can be toggled on and off.',
    icon: 'sap-icon://complete',
  },
  'multi-choice': {
    type: 'multi-choice',
    title: 'Multiple Choice',
    description: 'Allows choosing multiple options via multiple checkboxes.',
    icon: 'sap-icon://multi-select',
  },
  'single-choice': {
    type: 'single-choice',
    title: 'Single Choice',
    description: 'Allows choosing a single option via radio buttons.',
    icon: 'sap-icon://multiselect-none',
  },
  'single-choice-select': {
    type: 'single-choice-select',
    title: 'Single Choice Select',
    description: 'Allows choosing a single option via a dropdown.',
    icon: 'sap-icon://drop-down-list',
  },
  'date-time': {
    type: 'date-time',
    title: 'Time Picker',
    description: 'Allows users to select a date and time.',
    icon: 'sap-icon://appointment-2',
  },
};

// ...But convert them to an array for binding and filtering.
const allDialogItems: Array<AddElementDialogItem> = Object.values(allDialogItemsRecord);

export function createFormBuilderAddElementDialogSlice({
  get,
  set,
  watch,
}: State<FormBuilderState>): FormBuilderStateAddElementDialogSlice {
  // Update the items to be displayed whenever the filter changes.
  watch(
    (s) => s.addElementDialogItemsFilter,
    ({ addElementDialogItemsFilter = '' }) =>
      set({
        addElementDialogItems: allDialogItems.filter((item) =>
          item.title.toLowerCase().includes(addElementDialogItemsFilter.toLowerCase()),
        ),
      }),
  );

  return {
    isAddElementDialogOpen: false,
    addElementDialogItems: allDialogItems,
    addElementDialogItemsFilter: undefined,

    showAddElementDialog(index) {
      set({ isAddElementDialogOpen: true, addElementDialogElementIndex: index });
    },

    closeAddElementDialog(result?: AddElementDialogItem) {
      if (result) {
        const { addElementDialogElementIndex = 0, addElement } = get();
        addElement(addElementDialogElementIndex, result.type);
      }

      set({
        isAddElementDialogOpen: false,
        addElementDialogElementIndex: undefined,
        addElementDialogItemsFilter: undefined,
      });
    },
  };
}
