import { FormSchema } from './Schema';

export const demoFormSchema: FormSchema = {
  pages: [
    {
      id: 'csrdrelevant',
      title: 'CSRD-Relevance',
      elements: [
        {
          type: 'heading',
          text: 'Is the CRSD relevant for your company? ',
        },
        {
          type: 'text-input',
          id: 'numEmployees',
          placeholder: 'Employees',
          label: 'Please enter the number of employees in your company:',
          required: false,
        },
        {
          type: 'text-input',
          id: 'netSales',
          placeholder: 'Net sales in million euros',
          label: 'Please enter your net sales (in million euros):',
          required: false,
        },
        {
          type: 'text-input',
          id: 'totalBalancesheet',
          placeholder: 'Balance sheet total in million euros',
          label: 'Please enter your balance sheet total (in million euros):',
          required: false,
        },
        {
          type: 'text',
          text: 'Your company fullfills at least two out of the three requirements and has to submit the CSRD!',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'or',
                left: { 
                  type: 'and', 
                  left: {
                    type: 'gt',
                    left: { type: 'value', id: 'numEmployees' },
                    right: 250,
                  }, 
                  right: {
                    type: 'or', 
                    left: {
                      type: 'gt',
                      left: { type: 'value', id: 'netSales' },
                      right: 40,
                    }, 
                    right: {
                      type: 'gt',
                      left: { type: 'value', id: 'totalBalancesheet' },
                      right: 20,
                    }, 
                  },
                },
                right: {
                  type: 'and',
                  left: {
                    type: 'gt',
                    left: { type: 'value', id: 'netSales' },
                    right: 40,
                  }, 
                  right: {
                    type: 'gt',
                    left: { type: 'value', id: 'totalBalancesheet' },
                    right: 20,
                  }, 
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: 'consumption-check',
      title: 'Consumption-Check',
      elements: [
        {
          type: 'heading',
          text: 'Energy consumption',
        },
        {
          type: 'text',
          text: 'Which sources of energy does your company use?',
        },
        {
          type: 'multi-choice',
          id: 'Multi-Choice1',
          options: [
            { value: 'coal', display: 'coal and coal products' },
            { value: 'petroleum', display: 'crude oil and petroleum products' },
            { value: 'gas', display: 'natural gas' },
            { value: 'other-non-renewable', display: 'other non-renewable sources' },
            { value: 'nuclear', display: 'nuclear products' },
            {
              value: 'purchased-non-renew',
              display: 'purchased or acquired electricity, heat, steam, and cooling from non-renewable sources',
            },
          ],
          label: 'Non-renewable Sources',
          required: false,
        },
        {
          type: 'multi-choice',
          id: 'Multi-Choice2',
          options: [
            { value: 'renew-fuel', display: 'renewable fuel sources' },
            {
              value: 'purchased-renew',
              display:
                'consumption of purchased or acquired electricity, heat, steam, and cooling from renewable sources',
            },
            { value: 'self-generated', display: 'self-generated non-fuel renewable energy' },
          ],
          label: 'Renewable Sources',
          required: false,
        },
      ],
    },
    {
      id: 'consumption-values',
      title: 'Consumption-Values',
      elements: [
        {
          type: 'heading',
          text: 'Energy consumption',
        },
        {
          type: 'text-input',
          id: 'TotalEnergyConsumption',
          placeholder: 'Total energy consumption in MWH',
          label: 'Total energy consumption in MWH:',
          description: 'What is the total energy consumption of your company?',
          required: false,
        },
        {
          type: 'text-input',
          id: 'coal-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from coal and coal products',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice1.coal' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'petroleum-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from crude oil and petroleum products',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice1.petroleum' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'gas-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from natural gas',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice1.gas' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'other-non-renewable-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from other non-renewable sources',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice1.other-non-renewable' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'nuclear-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from nuclear products',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice1.nuclear' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'purchased-non-renew-amount',
          placeholder: 'energy consumption in MWH',
          label:
            'Energy consumption from purchased or acquired electricity, heat, steam, and cooling from non-renewable sources',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice1.purchased-non-renew' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'renew-fuel-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from renewable fuel sources',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice2.renew-fuel' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'purchased-renew-amount',
          placeholder: 'energy consumption in MWH',
          label:
            'Energy consumption of purchased or acquired electricity, heat, steam, and cooling from renewable sources',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice2.purchased-renew' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'self-generated-amount',
          placeholder: 'energy consumption in MWH',
          label: 'Energy consumption from self-generated non-fuel renewable energy',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'Multi-Choice2.self-generated' },
                right: true,
              },
            },
          ],
        },
      ],
    },

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
