import { FormSchema } from './Schema';

export const csrdSchema: FormSchema = {
  pages: [
    {
      id: 'csrdrelevant',
      title: 'CSRD Relevance',
      elements: [
        {
          type: 'heading',
          text: 'Is the CRSD relevant for your company?',
        },
        {
          type: 'number-input',
          id: 'numEmployees',
          label: 'Employees',
          description: 'Please enter the number of employees in your company:',
          required: false,
        },
        {
          type: 'number-input',
          id: 'netSales',
          label: 'Net sales in million euros',
          description: 'Please enter your net sales (in million euros):',
          required: false,
        },
        {
          type: 'number-input',
          id: 'totalBalancesheet',
          label: 'Balance sheet total in million euros',
          description: 'Please enter your balance sheet total (in million euros):',
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
      title: 'Consumption Check',
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
        {
          type: 'number-input',
          id: 'TotalEnergyConsumption',
          label: 'Total energy consumption in MWH',
          description: 'What is the total energy consumption of your company?',
          required: false,
        },
        {
          type: 'number-input',
          id: 'coal-amount',
          label: 'energy consumption in MWH',
          description: 'Energy consumption from coal and coal products:',
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
          type: 'number-input',
          id: 'petroleum-amount',
          label: 'energy consumption in MWH',
          description: 'Energy consumption from crude oil and petroleum products',
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
          type: 'number-input',
          id: 'gas-amount',
          label: 'energy consumption in MWH',
          description: 'Energy consumption from natural gas',
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
          type: 'number-input',
          id: 'other-non-renewable-amount',
          label: 'energy consumption in MWH',
          description: 'Energy consumption from other non-renewable sources',
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
          type: 'number-input',
          id: 'nuclear-amount',
          label: 'Nuclear energy consumption in MWH',
          description: 'Energy consumption from nuclear products',
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
          type: 'number-input',
          id: 'purchased-non-renew-amount',
          label: 'Non-renewable energy consumption in MWH',
          description:
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
          type: 'number-input',
          id: 'renew-fuel-amount',
          label: 'Renewable fuel energy consumption in MWH',
          description: 'Energy consumption from renewable fuel sources',
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
          type: 'number-input',
          id: 'purchased-renew-amount',
          label: 'Renewable energy consumption in MWH',
          description:
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
          type: 'number-input',
          id: 'self-generated-amount',
          label: 'Self-generated energy consumption in MWH',
          description: 'Energy consumption from self-generated non-fuel renewable energy',
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
  ],
};
