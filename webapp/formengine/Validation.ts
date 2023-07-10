import { isExpressionTruthy } from './Expressions';
import { FormEngineState } from './FormEngineContext';
import { evaluateRules } from './Rules';
import { DynamicFormSchemaElement, FormSchema, FormSchemaElement, FormSchemaPage } from './Schema';
import { generateId } from './SchemaUtils';

/**
 * Represents a form engine validation error which can be shown to the user.
 */
export interface ValidationError {
  /**
   * The ID of the element which was the source of the error.
   */
  elementId: string;
  /**
   * The error message.
   */
  message: string;
}

/**
 * Validates all form schema elements on a specific page and returns any found error(s).
 * @param page The page to be validated.
 * @param pageIndex The index of the page to be validated, within the form schema.
 * @param schema The form schema.
 * @param state The current form engine state.
 */
export function getValidationErrorsForPage(
  page: FormSchemaPage,
  pageIndex: number,
  schema: FormSchema,
  state: FormEngineState,
): Array<ValidationError> {
  return page.elements.flatMap((element, elementIndex) =>
    getValidationErrorsForElement(elementIndex, pageIndex, element, schema, state),
  );
}

/**
 * Validates a specific form schema element and returns any found error(s).
 * @param elementIndex The index of the element to be validated, within the page.
 * @param pageIndex The index of the page to be validated, within the form schema.
 * @param element The element to be validated.
 * @param schema The form schema.
 * @param state The current form engine state.
 */
export function getValidationErrorsForElement(
  elementIndex: number,
  pageIndex: number,
  element: FormSchemaElement,
  schema: FormSchema,
  state: FormEngineState,
): Array<ValidationError> {
  const errors: Array<ValidationError> = [];

  if (evaluateRules(element, schema, state).hide) {
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
      if (!isExpressionTruthy(rule.condition, schema, state)) {
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
