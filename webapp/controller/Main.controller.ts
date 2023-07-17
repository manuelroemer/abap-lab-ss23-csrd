import FilterOperator from 'sap/ui/model/FilterOperator';
import BaseController from './BaseController';
import Dialog from 'sap/m/SelectDialog';
import Filter from 'sap/ui/model/Filter';
import { showConfirmation } from '../utils/Confirmation';
import { resetBackend } from '../api/Clear';
import MessageToast from 'sap/m/MessageToast';

export default class MainController extends BaseController {
  navToFormSchemaManagement() {
    this.router.navTo('FormSchemaManagement');
  }

  navToQuestionnaire() {
    this.router.navTo('Questionnaire');
  }

  navToCustomerManagement() {
    this.router.navTo('CustomerManagement');
  }

  onSelectDialogPress() {
    const dialog = this.byId('customerSelectDialog') as Dialog;
    dialog.open('');
  }

  onSearch(e) {
    const value = e.getParameter('value');
    const filter = new Filter('Name', FilterOperator.Contains, value);
    const binding = e.getParameter('itemsBinding');
    binding.filter([filter]);
  }

  onDialogClose(e) {
    const contexts = e.getParameter('selectedContexts');
    if (contexts && contexts.length) {
      const customerId = contexts[0].getObject().Id;
      this.router.navTo('Questionnaire', { formSchemaType: 'demo', customerId });
    }
    e.getSource().getBinding('items').filter([]);
  }

  async onNukeBackend() {
    if (
      await showConfirmation({
        title: 'Clear Backend',
        text: 'This action will clear ALL data stored in the backend and recreate some default entities that demonstrate how the application can be used.\nAll custom data that was created in the meantime will be completely erased.\nDoing this is perfect if you want to test the application, as it guarantees a clean state to start from. It is also recommended to use this function before doing any demonstration.\n\nAre you sure that you want to continue?',
      })
    ) {
      try {
        MessageToast.show('Clearing the backend started. Please wait until the next notification.');
        await resetBackend();
        MessageToast.show('The backend was successfully cleared. We recommend reloading the current browser tab.');
      } catch (e) {
        console.error('Unexpected error while clearing the backend: ', e);
        MessageToast.show('An error occurred while clearing the backend. Check the browser console for details.');
      }
    }
  }
}
