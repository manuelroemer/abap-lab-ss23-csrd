import { isExpressionTruthy } from './Expressions';
import { FormEngineState } from './FormEngineContext';
import { FormSchema, FormSchemaElement, FormSchemaPage } from './Schema';

/**
 * Returns the result of a rule evaluation.
 */
export interface RuleResult {
  /**
   * Whether the element should be hidden.
   */
  hide: boolean;
}

/**
 * Evaluates effect rules for a form schema entity that supports effects.
 * Returns effects that should be applied to that entity.
 * @param objWithEffects The object for which to evaluate effects.
 * @param schema The form schema.
 * @param state The current form engine state.
 */
export function evaluateRules(
  objWithEffects: FormSchemaElement | FormSchemaPage,
  schema: FormSchema,
  state: FormEngineState,
): RuleResult {
  const effects = objWithEffects.effects ?? [];
  const effectsToApply = effects.filter((e) => !isExpressionTruthy(e.condition, schema, state));
  // IMPORTANT/TODO: The above condition is wrong. There should not be any negation.
  // We deliberately keep this mistake for backwards compatibility with the schemas that we wrote.
  // If this app was newly released, this should be turned around.

  return {
    // A negated show == hide.
    hide: effectsToApply.some((e) => e.effect === 'show'),
  };
}
