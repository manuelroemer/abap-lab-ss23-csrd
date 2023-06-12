import { FormEngineState } from './FormEngineContext';
import { FormSchemaExpressionOrPrimitive, FormSchemaExpressionPrimitive } from './Schema';

export function isExpressionTruthy(expression: FormSchemaExpressionOrPrimitive, state: FormEngineState) {
  return !!evaluateExpression(expression, state);
}

function evaluateExpression(expression: FormSchemaExpressionOrPrimitive, state: FormEngineState): any {
  if (isPrimitive(expression)) {
    return expression;
  }

  if (expression.type === 'value') {
    return state[expression.id];
  }

  if (expression.type === 'not') {
    const tempValue = evaluateExpression(expression.value, state);
    return !tempValue;
  }

  const leftValue = evaluateExpression(expression.left, state);
  const rightValue = evaluateExpression(expression.right, state);

  if (expression.type === 'and') {
    return !!leftValue && !!rightValue;
  }

  if (expression.type === 'or') {
    return !!leftValue || !!rightValue;
  }

  if (expression.type === 'eq') {
    return leftValue == rightValue;
  }

  if (expression.type === 'ne') {
    return leftValue != rightValue;
  }

  if (expression.type === 'lt') {
    return +leftValue < +rightValue;
  }

  if (expression.type === 'le') {
    return +leftValue <= +rightValue;
  }

  if (expression.type === 'gt') {
    return +leftValue > +rightValue;
  }

  if (expression.type === 'ge') {
    return +leftValue >= +rightValue;
  }

  return false;
}

/**
 * Returns whether the given expression is a primitive, that is, a string, number or boolean.
 * If `false`, the expression is a fully-fledged {@link FormSchemaExpression}.
 * @param expression The form schema expression (or primitive).
 */
function isPrimitive(expression: FormSchemaExpressionOrPrimitive): expression is FormSchemaExpressionPrimitive {
  return typeof expression === 'string' || typeof expression === 'number' || typeof expression === 'boolean';
}
