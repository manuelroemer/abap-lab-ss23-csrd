import { DynamicFormSchemaElement, StaticFormSchemaElement } from './FormSchemaElement';

/**
 * Renders a heading.
 */
export interface HeadingFormSchemaElement extends StaticFormSchemaElement<'heading'> {
  /**
   * The text to be rendered.
   */
  text: string;
  /**
   * The level of the heading. Translates to <hX> tags in HTML.
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Whether text should be wrapped on smaller devices.
   */
  wrap?: boolean;
}

/**
 * Renders arbitrary text.
 */
export interface TextFormSchemaElement extends StaticFormSchemaElement<'text'> {
  /**
   * The text to be rendered.
   */
  text: string;
}

export interface TextInputFormSchemaElement extends DynamicFormSchemaElement<'text-input'> {
  /**
   * A placeholder text to be shown in the input field if no value is entered at the moment.
   */
  placeholder?: string;
  /**
   * Allows to specify the number of rows to be shown in the input field.
   * If not specified, the element will be rendered as a single-line input field.
   */
  rows?: number;
}

/**
 * A union of all known form schema elements.
 */
export type FormSchemaElement = HeadingFormSchemaElement | TextFormSchemaElement | TextInputFormSchemaElement;

/**
 * A union of all known form schema element types.
 */
export type FormSchemaElementType = FormSchemaElement['type'];
