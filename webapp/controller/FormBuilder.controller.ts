import BaseController from './BaseController';
import { createState } from '../utils/State';
import { FormSchema } from 'formengine/Schema';
import { FormEngineState } from 'formengine/FormEngine';

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
          text: 'This text will only be displayed when you enter "Hello world!"!',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'message' },
                right: 'Hello world!',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'page2',
      name: 'Page 2',
      elements: [
        {
          type: 'heading',
          text: 'Hello from page 2!',
        },
      ],
    },
    {
      id: 'page3',
      name: 'Page 3',
      elements: [
        {
          type: 'heading',
          text: 'I don`t work here ... just cleaning :)',
        },
        {
          type: 'text',
          text: 'Enter what you earn:',
        },
        {
          type: 'text-input',
          id: 'yourSalary',
          placeholder: 'Your salary?',
          label: 'Message',
          required: true,
          description: 'Input fields can have a description text. How cool is that?',
        },
        {
          type: 'whiteSpace',
          present: true, 
        },
        {
          type: 'text',
          text: 'Enter what you would pay me:',
        },
        {
          type: 'text-input',
          id: 'mySalary',
          placeholder: 'My salary?',
          label: 'Message',
          required: true,
          description: 'Input fields can have a description text. How cool is that?',
        },
        {
          type: 'text',
          text: 'Now we are getting there :D',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'le',
                left: { type: 'value', id: 'yourSalary' },
                right: { type: 'value', id: 'mySalary' },
              },
            },
          ],
        },
      ],
    },
  ],
};

interface FormBuilderState {
  schema: Partial<FormSchema>;
  state: FormEngineState;
  schemaJson: string;
  stateJson: string;
  page: number;
  pageTitle: string;
}

export default class FormBuilderController extends BaseController {
  state = createState<FormBuilderState>(() => ({
    schema: defaultFormSchema,
    schemaJson: JSON.stringify(defaultFormSchema, null, 4),
    state: {},
    stateJson: '{}',
    page: 0,
    pageTitle: defaultFormSchema.pages[0].name ?? '',
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

    this.state.watch(
      (s) => s.page,
      ({ page }) => {
        const schemaPage = this.state.get().schema?.pages?.[page];
        const pageTitle = schemaPage?.name ?? schemaPage?.id ?? 'Unnamed page';
        return this.state.set({ pageTitle });
      },
    );
  }

  onPreviousPagePress() {
    this.state.set(({ page }) => ({ page: page - 1 }));
  }

  onNextPagePress() {
    this.state.set(({ page }) => ({ page: page + 1 }));
  }
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
