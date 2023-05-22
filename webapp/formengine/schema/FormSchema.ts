import { FormSchemaPage } from "./FormSchemaPage";

/**
 * Represents an entire form schema, including all pages and all elements to be rendered.
 */
export interface FormSchema {
  /**
   * All pages to be rendered.
   */
  pages: Array<FormSchemaPage>;
}
