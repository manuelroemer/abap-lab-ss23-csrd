import BaseController from './BaseController';
import MessageBox from 'sap/m/MessageBox';
import { QueryState, createQuery } from '../utils/StateQuery';
import { CustomerEntity, getCustomerEntity } from '../api/CustomerEntity';
import {
  FormSchemaResultEntity,
  createFormSchemaResultEntity,
  getFormSchemaResultEntity,
  updateFormSchemaResultEntity,
} from '../api/FormSchemaResultEntity';
import { createState } from '../utils/State';
import { RouterState, connectRouterState } from '../utils/StateRouter';
import { FormEngineContext, createFormEngineContext } from '../formengine/FormEngineContext';
import { FormSchemaEntity, getFormSchemaEntity } from '../api/FormSchemaEntity';
import { AsyncState, createAsync } from '../utils/StateAsync';
import MessageToast from 'sap/m/MessageToast';

interface QuestionnaireState
  extends RouterState<{ customerId: string; formSchemaType: string }, { formSchemaResultId: string }>,
    FormEngineContext {
  customerQuery: QueryState<string, CustomerEntity>;
  formSchemaResultQuery: QueryState<string, FormSchemaResultEntity>;
  formSchemaQuery: QueryState<string, FormSchemaEntity>;
  submitMutation: AsyncState<void, FormSchemaResultEntity>;
}

export default class QuestionnaireController extends BaseController {
  state = createState<QuestionnaireState>(
    ({ state, get }) => ({
      parameters: {},
      query: {},

      customerQuery: createQuery({
        state,
        key: 'customerQuery',
        getArgs: (state: QuestionnaireState) => state.parameters.customerId,
        fetch: (id: string) => getCustomerEntity(id),
      }),

      formSchemaResultQuery: createQuery({
        state,
        key: 'formSchemaResultQuery',
        getArgs: (state: QuestionnaireState) =>
          state.query.formSchemaResultId ? state.query.formSchemaResultId : null,
        fetch: (id: string) => getFormSchemaResultEntity(id),
        onSuccess(formSchemaResult) {
          const { setState } = get();
          setState(JSON.parse(formSchemaResult.ResultJson));
        },
      }),

      formSchemaQuery: createQuery({
        state,
        key: 'formSchemaQuery',
        getArgs: (state: QuestionnaireState) =>
          state.formSchemaResultQuery.data?.FormSchemaId ?? state.parameters.formSchemaType,
        fetch: (id: string) => getFormSchemaEntity(id),
        onSuccess(formSchema) {
          const { setSchema } = get();
          setSchema(JSON.parse(formSchema.SchemaJson));
        },
      }),

      submitMutation: createAsync({
        state,
        key: 'submitMutation',
        fetch() {
          const {
            parameters: { customerId },
            query: { formSchemaResultId },
            formSchemaQuery,
            state,
          } = get();

          if (formSchemaResultId) {
            return updateFormSchemaResultEntity(formSchemaResultId, {
              FormSchemaId: formSchemaQuery.data!.Id,
              MetadataJson: '{}',
              ResultJson: JSON.stringify(state),
            });
          } else {
            return createFormSchemaResultEntity({
              CustomerId: customerId!,
              FormSchemaId: formSchemaQuery.data!.Id,
              MetadataJson: '{}',
              ResultJson: JSON.stringify(state),
            });
          }
        },
      }),

      ...createFormEngineContext(state),
    }),
    { name: 'Questionnaire' },
  );

  public onInit() {
    this.connectState(this.state);
    connectRouterState(this.state, this.router, 'Questionnaire');
  }

  onPreviousPress() {
    this.state.get().goBackward();
  }

  onNextPress() {
    this.state.get().goForward();
  }

  async onSubmitPress() {
    const {
      submit,
      submitMutation,
      parameters: { customerId },
    } = this.state.get();

    if (submit()) {
      try {
        await submitMutation.fetch();
        MessageToast.show('Your questionnaire was successfully saved!');
        this.router.navTo('CustomerManagement', { customerId });
      } catch {
        MessageBox.error('Your questionnaire could not be saved!', {
          title: 'Questionnaire Not Saved',
        });
      }
    }
  }
}
