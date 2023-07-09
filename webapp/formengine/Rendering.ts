import Control from 'sap/ui/core/Control';
import Title from 'sap/m/Title';
import FormattedText from 'sap/m/FormattedText';
import Input from 'sap/m/Input';
import VBox from 'sap/m/VBox';
import Label from 'sap/m/Label';
import TextArea from 'sap/m/TextArea';
import Event from 'sap/ui/base/Event';
import {
  FormSchemaElement,
  FormSchemaElementType,
  HeadingFormSchemaElement,
  TextFormSchemaElement,
  TextInputFormSchemaElement,
  DynamicFormSchemaElement,
  BooleanChoiceFormSchemaElement,
  MultiChoiceFormSchemaElement,
  CheckboxFormSchemaElement,
  SingleChoiceFormSchemaElement,
  NumberStepInputFormSchemaElement,
  SingleChoiceSelectFormSchemaElement,
  DateTimeFormSchemaElement,
  FormSchemaElementBase,
} from './Schema';
import { FormEngineContext } from './FormEngineContext';
import RadioButtonGroup from 'sap/m/RadioButtonGroup';
import RadioButton from 'sap/m/RadioButton';
import CheckBox from 'sap/m/CheckBox';
import StepInput from 'sap/m/StepInput';
import ListItem from 'sap/ui/core/ListItem';
import Select from 'sap/m/Select';
import DateTimePicker from 'sap/m/DateTimePicker';
import { uniq } from '../utils/Array';
import { ValueState } from 'sap/ui/core/library';
import { FlexAlignItems } from 'sap/m/library';
import { evaluateRules } from './Rules';
import MessageStrip from 'sap/m/MessageStrip';
import { generateId } from './SchemaUtils';

/**
 * Arguments required by form engine element rendering functions.
 */
export interface RenderContext<T extends FormSchemaElementBase<string> = FormSchemaElementBase<string>> {
  element: T;
  elementIndex: number;
  context: FormEngineContext;
}

/**
 * Represents a function which renders a specific form schema element type.
 */
type RenderFormSchemaElement<T extends FormSchemaElement = FormSchemaElement> = (
  renderContext: RenderContext<T>,
) => Control;

/**
 * Maps the form schema element types to their respective rendering functions.
 */
type RenderLookup = {
  [T in FormSchemaElementType]: RenderFormSchemaElement<Extract<FormSchemaElement, { type: T }>>;
};

const elementRenderers: RenderLookup = {
  heading: renderHeading,
  text: renderText,
  'text-input': renderTextInput,
  checkbox: renderCheckbox,
  'single-choice': renderSingleChoice,
  'single-choice-select': renderSingleChoiceSelect,
  'multi-choice': renderMultiChoice,
  'boolean-choice': renderBooleanChoice,
  'number-input': renderNumberInput,
  'date-time': renderDateTime,
};

/**
 * Renders a single form schema element, i.e., converts the schema element into a UI5 control.
 * @param renderContext The rendering context.
 * @returns The control instance that should be displayed by the form engine.
 */
export function render<T extends FormSchemaElement>(renderContext: RenderContext<T>): Control {
  const { element, context, elementIndex } = renderContext;

  // Rendering is done by a type-specific rendering function.
  // The form engine further provides support for hooks which allow modifying the rendered control from
  // the outside.
  // Note that rendering can easily fail/error for a variety of reasons, e.g. when the schema is invalid.
  // For such cases, we do a `safeRender` which catches errors and displays an error message per failed
  // element instead of tearing down the entire page rendering process.
  const renderer = elementRenderers[element.type] as RenderFormSchemaElement<T>;
  const rawControl = safeRender<T>(renderer, renderContext);
  const control = context.onRenderElement?.(element, context, rawControl, elementIndex) ?? rawControl;

  // This is the highest-level rendering function which handles attributes that may be present
  // on *any* form schema element. Doing this here means that more specific rendering functions
  // don't have to take care of it.
  const { hide } = evaluateRules(element, context.state);
  if (hide) {
    if (context.onHideElement) {
      context.onHideElement(element, context, control, elementIndex);
    } else {
      control.setVisible(false);
    }
  }

  const { marginTop = 'None', marginBottom = 'Small' } = element;
  if (marginTop && marginTop !== 'None') {
    control.addStyleClass(`sapUi${marginTop}MarginTop`);
  }

  if (marginBottom && marginBottom !== 'None') {
    control.addStyleClass(`sapUi${marginBottom}MarginBottom`);
  }

  return control;
}

/**
 * Invokes a renderer and handles any error thrown by it by rendering a fallback error message control.
 */
function safeRender<T extends FormSchemaElement>(
  renderer: RenderFormSchemaElement<T>,
  renderContext: RenderContext<T>,
) {
  try {
    return renderer(renderContext);
  } catch (e: any) {
    return renderError(
      `An error occured while rendering the element of type "${renderContext.element.type}": ${e.message}`,
    );
  }
}

/**
 * Renders a generic error element.
 * @param message The error message to be rendered.
 */
export function renderError(message: string) {
  return new MessageStrip({
    text: message,
    type: 'Error',
    showIcon: true,
  });
}

function renderHeading({ element }: RenderContext<HeadingFormSchemaElement>) {
  const { text = '', level = 2, wrap = true } = element;
  return new Title({ text, level: `H${level}`, titleStyle: `H${level}`, wrapping: wrap });
}

function renderText({ element }: RenderContext<TextFormSchemaElement>) {
  const { text = '' } = element;
  return new FormattedText({ htmlText: text });
}

function renderTextInput(renderContext: RenderContext<TextInputFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, getValue, setValue } = context;
  const { id = generateId(page, elementIndex), placeholder = '', rows = 1 } = element;
  const value = getValue(id)?.toString() ?? '';
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));

  const input =
    rows > 1
      ? new Input({ width: '100%', placeholder, value, change: onChange })
      : new TextArea({ width: '100%', placeholder, rows, value, change: onChange });

  return renderDynamicElementWrapper(input, renderContext);
}

function renderCheckbox(renderContext: RenderContext<CheckboxFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, state, setState } = context;
  const { id = generateId(page, elementIndex), text } = element;

  const checkBox = new CheckBox({
    text,
    selected: !!state[id],
    select: (e: Event) =>
      setState({
        ...state,
        [id]: e.getParameter('selected'),
      }),
  });

  return renderDynamicElementWrapper(checkBox, renderContext);
}

function renderSingleChoice(renderContext: RenderContext<SingleChoiceFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, getValue, setValue } = context;
  const { id = generateId(page, elementIndex), options = [], columns = 1 } = element;
  const value = getValue(id) ?? '';

  const onSelect = (e: Event) => {
    const selectedIndex = e.getParameter('selectedIndex');
    const selectedOption = options[selectedIndex];
    setValue(id, selectedOption.value);
  };

  const input = new RadioButtonGroup({
    columns: columns,
    select: onSelect,
    selectedIndex: options.findIndex((o) => o.value === value),
    buttons: options.map((option) => new RadioButton({ text: option.display ?? option.value })),
  });

  return renderDynamicElementWrapper(input, renderContext);
}

function renderSingleChoiceSelect(renderContext: RenderContext<SingleChoiceSelectFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, getValue, setValue } = context;
  const { id = generateId(page, elementIndex), options = [] } = element;
  const value = getValue(id) ?? '';

  const onSelect = (e: Event) => {
    const selectedItemKey = e.getParameter('selectedItem').getKey();
    const selectedOption = options.find((option) => option.value === selectedItemKey);
    setValue(id, selectedOption?.value);
  };

  const items = [
    new ListItem({ key: '', text: '' }),
    ...options.map((option) => new ListItem({ key: option.value, text: option.display ?? option.value })),
  ];

  const input = new Select({
    width: '100%',
    selectedKey: value,
    change: onSelect,
    items,
  });

  return renderDynamicElementWrapper(input, renderContext);
}

function renderMultiChoice(renderContext: RenderContext<MultiChoiceFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, state, setState, getValue } = context;
  const { id = generateId(page, elementIndex), options = [] } = element;
  const value = (getValue(id) as Array<string>) ?? [];

  const items = options.map((option) => {
    const onSelect = (e: Event) => {
      const isSelected = e.getParameter('selected') as boolean;
      setState({
        ...state,
        [id]: isSelected ? uniq([...value, option.value]) : value.filter((v) => v !== option.value),
        [`${id}.${option.value}`]: isSelected,
      });
    };

    return new CheckBox({
      text: option.display ?? option.value,
      selected: value.includes(option.value ?? ''),
      select: onSelect,
    });
  });
  const container = new VBox({ items: items });

  return renderDynamicElementWrapper(container, renderContext);
}

function renderBooleanChoice(renderContext: RenderContext<BooleanChoiceFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, getValue, setValue } = context;
  const { id = generateId(page, elementIndex), columns = 1 } = element;
  const options = ['Yes', 'No'];

  const value = getValue(id);
  const hasValue = typeof value === 'boolean';
  const onSelect = (e: Event) => setValue(id, e.getParameter('selectedIndex') === 0);

  const inputs = new RadioButtonGroup({
    columns: columns,
    select: onSelect,
    selectedIndex: hasValue ? (value ? 0 : 1) : -1,
    buttons: options.map((option) => new RadioButton({ text: option })),
  });

  return renderDynamicElementWrapper(inputs, renderContext);
}

function renderNumberInput(renderContext: RenderContext<NumberStepInputFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, getValue, setValue } = context;
  const { id = generateId(page, elementIndex), min, max, stepperDescription } = element;

  const value = getValue(id) as number;
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));
  const input = new StepInput({
    width: '100%',
    value,
    min,
    max,
    description: stepperDescription,
    change: onChange,
  });

  return renderDynamicElementWrapper(input, renderContext);
}

function renderDateTime(renderContext: RenderContext<DateTimeFormSchemaElement>) {
  const { element, elementIndex, context } = renderContext;
  const { page, getValue, setValue } = context;
  const { id = generateId(page, elementIndex) } = element;

  const value = getValue(id) as string;
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));
  const input = new DateTimePicker({ width: '100%', value: value, change: onChange });

  return renderDynamicElementWrapper(input, renderContext);
}

/**
 * Wraps the given control of a {@link DynamicFormSchemaElement} in a container that
 * displays the shared attributes of such dynamic elements, i.e., the label, description,
 * helper text, etc.
 * @param innerControl The control to be wrapped.
 */
function renderDynamicElementWrapper(
  innerControl: Control,
  { element, elementIndex, context }: RenderContext<DynamicFormSchemaElement<string>>,
) {
  const { page } = context;
  const {
    id = generateId(page, elementIndex),
    label = '',
    description = '',
    helperText = '',
    required = false,
  } = element;

  // Validation: If validation errors are to be shown, we can make the changes here.
  // We can usually just leverage SAPUI's value state for appending validation info.
  // Note that not every control might have this.
  // If we ever implement such a control, we might have to inject "custom" error text here
  // (e.g., via a red text).
  if (context.showValidationErrors) {
    const anyInnerControl = innerControl as any;
    const controlValidationErrors = context.currentPageValidationErrors.filter((e) => e.elementId === id);
    const hasErrors = controlValidationErrors.length > 0;

    if (hasErrors) {
      anyInnerControl.setValueState?.(ValueState.Error);
      anyInnerControl.setValueStateText?.(controlValidationErrors.map((e) => e.message).join('\n'));
    }
  }

  const container = new VBox({
    alignItems: FlexAlignItems.Stretch,
    items: [
      label && new Label({ text: label, required }),
      description && new FormattedText({ htmlText: description }).addStyleClass('sapUiTinyMarginBottom'),
      innerControl,
      helperText && new FormattedText({ htmlText: helperText }),
    ].filter(Boolean) as Array<Control>,
  });

  return container;
}
