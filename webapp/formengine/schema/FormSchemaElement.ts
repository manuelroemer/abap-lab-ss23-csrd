import { FormSchemaRule } from './FormSchemaRule';

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
  rules?: Array<FormSchemaRule>;
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
