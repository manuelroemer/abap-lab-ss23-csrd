import Filter from 'sap/ui/model/Filter';
import {
  CustomerEntity,
  getCustomerEntity,
  updateCustomerEntity,
  createCustomerEntity,
  deleteCustomerEntity,
} from '../api/CustomerEntity';
import { getAllFormSchemaEntities, getFormSchemaEntity } from '../api/FormSchemaEntity';
import {
  FormSchemaResultEntity,
  getAllFormSchemaResultEntities,
  deleteFormSchemaResultEntity,
  createFormSchemaResultEntity,
} from '../api/FormSchemaResultEntity';
import { createState } from '../utils/State';
import { AsyncState, createAsync } from '../utils/StateAsync';
import { QueryState, createQuery } from '../utils/StateQuery';
import { RouterState } from '../utils/StateRouter';

export interface CustomerManagementState extends RouterState<{ customerId: string }> {
  customerDialogOpen: boolean;
  customerDialogTitle: string;
  editCustomerId?: string;
  customerName: string;
  customerCode: string;
  notes: string;

  customerQuery: QueryState<string, CustomerEntity>;
  customerFormSchemaResultsQuery: QueryState<string, Array<FormSchemaResultEntity>>;

  submitCustomerMutation: AsyncState;
  deleteCustomerMutation: AsyncState<string>;

  deleteFormSchemaResultMutation: AsyncState<string>;
  migrateFormSchemaResultMutation: AsyncState<FormSchemaResultEntity, FormSchemaResultEntity>;

  showCreateCustomerDialog(): void;
  showEditCustomerDialog(customer: CustomerEntity): void;
  closeCustomerDialog(): void;
}

export function createCustomerManagementState() {
  return createState<CustomerManagementState>(
    ({ state, get, set }) => ({
      parameters: {},
      query: {},

      customerDialogOpen: false,
      customerDialogTitle: '',
      editCustomerId: undefined,
      customerName: '',
      customerCode: '',
      notes: '',

      customerQuery: createQuery({
        state,
        key: 'customerQuery',
        getArgs: (state: CustomerManagementState) => state.parameters.customerId,
        fetch: (customerId) => getCustomerEntity(customerId),
      }),

      customerFormSchemaResultsQuery: createQuery({
        state,
        key: 'customerFormSchemaResultsQuery',
        getArgs: (state: CustomerManagementState) => state.parameters.customerId,
        fetch: async (customerId) => {
          const formSchemas = await getAllFormSchemaEntities();
          const formSchemaResults = await getAllFormSchemaResultEntities({
            filters: [new Filter({ path: 'CustomerId', operator: 'EQ', value1: customerId })],
          });

          return formSchemaResults.results.map((formSchemaResult) => {
            const matchingFormSchema = formSchemas.results.find(
              (schema) => schema.Id === formSchemaResult.FormSchemaId,
            )!;
            const maxFormSchemaVersion = formSchemas.results
              .filter((schema) => schema.Type === matchingFormSchema.Type)
              .map((schema) => schema.Version)
              .sort((a, b) => b - a)[0];

            return {
              ...formSchemaResult,
              Name: matchingFormSchema.Name,
              Version: matchingFormSchema.Version,
              CanMigrate: matchingFormSchema.Version < maxFormSchemaVersion,
            };
          });
        },
      }),

      submitCustomerMutation: createAsync({
        state,
        key: 'submitCustomerMutation',
        fetch: async () => {
          const { editCustomerId, customerName, customerCode, notes, closeCustomerDialog } = get();
          const body = {
            Name: customerName,
            CustomerCode: customerCode,
            Notes: notes,
          };

          await (editCustomerId ? updateCustomerEntity(editCustomerId, body) : createCustomerEntity(body));
          closeCustomerDialog();
        },
      }),

      deleteCustomerMutation: createAsync({
        state,
        key: 'deleteCustomerMutation',
        fetch: (id) => deleteCustomerEntity(id),
      }),

      deleteFormSchemaResultMutation: createAsync({
        state,
        key: 'deleteFormSchemaResultMutation',
        fetch: (id) => deleteFormSchemaResultEntity(id),
        onSuccess() {
          get().customerFormSchemaResultsQuery.fetch();
        },
      }),

      migrateFormSchemaResultMutation: createAsync({
        state,
        key: 'migrateFormSchemaResultMutation',
        fetch: async (formSchemaResult) => {
          const formSchema = await getFormSchemaEntity(formSchemaResult.FormSchemaId);
          const matchingFormSchema = await getAllFormSchemaEntities({
            filters: [new Filter({ path: 'Type', operator: 'EQ', value1: formSchema.Type })],
          });
          const maxFormSchemaVersionId = matchingFormSchema.results.sort((a, b) => b.Version - a.Version)[0].Id;
          return await createFormSchemaResultEntity({
            CustomerId: formSchemaResult.CustomerId,
            FormSchemaId: maxFormSchemaVersionId,
            ResultJson: formSchemaResult.ResultJson,
            MetadataJson: formSchemaResult.MetadataJson,
            IsDraft: true,
          });
        },
        onSuccess() {
          get().customerFormSchemaResultsQuery.fetch();
        },
      }),

      showEditCustomerDialog(customer) {
        set({
          customerDialogOpen: true,
          customerDialogTitle: 'Edit Customer',
          editCustomerId: customer.Id,
          customerName: customer.Name,
          customerCode: customer.CustomerCode,
          notes: customer.Notes,
        });
      },

      showCreateCustomerDialog() {
        set({
          customerDialogOpen: true,
          customerDialogTitle: 'New Customer',
          editCustomerId: undefined,
          customerName: '',
          customerCode: '',
          notes: '',
        });
      },

      closeCustomerDialog() {
        set({ customerDialogOpen: false });
      },
    }),
    { name: 'CustomerManagement' },
  );
}
