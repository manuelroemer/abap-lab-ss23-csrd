import { createState } from '../utils/State';
import { FormBuilderStateFormEngineSlice, createFormBuilderFormEngineSlice } from './State.FormEngine';

/**
 * Represents the internal state of the form builder page.
 */
export interface FormBuilderState extends FormBuilderStateFormEngineSlice {}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(({ state }) => ({
    ...createFormBuilderFormEngineSlice(state),
  }));
}
