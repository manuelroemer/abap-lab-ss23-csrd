import Dialog from 'sap/m/Dialog';
import BaseController from './BaseController';
import { CustomerEntity } from '../api/CustomerEntity';
import Event from 'sap/ui/base/Event';
import { entityFromEvent } from '../utils/Event';
import { FormSchemaResultEntity, getFormSchemaResultEntity } from '../api/FormSchemaResultEntity';
import Filter from 'sap/ui/model/Filter';
import MessageToast from 'sap/m/MessageToast';
import MessageBox from 'sap/m/MessageBox';
import { connectRouterState } from '../utils/StateRouter';
import { showConfirmation } from '../utils/Confirmation';
import FilterOperator from 'sap/ui/model/FilterOperator';
import { createCustomerManagementState } from '../state/CustomerManagement';
import { showPopover } from '../utils/Popover';

export default class CustomerManagementController extends BaseController {
  state = createCustomerManagementState();

  onInit() {
    this.connectState(this.state);
    connectRouterState(this.state, this.router, 'CustomerManagement');

    this.state.watch(
      (state) => state.customerDialogOpen,
      (state) => {
        const dialog = this.byId('customerDialog') as Dialog;
        if (state.customerDialogOpen) {
          dialog.open();
        } else {
          dialog.close();
        }
      },
    );
  }

  onCustomerPress(e: Event) {
    const customer = entityFromEvent<CustomerEntity>(e, 'svc');
    this.router.navTo('CustomerManagement', { customerId: customer?.Id }, true);
  }

  onFormSchemaResultPress(e: Event) {
    const result = entityFromEvent<FormSchemaResultEntity>(e, 'state');
    const {
      parameters: { customerId },
    } = this.state.get();

    this.router.navTo('Questionnaire', {
      formSchemaType: 'csrd',
      customerId,
      '?query': { formSchemaResultId: result?.Id },
    });
  }

  onCustomerAddPress() {
    this.state.get().showCreateCustomerDialog();
  }

  onCustomerEditPress(e: Event) {
    const customer = entityFromEvent<CustomerEntity>(e, 'svc')!;
    this.state.get().showEditCustomerDialog(customer);
  }

  async onCustomerDeletePress(e: Event) {
    const customer = entityFromEvent<CustomerEntity>(e, 'svc')!;

    if (
      await showConfirmation({
        title: 'Delete Customer',
        text: 'Are you sure that you want to delete this customer?',
      })
    ) {
      try {
        await this.state.get().deleteCustomerMutation.fetch(customer.Id);
        this.router.navTo('CustomerManagement', { replace: true });
        MessageToast.show('Successfully deleted the customer.');
      } catch (e) {
        console.error('Error while deleting a customer: ', e);
        MessageBox.error('An unexpected error occured while deleting the customer.');
      }
    }
  }

  async onCustomerDialogSubmit() {
    try {
      await this.state.get().submitCustomerMutation.fetch();
      MessageToast.show('Successfully saved the customer data.');
    } catch (e) {
      console.error('Error while submitting a customer: ', e);
      MessageBox.error('An unexpected error occured while saving the customer data.');
    }
  }

  onCustomerDialogCancel() {
    this.state.get().closeCustomerDialog();
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
      this.router.navTo('CustomerManagement', { customerId });
      this.router.navTo('Questionnaire', { formSchemaType: 'csrd', customerId });
    }

    e.getSource().getBinding('items').filter([]);
  }

  onQuestionnaireAddPress() {
    const customerId = this.state.get().parameters.customerId;

    if (customerId) {
      this.router.navTo('Questionnaire', { formSchemaType: 'csrd', customerId });
    } else {
      const dialog = this.byId('customerSelectDialog') as Dialog;
      dialog.open();
    }
  }

  async onQuestionnaireDeletePress(e: Event) {
    const formSchemaResult = entityFromEvent<FormSchemaResultEntity>(e, 'state')!;

    if (
      await showConfirmation({
        title: 'Delete Questionnaire',
        text: 'Are you sure that you want to delete this questionnaire?',
      })
    ) {
      try {
        await this.state.get().deleteFormSchemaResultMutation.fetch(formSchemaResult.Id);
        MessageToast.show('Successfully deleted the questionnaire.');
      } catch (e) {
        console.error('Error while deleting a form schema result: ', e);
        MessageBox.error('An unexpected error occured while deleting the questionnaire.');
      }
    }
  }

  async onQuestionnaireMigratePress(e: Event) {
    const formSchemaResult = entityFromEvent<FormSchemaResultEntity>(e, 'state')!;
    const toMigrateFormSchemaResult = await getFormSchemaResultEntity(formSchemaResult.Id);
    if (
      await showConfirmation({
        title: 'Migrate Questionnaire',
        text: 'This questionnaire is outdated - a newer version exists. \nYou can migrate this questionnaire to a newer version. Be aware that this could potentially result in issues if the newer version introduced any breaking changes. \nMigrating is non-destructive, however. We will create a copy of this questionnaire without deleting the old version. \nDo you want to continue? ',
      })
    ) {
      try {
        const newDuplicatedFormSchema = await this.state
          .get()
          .migrateFormSchemaResultMutation.fetch(toMigrateFormSchemaResult);

        this.router.navTo('Questionnaire', {
          formSchemaType: 'csrd',
          customerId: newDuplicatedFormSchema.CustomerId,
          '?query': { formSchemaResultId: newDuplicatedFormSchema?.Id },
        });
      } catch (e) {
        console.error('Error while migrating the questionnaire: ', e);
        MessageBox.error('An unexpected error occured while migrating the questionnaire.');
      }
    }
  }

  handleInformationPopoverPress(e) {
    const popover = showPopover({
      title: 'Information',
      text: 'Draft: Questionnaires which are not yet finished (submitted). \nUndraft: Questionnaires which have been submitted least once.',
    });
    popover.openBy(e.getSource());
  }

  navToFormBuilder(formSchemaId: string) {
    this.router.navTo('FormBuilder', { formSchemaId });
  }
}
