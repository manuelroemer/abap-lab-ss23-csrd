import { FormSchema } from './Schema';

export const demoFormSchema: FormSchema = {
  pages: [
    {
      id: 'demo-page',
      title: 'Demo-Page',
      elements: [],
    },
    {
      id: 'allControls',
      title: 'All Controls',
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
      id: 'expression-test',
      title: 'Expression-Test',
      elements: [
        {
          type: 'number-input',
          id: 'num1',
          min: 0,
          max: 10,
          label: 'Pease input a number here:',
          required: false,
        },
        {
          type: 'number-input',
          id: 'num2',
          min: 0,
          max: 10,
          label: 'Pease input another number here:',
          required: false,
        },
        {
          type: 'text',
          text: 'Num1 is bigger than Num2! (>)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'gt',
                left: { type: 'value', id: 'num1' },
                right: { type: 'value', id: 'num2' },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Num1 is smaller than Num2! (<)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'lt',
                left: { type: 'value', id: 'num1' },
                right: { type: 'value', id: 'num2' },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Num1 is bigger than or equal to Num2! (>=)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'ge',
                left: { type: 'value', id: 'num1' },
                right: { type: 'value', id: 'num2' },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Num1 is smaller than or equal to Num2! (<=)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'le',
                left: { type: 'value', id: 'num1' },
                right: { type: 'value', id: 'num2' },
              },
            },
          ],
        },
        {
          type: 'boolean-choice',
          id: 'bool1',
          label: 'Choice 1',
          required: true,
        },
        {
          type: 'boolean-choice',
          id: 'bool2',
          label: 'Choice 2',
          required: true,
        },
        {
          type: 'text',
          text: 'Both booleans are true (yes)! (AND)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'and',
                left: { type: 'value', id: 'bool1' },
                right: { type: 'value', id: 'bool2' },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Either of booleans is true (yes)! (OR)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'or',
                left: { type: 'value', id: 'bool1' },
                right: { type: 'value', id: 'bool2' },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Both booleans have the same value! (EQ)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'bool1' },
                right: { type: 'value', id: 'bool2' },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'The booleans have different values! (NE)',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'ne',
                left: { type: 'value', id: 'bool1' },
                right: { type: 'value', id: 'bool2' },
              },
            },
          ],
        },
      ],
    },
  ],
};
