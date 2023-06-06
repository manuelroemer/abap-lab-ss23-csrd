import BaseController from './BaseController';
import { createState } from '../utils/State';
import { FormSchema } from 'formengine/schema';

interface FormBuilderState {
  schema: object;
  state: object;
  schemaJson: string;
  stateJson: string;
}

const defaultFormSchema: FormSchema = {
  pages: [
    {
      id: 'page1',
      name: 'Page 1',
      elements: [
        {
          type: 'heading',
          text: 'Hello From the Form Engine!',
        },
        {
          type: 'text',
          text: 'This text is automatically generated from a JSON schema.',
        },
        {
          type: 'text-input',
          id: 'message',
          placeholder: 'Enter a message',
          label: 'Message',
          required: true,
          description: 'Input fields can have a description text. How cool is that?',
        },
        {
          type: 'text',
          text: 'This text will only be displayed when you enter "Hello"!',
          rules: [{ effect: 'hide', conditions: [{ property: 'message', op: 'neq', value: 'Hello' }] }],
        },
      ],
    },
  ],
};

export default class FormBuilderController extends BaseController {
  state = createState<FormBuilderState>(() => ({
    schema: defaultFormSchema,
    schemaJson: JSON.stringify(defaultFormSchema, null, 4),
    state: {},
    stateJson: '{}',
  }));

  public onInit() {
    this.connectState(this.state);

    this.state.watch(
      (s) => s.schemaJson,
      ({ schemaJson }) => {
        const schema = tryParseJson(schemaJson);
        schema && this.state.set({ schema });
      },
    );

    this.state.watch(
      (s) => s.stateJson,
      ({ stateJson }) => {
        const state = tryParseJson(stateJson);
        state && this.state.set({ state });
      },
    );

    this.state.watch(
      (s) => s.state,
      ({ state }) => {
        this.state.set({ stateJson: JSON.stringify(state, null, 4) });
      },
    );
  }
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
