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
  SingleChoiceFormSchemaElement,
  NumberStepInputFormSchemaElement,
  SingleChoiceSelectFormSchemaElement,
  DateTimeFormSchemaElement,
} from './Schema';
import { FormEngineContext, FormEngineState } from './FormEngine';
import { isExpressionTruthy } from './Expressions';
import RadioButtonGroup from 'sap/m/RadioButtonGroup';
import RadioButton from 'sap/m/RadioButton';
import CheckBox from 'sap/m/CheckBox';
import StepInput from 'sap/m/StepInput';
import ListItem from 'sap/ui/core/ListItem';
import Select from 'sap/m/Select';
import DateTimePicker from 'sap/m/DateTimePicker';

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

  return control;
}

function renderHeading({ text, level = 1, wrap = true }: HeadingFormSchemaElement) {
  return new Title({ text, level: `H${level}`, wrapping: wrap });
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
      ? new Input({ placeholder, value, change: onChange })
      : new TextArea({ placeholder, rows, value, change: onChange });
  return renderDynamicElementWrapper(element, input);
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
  return renderDynamicElementWrapper(element, input);
}

function renderSingleChoiceSelect(element: SingleChoiceSelectFormSchemaElement, context: FormEngineContext) {
  const { id, options } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) ?? '';
  const onSelect = (e: Event) => {
    const selectedItemKey = e.getParameter('selectedItem').getKey();
    const selectedOption = options.find((option) => option.value === selectedItemKey);
    setValue(id, selectedOption?.value);
    console.log(selectedOption);
  };

  const input = new Select({
    selectedKey: value,
    change: onSelect,
    items: [new ListItem({ key: '', text: '' })].concat(
      options.map((option) => new ListItem({ key: option.value, text: option.display ?? option.value })),
    ),
  });
  return renderDynamicElementWrapper(element, input);
}

function renderMultiChoice(element: MultiChoiceFormSchemaElement, context: FormEngineContext) {
  const { id, options } = element;
  const { getValue, setValue } = context;
  const value = (getValue(element.id) as Array<string>) ?? [];

  const items = options.map((option) => {
    const selected = value.includes(option.value);
    const onSelect = (e: Event) => {
      const isSelected = e.getParameter('selected') as boolean;
      const nextValue = isSelected ? [...value, option.value] : value.filter((v) => v === option.value);
      setValue(id, nextValue);
    };
    return new CheckBox({ text: option.display ?? option.value, selected, select: onSelect });
  });
  const input = new VBox({
    items: items,
  });
  return renderDynamicElementWrapper(element, input);
}

function renderBooleanChoice(element: BooleanChoiceFormSchemaElement, context: FormEngineContext) {
  const { id, columns = 1 } = element;
  const options = ['Yes', 'No'];
  const { getValue, setValue } = context;
  const value = getValue(element.id);
  const hasValue = typeof value === 'boolean';
  const onSelect = (e: Event) => setValue(id, e.getParameter('selectedIndex') === 0);

  const input = new RadioButtonGroup({
    columns: columns,
    select: onSelect,
    selectedIndex: hasValue ? (value ? 0 : 1) : -1,
    buttons: options.map((option) => new RadioButton({ text: option })),
  });
  return renderDynamicElementWrapper(element, input);
}

function renderNumberInput(element: NumberStepInputFormSchemaElement, context: FormEngineContext) {
  const { id, min, max, stepperDescription } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) as number;
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));

  const input = new StepInput({
    value,
    min,
    max,
    change: onChange,
    description: stepperDescription,
    textAlign: 'Center',
  });
  return renderDynamicElementWrapper(element, input);
}

function renderDateTime(element: DateTimeFormSchemaElement, context: FormEngineContext) {
  const { id } = element;
  const { getValue, setValue } = context;
  const value = getValue(element.id) as string;
  const onChange = (e: Event) => setValue(id, e.getParameter('value'));

  const input = new DateTimePicker({ value: value, change: onChange });
  return renderDynamicElementWrapper(element, input);
}

function renderDynamicElementWrapper(
  { label, description = '', required = false }: DynamicFormSchemaElement<string>,
  innerControl: Control,
) {
  return new VBox({
    items: [
      label && new Label({ text: label, required }),
      innerControl,
      description && new FormattedText({ htmlText: description }),
    ].filter(Boolean) as Array<Control>,
  });
}

function evaluateRules(element: FormSchemaElement, state: FormEngineState) {
  const elementEffects = element.effects ?? [];
  const effectsToApply = elementEffects.filter((e) => !isExpressionTruthy(e.condition, state));

  return {
    hide: effectsToApply.some((e) => e.effect === 'hide'),
  };
}
