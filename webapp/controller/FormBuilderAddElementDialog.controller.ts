import Dialog from 'sap/m/Dialog';
import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';
import Event from 'sap/ui/base/Event';
import StandardListItem from 'sap/m/StandardListItem';
import { entityFromSource } from '../utils/Event';
import { AddElementDialogItem } from '../formbuilder/State.AddElementDialog';

export default class FormBuilderAddElementDialogController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);

    formBuilderState.watch(
      (s) => s.isAddElementDialogOpen,
      ({ isAddElementDialogOpen }) => {
        const dialog = this.byId('addElementDialog') as Dialog;

        if (isAddElementDialogOpen) {
          dialog.open();
        }
      },
    );
  }

  onDialogSearch(e: Event) {
    const value = e.getParameter('value');
    formBuilderState.set({ addElementDialogItemsFilter: value });
  }

  onDialogCancel() {
    formBuilderState.get().closeAddElementDialog();
  }

  onDialogConfirm(e: Event) {
    const selection = e.getParameter('selectedItem') as StandardListItem;
    const entity = entityFromSource<AddElementDialogItem>(selection, 'state');
    formBuilderState.get().closeAddElementDialog(entity);
  }
}
