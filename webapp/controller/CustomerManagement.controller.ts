import Dialog from 'sap/m/Dialog';
import BaseController from './BaseController';
import { createState } from '../utils/State';
import { CustomerEntity, createCustomerEntity, updateCustomerEntity } from '../api/CustomerEntity';
import Event from 'sap/ui/base/Event';
import { entityFromEvent } from '../utils/Event';

interface CustomerManagementState {
  customerDialogTitle: string;
  customerName: string;
  customerCode: string;
  submitCustomer(): Promise<unknown>;
}

export default class CustomerManagementController extends BaseController {
  state = createState<CustomerManagementState>(() => ({
    customerDialogTitle: '',
    customerName: '',
    customerCode: '',
    submitCustomer: () => Promise.resolve(),
  }));

  onInit() {
    this.connectState(this.state);
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

  async onCustomerDialogSubmit() {
    try {
      const { submitCustomer } = this.state.get();
      await submitCustomer();
      const dialog = this.byId('customerDialog') as Dialog;
      dialog.close();
    } catch (e) {
      console.error('Error by creating a customer: ', e);
    }
  }

  // onAddCustomerDialogCancel() {
  //   this.byId('bookEditDialogReservationId').setValue('');
  //   this.byId('bookEditDialog').close();
  // }
}
