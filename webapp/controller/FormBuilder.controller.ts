import BaseController from './BaseController';
import { createState } from '../utils/State';
import { FormEngineContext, createFormEngineContext } from '../formengine/FormEngineContext';
import MessageBox from 'sap/m/MessageBox';
import { RouterState, connectRouterState } from '../utils/StateRouter';
import { QueryState, createQuery } from '../utils/StateQuery';
import { FormSchemaEntity, getFormSchemaEntity } from '../api/FormSchemaEntity';

interface FormBuilderState extends RouterState<{ formSchemaId: string }>, FormEngineContext {
  schemaJson: string;
  stateJson: string;
  formSchemaQuery: QueryState<string, FormSchemaEntity>;
}

export default class FormBuilderController extends BaseController {
  state = createState<FormBuilderState>(({ state, get, set }) => ({
    parameters: {},
    query: {},
    schemaJson: '{}',
    stateJson: '{}',

    formSchemaQuery: createQuery({
      state,
      key: 'formSchemaQuery',
      getArgs: (state: FormBuilderState) => state.parameters.formSchemaId,
      fetch: (id: string) => getFormSchemaEntity(id),
      onSuccess(formSchema) {
        const { setSchema } = get();
        setSchema(JSON.parse(formSchema.SchemaJson));
        set({ schemaJson: JSON.stringify(formSchema.SchemaJson, null, 4) });
      },
    }),

    ...createFormEngineContext(state),
  }));

  public onInit() {
    this.connectState(this.state);
    connectRouterState(this.state, this.router, 'FormBuilder');
  }

  onPreviousPagePress() {
    this.state.get().goBackward();
  }

  onNextPagePress() {
    this.state.get().goForward();
  }

  onSubmitPress() {
    if (this.state.get().submit()) {
      MessageBox.success(
        'The form would have been submitted successfully. You can see the console output for details about the final form engine state.',
        { title: 'Form Submitted Successfully' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(this.state.get().state);
      console.groupEnd();
    }
  }

  async getFormSchema() {
    try {
      await this.state.get().formSchemaQuery.fetch();
    } catch (e) {
      console.error('Error while deleting a form schema result: ', e);
      MessageBox.error(this.translate('CustomerManagement_FormSchemaResultDeletionError'));
    }
  }
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
