import Control from 'sap/ui/core/Control';
import {
  DynamicFormSchemaElement,
  FormSchema,
  FormSchemaElement,
  FormSchemaElementType,
  FormSchemaRule,
  FormSchemaRuleEffect,
  HeadingFormSchemaElement,
  TextFormSchemaElement,
  TextInputFormSchemaElement,
} from './schema';
import Title from 'sap/m/Title';
import FormattedText from 'sap/m/FormattedText';
import Input from 'sap/m/Input';
import VBox from 'sap/m/VBox';
import Label from 'sap/m/Label';
import TextArea from 'sap/m/TextArea';
import Event from 'sap/ui/base/Event';
import { checkConditions } from '../json-conditions/json-conditions';

export type FormEngineState = Record<string, unknown>;

export interface FormEngineRenderingContext {
  schema: FormSchema;
  state: FormEngineState;
  getState(id: string): unknown;
  setState(id: string, value: unknown): void;
}

type RenderFormSchemaElement<T extends FormSchemaElement = FormSchemaElement> = (
  element: T,
  context: FormEngineRenderingContext,
) => Control;

type RenderLookup = {
  [T in FormSchemaElementType]: RenderFormSchemaElement<Extract<FormSchemaElement, { type: T }>>;
};

const elementRenderers: RenderLookup = {
  heading: renderHeading,
  text: renderText,
  'text-input': renderTextInput,
};

export function render<T extends FormSchemaElement>(element: T, context: FormEngineRenderingContext): Control {
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

function renderTextInput(element: TextInputFormSchemaElement, context: FormEngineRenderingContext) {
  const { id, placeholder, rows = 1 } = element;
  const { getState, setState } = context;
  const value = getState(element.id)?.toString() ?? '';
  const onChange = (e: Event) => setState(id, e.getParameter('value'));
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
  const rules = element.rules ?? [];
  const effects = rules.map((rule) => evaluateOneRule(rule, state));

  return {
    hide: effects.some((effect) => effect === 'hide'),
  };
}

function evaluateOneRule(rule: FormSchemaRule, value: object): undefined | FormSchemaRuleEffect {
  const rules = rule.conditions ?? [];
  const satisfy = rule.satisfy?.toUpperCase() ?? 'ALL';
  const config = { rules, satisfy };

  try {
    return checkConditions(config, value) ? rule.effect : undefined;
  } catch (e) {
    console.warn('Evaluating rule conditions failed.', e, rule, value);
    return undefined;
  }
}
