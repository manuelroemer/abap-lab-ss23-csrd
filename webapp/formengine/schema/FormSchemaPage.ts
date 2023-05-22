import { FormSchemaElement } from './FormSchemaElements';

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
