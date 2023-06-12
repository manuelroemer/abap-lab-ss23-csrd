import { FormSchema } from './Schema';

export const demoFormSchema: FormSchema = {
  pages: [
    {
      id: 'page1',
      title: 'Page 1',
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
      id: 'page2',
      title: 'Page 2',
      elements: [
        {
          type: 'heading',
          text: 'Hello from page 2!',
        },
      ],
    },
    {
      id: 'page3',
      title: 'Page 3',
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
