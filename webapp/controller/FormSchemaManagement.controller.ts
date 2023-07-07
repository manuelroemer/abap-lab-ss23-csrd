import Dialog from 'sap/m/SelectDialog';
import BaseController from './BaseController';
import {
  FormSchemaEntity,
  createFormSchemaEntity,
  deleteFormSchemaEntity,
  getFormSchemaEntity,
} from '../api/FormSchemaEntity';
import { entityFromEvent } from '../utils/Event';
import MessageBox from 'sap/m/MessageBox';
import MessageToast from 'sap/m/MessageToast';
import { showConfirmation } from '../utils/Confirmation';
import { createState } from '../utils/State';
import { AsyncState, createAsync } from '../utils/StateAsync';

interface FormSchemaManagementState {
  deleteFormSchemaMutation: AsyncState<string>;
  createFormSchemaMutation: AsyncState<FormSchemaEntity | undefined, FormSchemaEntity>;
}

export default class FormSchemaManagementController extends BaseController {
  state = createState<FormSchemaManagementState>(({ state }) => ({
    parameters: {},
    query: {},

    deleteFormSchemaMutation: createAsync({
      state,
      key: 'deleteFormSchemaMutation',
      fetch: async (id) => deleteFormSchemaEntity(id),
    }),

    createFormSchemaMutation: createAsync({
      state,
      key: 'createFormSchemaMutation',
      fetch: (formSchemaTemplate) =>
        createFormSchemaEntity({
          Type: formSchemaTemplate?.Type ?? 'demo',
          SchemaJson: formSchemaTemplate?.SchemaJson ?? '{}',
          MetadataJson: formSchemaTemplate?.MetadataJson ?? '{}',
          IsDraft: true,
          Name: formSchemaTemplate?.Name ?? '',
          Description: formSchemaTemplate?.Name ?? '',
        }),
    }),
  }));

  onInit() {
    this.connectState(this.state);
  }

  onSelectDialogPress() {
    const dialog = this.byId('formSchemaSelectDialog') as Dialog;
    dialog.open('');
  }

  async onSelectDialogClose(e) {
    const context = e.getParameter('selectedContexts');
    const formSchemaId = context[0].getObject().Id;

    const toDuplicateSchema = await getFormSchemaEntity(formSchemaId);
    try {
      const formSchema = await this.state.get().createFormSchemaMutation.fetch(toDuplicateSchema);
      this.navToFormBuilder(formSchema?.Id);
    } catch (e) {
      console.error('Error while creating a form schema: ', e);
      MessageBox.error(this.translate('FormSchemaManagement_FormSchemaCreationError'));
    }
  }

  onDialogClose(e) {
    e.getSource().getBinding('items').filter([]);
  }

  async onDuplicatePress(e) {
    const formSchema = entityFromEvent<FormSchemaEntity>(e, 'svc')!;
    const toDuplicateSchema = await getFormSchemaEntity(formSchema.Id);

    try {
      const formSchema = await this.state.get().createFormSchemaMutation.fetch(toDuplicateSchema);
      this.navToFormBuilder(formSchema?.Id);
    } catch (e) {
      console.error('Error while creating a form schema: ', e);
      MessageBox.error(this.translate('FormSchemaManagement_FormSchemaCreationError'));
    }
  }

  async onCreateFormSchemaPress() {
    try {
      const formSchema = (await this.state.get().createFormSchemaMutation.fetch(undefined)) as any;
      this.navToFormBuilder(formSchema?.Id);
    } catch (e) {
      console.error('Error while creating a form schema: ', e);
      MessageBox.error(this.translate('FormSchemaManagement_FormSchemaCreationError'));
    }
  }

  async onFormSchemaPress(e) {
    const formSchema = entityFromEvent<FormSchemaEntity>(e, 'svc')!;
    this.navToFormBuilder(formSchema.Id);
  }

  async onFormSchemaDeletePress(e: Event) {
    const formSchema = entityFromEvent<FormSchemaEntity>(e, 'svc')!;

    if (
      await showConfirmation({
        title: this.translate('FormSchemaManagement_FormSchemaDeletionTitle'),
        text: this.translate('FormSchemaManagement_ConfirmFormSchemaDeletion'),
      })
    ) {
      try {
        await this.state.get().deleteFormSchemaMutation.fetch(formSchema.Id);
        MessageToast.show(this.translate('FormSchemaManagement_FormSchemaDeletionSuccess'));
      } catch (e) {
        console.error('Error while deleting a form schema: ', e);
        MessageBox.error(this.translate('FormSchemaManagement_FormSchemaDeletionError'));
      }
    }
  }

  navToFormBuilder(formSchemaId: string) {
    this.router.navTo('FormBuilder', { formSchemaId });
  }
}
