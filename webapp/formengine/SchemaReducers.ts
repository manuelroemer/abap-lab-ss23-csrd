import { FormSchema, FormSchemaElement, FormSchemaPage } from './Schema';

export type Update<T> = (value: T) => T;

/**
 * Updates the pages of a form schema.
 * @param schema The schema to be updated.
 * @param update A pure function updating the schema's pages.
 * @returns The updated schema.
 */
export function updatePages(schema: FormSchema, update: Update<Array<FormSchemaPage>>): FormSchema {
  return {
    ...schema,
    pages: update(schema.pages),
  };
}

/**
 * Updates a page of a form schema.
 * @param schema The schema to be updated.
 * @param pageIndex The index of the page to be updated.
 * @param update A pure function updating the page.
 * @returns The updated schema.
 */
export function updatePage(schema: FormSchema, pageIndex: number, update: Update<FormSchemaPage>): FormSchema {
  return updatePages(schema, (pages) => pages.map((page, index) => (index === pageIndex ? update(page) : page)));
}

/**
 * Updates all elements of a specific page of a form schema.
 * @param schema The schema to be updated.
 * @param pageIndex The index of the page to be updated.
 * @param update A pure function updating the page's elements.
 * @returns The updated schema.
 */
export function updateElements(
  schema: FormSchema,
  pageIndex: number,
  update: Update<Array<FormSchemaElement>>,
): FormSchema {
  return updatePage(schema, pageIndex, (page) => ({
    ...page,
    elements: update(page.elements),
  }));
}

/**
 * Updates a specific element of a specific page of a form schema.
 * @param schema The schema to be updated.
 * @param pageIndex The index of the page containing the element to be updated.
 * @param elementIndex The index of the element to be updated.
 * @param update A pure function updating the element.
 * @returns The updated schema.
 */
export function updateElement(
  schema: FormSchema,
  pageIndex: number,
  elementIndex: number,
  update: Update<FormSchemaElement>,
): FormSchema {
  return updateElements(schema, pageIndex, (elements) =>
    elements.map((element, index) => (index === elementIndex ? update(element) : element)),
  );
}
