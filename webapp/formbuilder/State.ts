import { createState } from '../utils/State';
import {
  FormBuilderStateElementPropertiesAreaSlice,
  createFormBuilderElementPropertiesAreaSlice,
} from './State.ElementPropertiesArea';
import {
  FormBuilderStatePagePropertiesAreaSlice,
  createFormBuilderPagePropertiesAreaSlice,
} from './State.PagePropertiesArea';
import { FormBuilderStatePreviewAreaSlice, createFormBuilderPreviewAreaSlice } from './State.PreviewArea';
import { FormBuilderStateFormEngineSlice, createFormBuilderFormEngineSlice } from './State.FormEngine';
import { FormBuilderStatePageAreaSlice, createFormBuilderPageAreaSlice } from './State.PageArea';
import {
  FormBuilderStateAddElementDialogSlice,
  createFormBuilderAddElementDialogSlice,
} from './State.AddElementDialog';

/**
 * Represents the internal state of the form builder page.
 */
export interface FormBuilderState
  extends FormBuilderStateFormEngineSlice,
    FormBuilderStatePageAreaSlice,
    FormBuilderStatePreviewAreaSlice,
    FormBuilderStatePagePropertiesAreaSlice,
    FormBuilderStateElementPropertiesAreaSlice,
    FormBuilderStateAddElementDialogSlice {}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(({ state }) => ({
    ...createFormBuilderFormEngineSlice(state),
    ...createFormBuilderPageAreaSlice(state),
    ...createFormBuilderPreviewAreaSlice(state),
    ...createFormBuilderPagePropertiesAreaSlice(state),
    ...createFormBuilderElementPropertiesAreaSlice(state),
    ...createFormBuilderAddElementDialogSlice(state),
  }));
}

export const formBuilderState = createFormBuilderState();