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
} from './Schema';
import { FormEngineContext } from './FormEngineContext';
import RadioButtonGroup from 'sap/m/RadioButtonGroup';
import RadioButton from 'sap/m/RadioButton';
import CheckBox from 'sap/m/CheckBox';
import StepInput from 'sap/m/StepInput';
import ListItem from 'sap/ui/core/ListItem';
import Select from 'sap/m/Select';
import DateTimePicker from 'sap/m/DateTimePicker';
import { uniq } from '../utils/Uniq';
import { ValueState } from 'sap/ui/core/library';
import { FlexAlignItems } from 'sap/m/library';
import { evaluateRules } from './Rules';

type RenderFormSchemaElement<T extends FormSchemaElement = FormSchemaElement> = (
  element: T,
  context: FormEngineContext,
) => Control;

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

export function render<T extends FormSchemaElement>(element: T, context: FormEngineContext): Control {
  const renderer = elementRenderers[element.type] as RenderFormSchemaElement;
  const control = renderer(element, context);

  const { hide } = evaluateRules(element, context.state);
  if (hide) {
    control.setVisible(false);
  }

  control.addStyleClass('sapUiSmallMarginBottom');

  return control;
}

function renderHeading({ text, level = 3, wrap = true }: HeadingFormSchemaElement) {
  return new Title({ text, level: `H${level}`, titleStyle: `H${level}`, wrapping: wrap });
}

function renderText({ text }: TextFormSchemaElement) {
  return new FormattedText({ htmlText: text });
}

function renderTextInput(element: TextInputFormSchemaElement, context: FormEngineContext) {
  const { id, placeholder, rows = 1 } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id)?.toString() ?? '';
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));
  const input =
    rows > 1
      ? new Input({ width: '100%', placeholder, value, change: onChange })
      : new TextArea({ width: '100%', placeholder, rows, value, change: onChange });
  return renderDynamicElementWrapper(element, input, context);
}

function renderCheckbox(element: CheckboxFormSchemaElement, context: FormEngineContext) {
  const { id, option } = element;
  const { state, setState } = context;
  const value = (state[element.id] as Array<string>) ?? [];

  const blob = () => {
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
      selected: value.includes(option.value),
      select: onSelect,
    });
  };
  const box = blob();
  const boxes = new Array();
  boxes.push(box);
  const container = new VBox({ items: boxes });
  return renderDynamicElementWrapper(element, container, context);
}

function renderSingleChoice(element: SingleChoiceFormSchemaElement, context: FormEngineContext) {
  const { id, options, columns = 1 } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) ?? '';
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
  return renderDynamicElementWrapper(element, input, context);
}

function renderSingleChoiceSelect(element: SingleChoiceSelectFormSchemaElement, context: FormEngineContext) {
  const { id, options } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) ?? '';
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

  return renderDynamicElementWrapper(element, input, context);
}

function renderMultiChoice(element: MultiChoiceFormSchemaElement, context: FormEngineContext) {
  const { id, options } = element;
  const { state, setState } = context;
  const value = (state[element.id] as Array<string>) ?? [];

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
      selected: value.includes(option.value),
      select: onSelect,
    });
  });

  const container = new VBox({ items: items });
  return renderDynamicElementWrapper(element, container, context);
}

function renderBooleanChoice(element: BooleanChoiceFormSchemaElement, context: FormEngineContext) {
  const { id, columns = 1 } = element;
  const options = ['Yes', 'No'];
  const { getValue, setValue } = context;
  const value = getValue(element.id);
  const hasValue = typeof value === 'boolean';
  const onSelect = (e: Event) => setValue(id, e.getParameter('selectedIndex') === 0);
  const inputs = new RadioButtonGroup({
    columns: columns,
    select: onSelect,
    selectedIndex: hasValue ? (value ? 0 : 1) : -1,
    buttons: options.map((option) => new RadioButton({ text: option })),
  });

  return renderDynamicElementWrapper(element, inputs, context);
}

function renderNumberInput(element: NumberStepInputFormSchemaElement, context: FormEngineContext) {
  const { id, min, max, stepperDescription } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) as number;
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));
  const input = new StepInput({
    width: '100%',
    value,
    min,
    max,
    description: stepperDescription,
    change: onChange,
  });

  return renderDynamicElementWrapper(element, input, context);
}

function renderDateTime(element: DateTimeFormSchemaElement, context: FormEngineContext) {
  const { id } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) as string;
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));
  const input = new DateTimePicker({ width: '100%', value: value, change: onChange });
  return renderDynamicElementWrapper(element, input, context);
}

function renderDynamicElementWrapper(
  element: DynamicFormSchemaElement<string>,
  innerControl: Control,
  context: FormEngineContext,
) {
  const { id, label, description = '', helperText = '', required = false } = element;

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
