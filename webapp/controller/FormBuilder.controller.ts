import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';
import MessageBox from 'sap/m/MessageBox';
import { connectRouterState } from '../utils/StateRouter';

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
}
