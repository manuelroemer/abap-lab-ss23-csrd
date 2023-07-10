import { FormEngineState } from './FormEngineContext';
import { FormSchema, FormSchemaExpressionOrPrimitive } from './Schema';
import { isPrimitive } from './SchemaUtils';

/**
 * Returns a boolean indicating whether the given form schema expression is truthy.
 * @param expression The expression to be evaluated.
 * @param schema The form schema.
 * @param state The current form engine state.
 */
export function isExpressionTruthy(
  expression: FormSchemaExpressionOrPrimitive,
  schema: FormSchema,
  state: FormEngineState,
) {
  return !!evaluateExpression(expression, schema, state);
}

/**
 * Evaluates a form schema expression and returns the result.
 * This result can be any value, e.g., a number, a string, a boolean, etc.
 * @param expression The expression to be evaluated.
 * @param schema The form schema.
 * @param state The current form engine state.
 */
function evaluateExpression(
  expression: FormSchemaExpressionOrPrimitive,
  schema: FormSchema,
  state: FormEngineState,
): any {
  if (isPrimitive(expression)) {
    return expression;
  }

  if (expression.type === 'value') {
    return state[expression.id];
  }

  if (expression.type === 'ref') {
    const ref = schema.refs?.conditions?.[expression.id];
    return ref ? evaluateExpression(ref, schema, state) : undefined;
  }

  if (expression.type === 'not') {
    const tempValue = evaluateExpression(expression.value, schema, state);
    return !tempValue;
  }

  const leftValue = evaluateExpression(expression.left, schema, state);
  const rightValue = evaluateExpression(expression.right, schema, state);

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
