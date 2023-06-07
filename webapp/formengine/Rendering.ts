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
  WhiteSpaceFormSchemaElement, 
  TextInputFormSchemaElement,
  DynamicFormSchemaElement,
} from './Schema';
import { FormEngineContext, FormEngineState } from './FormEngine';
import { isExpressionTruthy } from './Expressions';

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
  whiteSpace: renderWhiteSpace, 
  'text-input': renderTextInput,
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

function renderWhiteSpace({ present }: WhiteSpaceFormSchemaElement) {
  if (present) {
    return new FormattedText({ htmlText:"________________________________________ \n\n________________________________________" });
  }
  return new FormattedText({}); 
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
