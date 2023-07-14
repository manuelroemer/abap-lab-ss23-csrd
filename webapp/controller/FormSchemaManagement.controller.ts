import Dialog from 'sap/m/SelectDialog';
import BaseController from './BaseController';
import { FormSchemaEntity, getFormSchemaEntity } from '../api/FormSchemaEntity';
import { entityFromEvent } from '../utils/Event';
import MessageBox from 'sap/m/MessageBox';
import MessageToast from 'sap/m/MessageToast';
import { showConfirmation } from '../utils/Confirmation';
import { createFormSchemaManagementState } from '../state/FormSchemaManagement';
import Popover from 'sap/m/Popover';

export default class FormSchemaManagementController extends BaseController {
  state = createFormSchemaManagementState();

  onInit() {
    this.connectState(this.state);
  }

  onSelectDialogPress() {
    const dialog = this.byId('formSchemaSelectDialog') as Dialog;
    dialog.open('');
  }

  async onSelectDialogClose(e) {
    const context = e.getParameter('selectedContexts');
    const formSchemaId = context[0].getObject().Id;

    const toDuplicateSchema = await getFormSchemaEntity(formSchemaId);
    try {
      const formSchema = await this.state.get().createFormSchemaMutation.fetch(toDuplicateSchema);
      this.navToFormBuilder(formSchema?.Id);
    } catch (e) {
      console.error('Error while creating a form schema: ', e);
      MessageBox.error('An unexpected error occured while creating the questionnaire.');
    }
  }

  onDialogClose(e) {
    e.getSource().getBinding('items').filter([]);
  }

  async onDuplicatePress(e) {
    const formSchema = entityFromEvent<FormSchemaEntity>(e, 'svc')!;
    const toDuplicateSchema = await getFormSchemaEntity(formSchema.Id);

    try {
      const formSchema = await this.state.get().createFormSchemaMutation.fetch(toDuplicateSchema);
      this.navToFormBuilder(formSchema?.Id);
    } catch (e) {
      console.error('Error while duplicating a form schema: ', e, toDuplicateSchema);
      MessageBox.error('An unexpected error occured while duplicating the questionnaire.');
    }
  }

  async onCreateFormSchemaPress() {
    try {
      const formSchema = (await this.state.get().createFormSchemaMutation.fetch(undefined)) as any;
      this.navToFormBuilder(formSchema?.Id);
    } catch (e) {
      console.error('Error while creating a form schema: ', e);
      MessageBox.error('An unexpected error occured while creating the questionnaire.');
    }
  }

  async onFormSchemaPress(e) {
    const formSchema = entityFromEvent<FormSchemaEntity>(e, 'svc')!;
    if (!formSchema.IsDraft) {
      if (
        await showConfirmation({
          title: 'Undrafted Questionnaire',
          text: 'Undrafted questionnaire schemas cannot be edited. Only the title and description can be changed.\nIf you want to change the actual schema, please duplicate the questionnaire before making any changes to it.\nDo you want to continue editing this undrafted questionnaire?',
        })
      ) {
        this.navToFormBuilder(formSchema.Id);
      }
    } else {
      this.navToFormBuilder(formSchema.Id);
    }
  }

  async onFormSchemaDeletePress(e: Event) {
    const formSchema = entityFromEvent<FormSchemaEntity>(e, 'svc')!;

    if (
      await showConfirmation({
        title: 'Delete Questionnaire',
        text: 'Are you sure that you want to delete this questionnaire?',
      })
    ) {
      try {
        await this.state.get().deleteFormSchemaMutation.fetch(formSchema.Id);
        MessageToast.show('Successfully deleted the questionnaire.');
      } catch (e) {
        console.error('Error while deleting a form schema: ', e);
        MessageBox.error('An unexpected error occured while deleting the questionnaire.');
      }
    }
  }

  handleInformationPopoverPress(e) {
    const button = e.getSource();
    const popover = this.byId('informationDraftPopover') as Popover;
    popover.openBy(button);
  }

  navToFormBuilder(formSchemaId: string) {
    this.router.navTo('FormBuilder', { formSchemaId });
  }
}
