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
   * A display name of the page.
   */
  name?: string;
  /**
   * The page's elements.
   */
  elements: Array<FormSchemaElement>;
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
   * Rules that are automatically evaluated before the element is rendered, e.g., to hide the element.
   */
  effects?: Array<FormSchemaElementEffect>;
}

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
  id: string;
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
   * A description of the element, similar to a helper text.
   */
  description?: string;
}

/**
 * An effect that is applied to a form schema element when a condition is met.
 */
export interface FormSchemaElementEffect {
  effect: 'hide';
  condition: FormSchemaExpressionOrPrimitive;
}

/**
 * Renders a heading.
 */
export interface HeadingFormSchemaElement extends StaticFormSchemaElement<'heading'> {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  wrap?: boolean;
}

/**
 * Renders arbitrary text.
 */
export interface TextFormSchemaElement extends StaticFormSchemaElement<'text'> {
  text: string;
}

export interface WhiteSpaceFormSchemaElement extends StaticFormSchemaElement<'whiteSpace'> {
  present: boolean;
}

export interface TextInputFormSchemaElement extends DynamicFormSchemaElement<'text-input'> {
  placeholder?: string;
  rows?: number;
}

/**
 * A union of all known form schema elements.
 */
export type FormSchemaElement =
  | HeadingFormSchemaElement
  | TextFormSchemaElement
  | TextInputFormSchemaElement
  | WhiteSpaceFormSchemaElement;

/**
 * A union of all known form schema element types.
 */
export type FormSchemaElementType = FormSchemaElement['type'];
