import Dialog from 'sap/m/Dialog';
import BaseController from './BaseController';
import { createState } from '../utils/State';
import {
  CustomerEntity,
  createCustomerEntity,
  deleteCustomerEntity,
  getCustomerEntity,
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
import { QueryState, createQuery } from '../utils/StateQuery';
import { AsyncState, createAsync } from '../utils/StateAsync';
import { showConfirmation } from '../utils/Confirmation';

interface CustomerManagementState extends RouterState<{ customerId: string }> {
  customerDialogOpen: boolean;
  customerDialogTitle: string;
  editCustomerId?: string;
  customerName: string;
  customerCode: string;

  customerQuery: QueryState<string, CustomerEntity>;
  customerFormSchemasQuery: QueryState<string, Array<FormSchemaResultEntity>>;

  submitCustomerMutation: AsyncState;
  deleteCustomerMutation: AsyncState<string>;

  deleteFormSchemaResultMutation: AsyncState<string>;

  showCreateCustomerDialog(): void;
  showEditCustomerDialog(customer: CustomerEntity): void;
  closeCustomerDialog(): void;
}

export default class CustomerManagementController extends BaseController {
  state = createState<CustomerManagementState>(
    ({ state, get, set }) => ({
      parameters: {},
      query: {},

      customerDialogOpen: false,
      customerDialogTitle: '',
      editCustomerId: undefined,
      customerName: '',
      customerCode: '',

      customerQuery: createQuery({
        state,
        key: 'customerQuery',
        getArgs: (state: CustomerManagementState) => state.parameters.customerId,
        fetch: (customerId) => getCustomerEntity(customerId),
      }),

      customerFormSchemasQuery: createQuery({
        state,
        key: 'customerFormSchemasQuery',
        getArgs: (state: CustomerManagementState) => state.parameters.customerId,
        fetch: (customerId) =>
          getAllFormSchemaResultEntities({
            filters: [new Filter({ path: 'CustomerId', operator: 'EQ', value1: customerId })],
          }).then(({ results }) => results),
      }),

      submitCustomerMutation: createAsync({
        state,
        key: 'submitCustomerMutation',
        fetch: async () => {
          const { editCustomerId, customerName, customerCode, closeCustomerDialog } = get();
          const body = {
            Name: customerName,
            CustomerCode: customerCode,
          };

          await (editCustomerId ? updateCustomerEntity(editCustomerId, body) : createCustomerEntity(body));
          closeCustomerDialog();
        },
      }),

      deleteCustomerMutation: createAsync({
        state,
        key: 'deleteCustomerMutation',
        fetch: async (id) => deleteCustomerEntity(id),
      }),

      deleteFormSchemaResultMutation: createAsync({
        state,
        key: 'deleteFormSchemaResultMutation',
        fetch: async (id) => deleteFormSchemaResultEntity(id),
      }),

      showEditCustomerDialog(customer) {
        set({
          customerDialogOpen: true,
          customerDialogTitle: 'Edit Customer',
          editCustomerId: customer.Id,
          customerName: customer.Name,
          customerCode: customer.CustomerCode,
        });
      },

      showCreateCustomerDialog() {
        set({
          customerDialogOpen: true,
          customerDialogTitle: 'New Customer',
          editCustomerId: undefined,
          customerName: '',
          customerCode: '',
        });
      },

      closeCustomerDialog() {
        set({ customerDialogOpen: false });
      },
    }),
    { name: 'CustomerManagement' },
  );

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
      formSchemaType: 'demo',
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
        title: this.translate('CustomerManagement_CustomerDeletionTitle'),
        text: this.translate('CustomerManagement_ConfirmCustomerDeletion'),
      })
    ) {
      try {
        await this.state.get().deleteCustomerMutation.fetch(customer.Id);
        MessageToast.show(this.translate('CustomerManagement_CustomerDeletionSuccess'));
      } catch (e) {
        console.error('Error while deleting a customer: ', e);
        MessageBox.error(this.translate('CustomerManagement_CustomerDeletionError'));
      }
    }
  }

  async onCustomerDialogSubmit() {
    try {
      await this.state.get().submitCustomerMutation.fetch();
      MessageToast.show(this.translate('CustomerManagement_CustomerSubmitSuccess'));
    } catch (e) {
      console.error('Error while submitting a customer: ', e);
      MessageBox.error(this.translate('CustomerManagement_CustomerSubmitError'));
    }
  }

  onCustomerDialogCancel() {
    this.state.get().closeCustomerDialog();
  }

  async onQuestionnaireDeletePress(e: Event) {
    const formSchemaResult = entityFromEvent<FormSchemaResultEntity>(e, 'state')!;

    if (
      await showConfirmation({
        title: this.translate('CustomerManagement_FormSchemaResultDeletionTitle'),
        text: this.translate('CustomerManagement_ConfirmFormSchemaResultDeletion'),
      })
    ) {
      try {
        await this.state.get().deleteFormSchemaResultMutation.fetch(formSchemaResult.Id);
        MessageToast.show(this.translate('CustomerManagement_FormSchemaResultDeletionSuccess'));
      } catch (e) {
        console.error('Error while deleting a form schema result: ', e);
        MessageBox.error(this.translate('CustomerManagement_FormSchemaResultDeletionError'));
      }
    }
  }
}
