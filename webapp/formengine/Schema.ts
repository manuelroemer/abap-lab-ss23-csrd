export interface FormSchemaExpressionBase<TType extends string> {
  type: TType;
}

export interface FormSchemaValueExpression extends FormSchemaExpressionBase<'value'> {
  id: string;
}

export interface FormSchemaOpUnaryExpression<TType extends string> extends FormSchemaExpressionBase<TType> {
  value: FormSchemaExpressionOrPrimitive;
}

export interface FormSchemaOpBinaryExpression<TType extends string> extends FormSchemaExpressionBase<TType> {
  left: FormSchemaExpressionOrPrimitive;
  right: FormSchemaExpressionOrPrimitive;
}

export type FormSchemaExpressionPrimitive = string | number | boolean;

export type FormSchemaExpression =
  | FormSchemaValueExpression
  | FormSchemaOpUnaryExpression<'not'>
  | FormSchemaOpBinaryExpression<'and'>
  | FormSchemaOpBinaryExpression<'or'>
  | FormSchemaOpBinaryExpression<'eq'>
  | FormSchemaOpBinaryExpression<'ne'>
  | FormSchemaOpBinaryExpression<'lt'>
  | FormSchemaOpBinaryExpression<'le'>
  | FormSchemaOpBinaryExpression<'gt'>
  | FormSchemaOpBinaryExpression<'ge'>;

export type FormSchemaExpressionOrPrimitive = FormSchemaExpression | FormSchemaExpressionPrimitive;

export type FormSchemaExpressionType = FormSchemaExpression['type'];

/**
 * Represents an entire form schema, including all pages and all elements to be rendered.
 */
export interface FormSchema {
  /**
   * All pages to be rendered.
   */
  pages: Array<FormSchemaPage>;
}

/**
 * Represents a single page of a form schema, including all elements to be rendered.
 */
export interface FormSchemaPage {
  /**
   * A unique identifier of the page.
   * This must be unique within the form schema.
   */
  id: string;
  /**
   * The pages title, for display.
   */
  title?: string;
  /**
   * The page's elements.
   */
  elements: Array<FormSchemaElement>;
  /**
   * Rules that are automatically evaluated before the page is rendered, e.g., to hide the page.
   */
  effects?: Array<FormSchemaElementEffect>;
}

/**
 * A base type for any form schema element.
 *
 * @typeParam TType A type discriminator that unique identifies the specific type of the form schema element.
 */
export interface FormSchemaElementBase<TType extends string> {
  /**
   * Uniquely identifies the type of this form schema element.
   * This can be used as a type discriminator.
   */
  type: TType;
  /**
   * The element's top margin.
   */
  marginTop?: Margin;
  /**
   * The element's bottom margin.
   */
  marginBottom?: Margin;
  /**
   * Rules that are automatically evaluated before the element is rendered, e.g., to hide the element.
   */
  effects?: Array<FormSchemaElementEffect>;
}

/**
 * Defines different margins.
 */
export type Margin = 'None' | 'Tiny' | 'Small' | 'Medium' | 'Large';

/**
 * A base type for any form schema element that does **not** allow any kind of data input and/or modification.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticFormSchemaElement<TType extends string> extends FormSchemaElementBase<TType> {
  // Kept empty on purpose.
  // If required later on, we can add shared properties here.
}

/**
 * A base type for any form schema element that allows actual data input and/or modification.
 */
export interface DynamicFormSchemaElement<TType extends string> extends FormSchemaElementBase<TType> {
  /**
   * A unique identifier for this element.
   * This must be unique within the form schema as it is used for generating the form engine's state.
   */
  id?: string;
  /**
   * Whether the user must enter data for this element.
   * The default is `false`.
   */
  required?: boolean;
  /**
   * A label describing the element.
   */
  label?: string;
  /**
   * A description of the element, describing its purpose in detail.
   */
  description?: string;
  /**
   * An additional helper text which provides granular information about the element,
   * further enriching the information provided by `description`.
   */
  helperText?: string;
  /**
   * A set of validation rules which allow dynamic error generation.
   */
  validationRules?: Array<FormSchemaElementValidationRules>;
}

/**
 * An effect that is applied to a form schema element when a condition is met.
 */
export interface FormSchemaElementEffect {
  effect: 'hide';
  condition: FormSchemaExpressionOrPrimitive;
}

export interface FormSchemaElementValidationRules {
  message: string;
  condition: FormSchemaExpressionOrPrimitive;
}

/**
 * Renders a heading.
 */
export interface HeadingFormSchemaElement extends StaticFormSchemaElement<'heading'> {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  wrap?: boolean;
}

/**
 * Renders arbitrary text.
 */
export interface TextFormSchemaElement extends StaticFormSchemaElement<'text'> {
  text?: string;
}

export interface TextInputFormSchemaElement extends DynamicFormSchemaElement<'text-input'> {
  placeholder?: string;
  rows?: number;
}

export interface ChoiceOption {
  value?: string;
  display?: string;
}

/**
 * Single checkbox
 */
export interface CheckboxFormSchemaElement extends DynamicFormSchemaElement<'checkbox'> {
  text?: string;
}

/**
 * RadioButtons with multiple options
 */
export interface SingleChoiceFormSchemaElement extends DynamicFormSchemaElement<'single-choice'> {
  options?: Array<ChoiceOption>;
  columns?: number;
}

/**
 * Select with multiple options
 */
export interface SingleChoiceSelectFormSchemaElement extends DynamicFormSchemaElement<'single-choice-select'> {
  options?: Array<ChoiceOption>;
}

/**
 * Checkboxes
 */
export interface MultiChoiceFormSchemaElement extends DynamicFormSchemaElement<'multi-choice'> {
  options?: Array<ChoiceOption>;
}

/**
 * Yes/No Input as RadioButtons
 */
export interface BooleanChoiceFormSchemaElement extends DynamicFormSchemaElement<'boolean-choice'> {
  columns?: number;
}

/**
 * Number Stepper
 */
export interface NumberStepInputFormSchemaElement extends DynamicFormSchemaElement<'number-input'> {
  min?: number;
  max?: number;
  stepperDescription?: string;
}

export type DateTimeFormSchemaElement = DynamicFormSchemaElement<'date-time'>;

/**
 * A union of all known form schema elements.
 */
export type FormSchemaElement =
  | HeadingFormSchemaElement
  | TextFormSchemaElement
  | TextInputFormSchemaElement
  | CheckboxFormSchemaElement
  | SingleChoiceFormSchemaElement
  | SingleChoiceSelectFormSchemaElement
  | MultiChoiceFormSchemaElement
  | BooleanChoiceFormSchemaElement
  | NumberStepInputFormSchemaElement
  | DateTimeFormSchemaElement;

/**
 * A union of all known form schema element types.
 */
export type FormSchemaElementType = FormSchemaElement['type'];
