import { FormEngineState } from './FormEngine';
import { FormSchemaExpressionOrPrimitive, FormSchemaExpressionPrimitive, FormSchemaExpression } from './Schema';

export function isExpressionTruthy(expression: FormSchemaExpressionOrPrimitive, state: FormEngineState) {
  return !!evaluateExpression(expression, state);
}

function evaluateExpression(expression: FormSchemaExpressionOrPrimitive, state: FormEngineState): any {
  if (isPrimitive(expression)) {
    return expression;
  }

  return true;
}

/**
 * Returns whether the given expression is a primitive, that is, a string, number or boolean.
 * If `false`, the expression is a fully-fledged {@link FormSchemaExpression}.
 * @param expression The form schema expression (or primitive).
 */
function isPrimitive(expression: FormSchemaExpressionOrPrimitive): expression is FormSchemaExpressionPrimitive {
  return typeof expression === 'string' || typeof expression === 'number' || typeof expression === 'boolean';
}
