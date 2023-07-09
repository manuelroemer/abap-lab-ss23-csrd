import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';
import MessageBox from 'sap/m/MessageBox';
import { connectRouterState } from '../utils/StateRouter';
import { showConfirmation } from '../utils/Confirmation';
import MessageToast from 'sap/m/MessageToast';

export default class FormBuilderController extends BaseController {
  public onInit() {
    this.connectState(formBuilderState);
    connectRouterState(formBuilderState, this.router, 'FormBuilder');
  }

  async getFormSchema() {
    try {
      await formBuilderState.get().formSchemaQuery.fetch();
    } catch (e) {
      console.error('Error while fetching a form schema result: ', e);
      MessageBox.error('An unexpected error occured while fetching a questionnaire.');
    }
  }

  async onSaveAndUndraft() {
    if (
      await showConfirmation({
        title: 'Save and undraft Questionnaire',
        text: 'Warning: This action will save and undraft your questionnaire. An undrafted questionnaire can no longer be edited and can be seen and filled by any user. Are you sure that you want to undraft the questionnaire?',
      })
    ) {
      this.updateFormSchema(false);
    }
  }

  onSave() {
    this.updateFormSchema(true);
  }

  async updateFormSchema(isDraft: boolean) {
    try {
      await formBuilderState.get().updateFormSchemaMutation.fetch(isDraft);
      MessageToast.show('Successfully saved the questionnaire.');
    } catch (e) {
      console.error('Error while saving the form schema: ', e);
      MessageBox.error('An unexpected error occured while saving the questionnaire.');
    }
  }
}
