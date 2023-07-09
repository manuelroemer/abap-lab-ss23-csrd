import { FormSchema } from './Schema';

/**
 * Returns a fallback ID for a schema element without an explicit `id` attribute.
 * @param pageIndex The index of the page on which the element is located.
 * @param elementIndex The index of the element on the page.
 */
export function generateId(pageIndex: number, elementIndex: number) {
  return `page-${pageIndex}-element-${elementIndex}`;
}

/**
 * Represents a bare, empty form schema.
 */
export const emptySchema: FormSchema = {
  pages: [
    {
      elements: [],
    },
  ],
};
