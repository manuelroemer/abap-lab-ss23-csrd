import { isExpressionTruthy } from './Expressions';
import { FormEngineState } from './FormEngineContext';
import { FormSchemaElement } from './Schema';

export function evaluateRules(element: FormSchemaElement, state: FormEngineState) {
  const elementEffects = element.effects ?? [];
  const effectsToApply = elementEffects.filter((e) => !isExpressionTruthy(e.condition, state));

  return {
    hide: effectsToApply.some((e) => e.effect === 'hide'),
  };
}
