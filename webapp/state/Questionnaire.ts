import { CustomerEntity, getCustomerEntity } from '../api/CustomerEntity';
import { FormSchemaEntity, getFormSchemaEntity } from '../api/FormSchemaEntity';
import {
  FormSchemaResultEntity,
  getFormSchemaResultEntity,
  updateFormSchemaResultEntity,
  createFormSchemaResultEntity,
} from '../api/FormSchemaResultEntity';
import { FormEngineContext, FormEngineState, createFormEngineContext } from '../formengine/FormEngineContext';
import { evaluateRules } from '../formengine/Rules';
import { FormSchema } from '../formengine/Schema';
import { getValidationErrorsForPage } from '../formengine/Validation';
import { createState } from '../utils/State';
import { AsyncState, createAsync } from '../utils/StateAsync';
import { QueryState, createQuery } from '../utils/StateQuery';
import { RouterState } from '../utils/StateRouter';

export interface QuestionnaireState
  extends RouterState<{ customerId: string; formSchemaType: string }, { formSchemaResultId: string }>,
    FormEngineContext {
  customerQuery: QueryState<string, CustomerEntity>;
  formSchemaResultQuery: QueryState<string, FormSchemaResultEntity>;
  formSchemaQuery: QueryState<string, FormSchemaEntity>;
  submitMutation: AsyncState<void, FormSchemaResultEntity>;
  saveMutation: AsyncState<void, FormSchemaResultEntity>;
}

export function createQuestionnaireState() {
  return createState<QuestionnaireState>(
    ({ state, get }) => {
      const saveFormSchemaResult = (isDraft: boolean) => {
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
            IsDraft: isDraft,
          });
        } else {
          return createFormSchemaResultEntity({
            CustomerId: customerId!,
            FormSchemaId: formSchemaQuery.data!.Id,
            MetadataJson: '{}',
            ResultJson: JSON.stringify(state),
            IsDraft: isDraft,
          });
        }
      };

      const goToLastPage = () => {
        const { schema, state, setPage } = get();
        const lastPage = findLastPageWithoutErrors(schema, state);
        console.log(lastPage);
        setPage(lastPage);
      };

      return {
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
            goToLastPage();
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
            goToLastPage();
          },
        }),

        submitMutation: createAsync({
          state,
          key: 'submitMutation',
          fetch: () => saveFormSchemaResult(false),
        }),

        saveMutation: createAsync({
          state,
          key: 'saveMutation',
          fetch: () => saveFormSchemaResult(true),
        }),

        ...createFormEngineContext(state),
      };
    },
    { name: 'Questionnaire' },
  );
}

function findLastPageWithoutErrors(schema: FormSchema, state: FormEngineState): number {
  let lastPageWithoutErrors = 0;

  for (let pageIndex = 0; pageIndex < schema.pages.length; pageIndex++) {
    const page = schema.pages[pageIndex];
    const isHidden = evaluateRules(page, state).hide;
    const hasErrors = getValidationErrorsForPage(page, pageIndex, state).length > 0;

    if (!isHidden) {
      lastPageWithoutErrors = pageIndex;
    }

    if (!isHidden && hasErrors) {
      break;
    }
  }

  return lastPageWithoutErrors;
}
