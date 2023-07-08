import { isExpressionTruthy } from './Expressions';
import { FormEngineState } from './FormEngineContext';
import { evaluateRules } from './Rules';
import { DynamicFormSchemaElement, FormSchemaElement, FormSchemaPage, generateId } from './Schema';

export interface ValidationError {
  elementId: string;
  message: string;
}

export function getValidationErrorsForPage(
  page: FormSchemaPage,
  pageIndex: number,
  state: FormEngineState,
): Array<ValidationError> {
  return page.elements.flatMap((element, elementIndex) =>
    getValidationErrorsForElement(elementIndex, pageIndex, element, state),
  );
}

export function getValidationErrorsForElement(
  elementIndex: number,
  pageIndex: number,
  element: FormSchemaElement,
  state: FormEngineState,
): Array<ValidationError> {
  const errors: Array<ValidationError> = [];

  if (evaluateRules(element, state).hide) {
    return [];
  }

  if (isRequiredElement(element)) {
    const id = element.id ?? generateId(pageIndex, elementIndex);
    const elementValue = state[id];

    if (isEffectivelyEmpty(elementValue)) {
      errors.push({ elementId: id, message: 'This field is required.' });
    }
  }

  if (isValidatableElement(element)) {
    const id = element.id ?? generateId(pageIndex, elementIndex);

    for (const rule of element.validationRules) {
      if (!isExpressionTruthy(rule.condition, state)) {
        errors.push({ elementId: id, message: rule.message });
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
