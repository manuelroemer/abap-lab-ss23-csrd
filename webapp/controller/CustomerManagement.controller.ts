import Dialog from 'sap/m/Dialog';
import BaseController from './BaseController';
import { createState } from '../utils/State';
import {
  CustomerEntity,
  createCustomerEntity,
  deleteCustomerEntity,
  updateCustomerEntity,
} from '../api/CustomerEntity';
import Event from 'sap/ui/base/Event';
import { entityFromEvent } from '../utils/Event';
import {
  FormSchemaResultEntity,
  deleteFormSchemaResultEntity,
  getAllFormSchemaResultEntities,
} from '../api/FormSchemaResultEntity';
import Filter from 'sap/ui/model/Filter';
import MessageToast from 'sap/m/MessageToast';
import MessageBox from 'sap/m/MessageBox';
import { RouterState, connectRouterState } from '../utils/StateRouter';

interface CustomerManagementState extends RouterState<{ customerId: string }> {
  customerDialogTitle: string;
  customerName: string;
  customerCode: string;
  submitCustomer(): Promise<unknown>;
  customerFormSchemaResults: Array<FormSchemaResultEntity>;
}

export default class CustomerManagementController extends BaseController {
  state = createState<CustomerManagementState>(() => ({
    parameters: {},
    query: {},
    customerDialogTitle: '',
    customerName: '',
    customerCode: '',
    submitCustomer: () => Promise.resolve(),
    customerFormSchemaResults: [],
  }));

  onInit() {
    this.connectState(this.state);
    connectRouterState(this.state, this.router);
  }

  onCustomerAddPress() {
    this.state.set({
      customerDialogTitle: 'New Customer',
      customerName: '',
      customerCode: '',
      submitCustomer: () =>
        createCustomerEntity({
          Name: this.state.get().customerName,
          CustomerCode: this.state.get().customerCode,
        }),
    });
    const dialog = this.byId('customerDialog') as Dialog;
    dialog.open();
  }

  onCustomerEditPress(e: Event) {
    const customer = entityFromEvent<CustomerEntity>(e, 'svc');
    this.state.set({
      customerDialogTitle: 'Edit Customer',
      customerName: customer?.Name,
      customerCode: customer?.CustomerCode,
      submitCustomer: () =>
        updateCustomerEntity(customer?.Id ?? '', {
          Name: this.state.get().customerName,
          CustomerCode: this.state.get().customerCode,
        }),
    });
    const dialog = this.byId('customerDialog') as Dialog;
    dialog.open();
  }

  async onCustomerDeletePress(e: Event) {
    const customer = entityFromEvent<CustomerEntity>(e, 'svc');
    try {
      await deleteCustomerEntity(customer?.Id ?? '');
      MessageToast.show('Successfully deleted the customer.');
    } catch (e) {
      MessageBox.error('Error by deleting the customer.');
    }
  }

  async onCustomerDialogSubmit() {
    try {
      const { submitCustomer } = this.state.get();
      await submitCustomer();
      const dialog = this.byId('customerDialog') as Dialog;
      dialog.close();
      MessageToast.show('Successfully submitted the customer.');
    } catch (e) {
      MessageBox.error('Error by submitting the customer.');
    }
  }

  onCustomerDialogCancel() {
    this.state.set({
      customerDialogTitle: '',
      customerName: '',
      customerCode: '',
      submitCustomer: () => Promise.resolve(),
    });
    const dialog = this.byId('customerDialog') as Dialog;
    dialog.close();
  }

  async onCustomerPress(e: Event) {
    const customer = entityFromEvent<CustomerEntity>(e, 'svc');
    try {
      const formSchemaResults = await getAllFormSchemaResultEntities({
        filters: [new Filter({ path: 'CustomerId', operator: 'EQ', value1: customer?.Id })],
      });
      this.state.set({ customerFormSchemaResults: formSchemaResults.results });
    } catch (e) {
      MessageBox.error('Error by loading the questionnaires.');
    }
  }

  async onQuestionnaireDeletePress(e: Event) {
    const result = entityFromEvent<FormSchemaResultEntity>(e, 'state');
    try {
      await deleteFormSchemaResultEntity(result?.Id ?? '');
      MessageToast.show('Successfully deleted questionnaire.');
    } catch (e) {
      MessageBox.error('Error by deleting the questionnaire');
    }
  }
}
