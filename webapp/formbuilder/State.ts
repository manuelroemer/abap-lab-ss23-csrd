import { createState } from '../utils/State';
import {
  FormBuilderStateElementPropertiesAreaSlice,
  createFormBuilderElementPropertiesAreaSlice,
} from './State.FormBuilderElementPropertiesArea';
import {
  FormBuilderStatePagePropertiesAreaSlice,
  createFormBuilderPagePropertiesAreaSlice,
} from './State.FormBuilderPagePropertiesArea';
import { FormBuilderStateFormEngineSlice, createFormBuilderFormEngineSlice } from './State.FormEngine';
import { FormBuilderStatePageAreaSlice, createFormBuilderPageAreaSlice } from './State.PageArea';

/**
 * Represents the internal state of the form builder page.
 */
export interface FormBuilderState
  extends FormBuilderStateFormEngineSlice,
    FormBuilderStatePageAreaSlice,
    FormBuilderStatePagePropertiesAreaSlice,
    FormBuilderStateElementPropertiesAreaSlice {}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(({ state }) => ({
    ...createFormBuilderFormEngineSlice(state),
    ...createFormBuilderPageAreaSlice(state),
    ...createFormBuilderPagePropertiesAreaSlice(state),
    ...createFormBuilderElementPropertiesAreaSlice(state),
  }));
}

export const formBuilderState = createFormBuilderState();
