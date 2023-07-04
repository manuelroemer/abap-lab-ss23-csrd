import { createState } from '../utils/State';
import { FormBuilderStateFormEngineSlice, createFormBuilderFormEngineSlice } from './State.FormEngine';
import { FormBuilderStatePageAreaSlice, createFormBuilderPageAreaSlice } from './State.PageArea';

/**
 * Represents the internal state of the form builder page.
 */
export interface FormBuilderState extends FormBuilderStateFormEngineSlice, FormBuilderStatePageAreaSlice {}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(({ state }) => ({
    ...createFormBuilderFormEngineSlice(state),
    ...createFormBuilderPageAreaSlice(state),
  }));
}

export const formBuilderState = createFormBuilderState();
