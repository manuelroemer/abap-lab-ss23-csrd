import FilterOperator from 'sap/ui/model/FilterOperator';
import BaseController from './BaseController';
import Dialog from 'sap/m/SelectDialog';
import Filter from 'sap/ui/model/Filter';

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
}
