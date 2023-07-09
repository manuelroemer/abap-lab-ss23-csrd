import { FormSchema, FormSchemaExpressionOrPrimitive, FormSchemaExpressionPrimitive } from './Schema';

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

/**
 * Returns a fallback ID for a schema element without an explicit `id` attribute.
 * @param pageIndex The index of the page on which the element is located.
 * @param elementIndex The index of the element on the page.
 */
export function generateId(pageIndex: number, elementIndex: number) {
  return `page-${pageIndex}-element-${elementIndex}`;
}

/**
 * Returns whether the given expression is a primitive, that is, a string, number or boolean.
 * If `false`, the expression is a fully-fledged {@link FormSchemaExpression}.
 * @param expression The form schema expression (or primitive).
 */
export function isPrimitive(expression: FormSchemaExpressionOrPrimitive): expression is FormSchemaExpressionPrimitive {
  return (
    typeof expression === 'string' ||
    typeof expression === 'number' ||
    typeof expression === 'boolean' ||
    expression === null ||
    expression === undefined
  );
}
