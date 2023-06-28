import { isExpressionTruthy } from './Expressions';
import { FormEngineState } from './FormEngineContext';
import { FormSchemaElement, FormSchemaPage } from './Schema';

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
 * @param state The current form engine state.
 */
export function evaluateRules(objWithEffects: FormSchemaElement | FormSchemaPage, state: FormEngineState): RuleResult {
  const effects = objWithEffects.effects ?? [];
  const effectsToApply = effects.filter((e) => !isExpressionTruthy(e.condition, state));

  return {
    hide: effectsToApply.some((e) => e.effect === 'hide'),
  };
}
