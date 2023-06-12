import BaseController from './BaseController';
import { createState } from '../utils/State';
import { FormSchema } from '../formengine/Schema';
import { createFormEngineContext } from '../formengine/FormEngineContext';

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
          validationRules: [
            {
              message: 'You must write "Hello world!".',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'message' },
                right: 'Hello world!',
              },
            },
          ],
        },
        {
          type: 'boolean-choice',
          id: 'Boolean-Choice',
          label: 'BooleanChoice',
          required: true,
        },
        {
          type: 'single-choice',
          id: 'Single-Choice',
          options: [
            { value: 'test1', display: 'Test1' },
            { value: 'test2', display: 'Test2' },
          ],
          columns: 2,
          label: 'SingleChoice',
          required: true,
        },
        {
          type: 'single-choice-select',
          id: 'Single-Choice-Select',
          options: [
            { value: 'test12435', display: 'Test12435' },
            { value: 'test23534', display: 'Test23534' },
          ],
          label: 'SingleChoiceSelect',
          required: true,
        },

        {
          type: 'multi-choice',
          id: 'Multi-Choice',
          options: [
            { value: 'test123', display: 'Test123' },
            { value: 'test234', display: 'Test234' },
          ],
          label: 'MultiChoice',
          required: true,
        },
        {
          type: 'date-time',
          id: 'Date-Time',
          label: 'DateTime',
          required: true,
        },
        {
          type: 'number-input',
          id: 'Number-Input',
          min: 0,
          max: 10,
          stepperDescription: 'EUR',
          label: 'NumberInput',
          required: true,
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
  schemaJson: string;
  stateJson: string;
}

export default class FormBuilderController extends BaseController {
  formEngineState = createFormEngineContext(defaultFormSchema);

  state = createState<FormBuilderState>(() => ({
    schemaJson: JSON.stringify(defaultFormSchema, null, 4),
    stateJson: '{}',
  }));

  public onInit() {
    this.connectState(this.state);
    this.connectState(this.formEngineState, 'formEngine');

    this.state.watch(
      (s) => s.schemaJson,
      ({ schemaJson }) => {
        const schema = tryParseJson(schemaJson);
        schema && this.formEngineState.get().setSchema(schema);
      },
    );

    this.state.watch(
      (s) => s.stateJson,
      ({ stateJson }) => {
        console.log('JSON change: ', stateJson.substring(0, 10));
        const state = tryParseJson(stateJson);
        state && this.formEngineState.get().setState(state);
      },
    );

    this.formEngineState.watch(
      (s) => s.state,
      ({ state }) => {
        console.log('Engine state change: ', state);
        this.state.set({ stateJson: JSON.stringify(state, null, 4) });
      },
    );
  }

  onPreviousPagePress() {
    this.formEngineState.get().goBackward();
  }

  onNextPagePress() {
    this.formEngineState.get().goForward();
  }
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
