export interface FormSchema {
  pages: Array<FormSchemaPage>;
}

export interface FormSchemaPage {
  name?: string;
  elements: Array<FormSchemaElement>;
}

export interface FormSchemaBaseElement<TType extends string> {
  id: string;
  required: boolean;
  type: TType;
  defaultValue?: any;
  label?: string;
  helperText?: string;
}

export interface StringFormSchemaElement extends FormSchemaBaseElement<'string'> {
  placeholder?: string;
  rows?: number;
}

export interface NumberFormSchemaElement extends FormSchemaBaseElement<'number'> {
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface NumberSliderFormSchemaElement extends FormSchemaBaseElement<'number-slider'> {
  min: number;
  max: number;
}

export interface BooleanFormSchemaElement extends FormSchemaBaseElement<'boolean'> {
  trueText: string;
  falseText: string;
}

export interface ChoiceOption {
  value: string;
  display?: string;
}

export type ChoiceOptionSource = Array<ChoiceOption> | string;

export interface SingleChoiceFormSchemaElement extends FormSchemaBaseElement<'single-choice'> {
  options: ChoiceOptionSource;
}

export interface MultiChoiceFormSchemaElement extends FormSchemaBaseElement<'multi-choice'> {
  options: ChoiceOptionSource;
}

export interface SingleChoiceSelectFormSchemaElement extends FormSchemaBaseElement<'single-choice-select'> {
  placeholder?: string;
  options: ChoiceOptionSource;
}

export type DatesFormSchemaElement = FormSchemaBaseElement<'dates'>;

export type DateTimeFormSchemaElement = FormSchemaBaseElement<'date-time'>;

export type CheckboxFormSchemaElement = FormSchemaBaseElement<'boolean-checkbox'>;

export type FormSchemaElement =
  | StringFormSchemaElement
  | NumberFormSchemaElement
  | NumberSliderFormSchemaElement
  | BooleanFormSchemaElement
  | SingleChoiceFormSchemaElement
  | SingleChoiceSelectFormSchemaElement
  | MultiChoiceFormSchemaElement
  | DatesFormSchemaElement
  | DateTimeFormSchemaElement
  | CheckboxFormSchemaElement;

export type FormSchemaElementType = FormSchemaElement['type'];
