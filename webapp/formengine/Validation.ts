import { isExpressionTruthy } from './Expressions';
import { FormEngineState } from './FormEngineContext';
import { evaluateRules } from './Rules';
import { DynamicFormSchemaElement, FormSchemaElement, FormSchemaPage } from './Schema';

export interface ValidationError {
  elementId: string;
  message: string;
}

export function getValidationErrorsForPage(page: FormSchemaPage, state: FormEngineState): Array<ValidationError> {
  return page.elements.flatMap((element) => getValidationErrorsForElement(element, state));
}

export function getValidationErrorsForElement(
  element: FormSchemaElement,
  state: FormEngineState,
): Array<ValidationError> {
  const errors: Array<ValidationError> = [];

  if (evaluateRules(element, state).hide) {
    return [];
  }

  if (isRequiredElement(element)) {
    const elementValue = state[element.id];
    if (isEffectivelyEmpty(elementValue)) {
      errors.push({ elementId: element.id, message: 'This field is required.' });
    }
  }

  if (isValidatableElement(element)) {
    for (const rule of element.validationRules) {
      if (!isExpressionTruthy(rule.condition, state)) {
        errors.push({ elementId: element.id, message: rule.message });
      }
    }
  }

  return errors;
}

function isEffectivelyEmpty(value: unknown) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0);
}

function isValidatableElement(
  element: FormSchemaElement,
): element is DynamicFormSchemaElement<any> & Required<Pick<DynamicFormSchemaElement<any>, 'validationRules'>> {
  return Array.isArray((element as DynamicFormSchemaElement<any>).validationRules);
}

function isRequiredElement(element: FormSchemaElement): element is DynamicFormSchemaElement<any> {
  return (element as DynamicFormSchemaElement<any>).required ?? false;
}
