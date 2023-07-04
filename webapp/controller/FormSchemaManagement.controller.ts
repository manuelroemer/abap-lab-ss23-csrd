import Dialog from 'sap/m/SelectDialog';
import BaseController from './BaseController';

export default class FormSchemaManagementController extends BaseController {
  navToFormBuilder() {
    this.router.navTo('FormBuilder');
  }

  onSelectDialogPress() {
    const dialog = this.byId('formSchemaSelectDialog') as Dialog;
    dialog.open('');
  }

  onDialogClose(e) {
    console.log(e.getParameter('selectedContexts'));
  }
}
