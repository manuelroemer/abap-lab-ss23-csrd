import { FormSchema } from './Schema';

export const csrdSchema: FormSchema = {
  pages: [
    {
      id: 'E1-5',
      title: 'E1-5',
      elements: [
        {
          type: 'heading',
          text: 'E1-5 – Energy consumption and mix',
        },
        {
          type: 'text',
          text: 'The undertaking shall provide information on its energy consumption and mix',
        },
        {
          type: 'number-input',
          id: 'totalEnergyCons',
          label: 'What is the total energy consumption of your company?',
        },
        {
          type: 'text',
          text: 'Consumption from non-renewable sources:',
        },
        {
          id: 'coal',
          type: 'checkbox',
          option: { value: 'coal', display: 'coal and coal products' },
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
                left: { type: 'value', id: 'coal.coal' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'petroleum',
          type: 'checkbox',
          option: { value: 'petroleum', display: 'crude oil and petroleum products' },
        },
        {
          type: 'number-input',
          id: 'petroleum-amount',
          label: 'Energy consumption from crude oil and petroleum products in MWH',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'petroleum.petroleum' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'gas',
          type: 'checkbox',
          option: { value: 'gas', display: 'natural gas' },
        },
        {
          type: 'number-input',
          id: 'gas-amount',
          label: 'Energy consumption from natural gas in MWH',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'gas.gas' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'other-non-renewable',
          type: 'checkbox',
          option: { value: 'other-non-renewable', display: 'other non-renewable sources' },
        },
        {
          type: 'number-input',
          id: 'other-non-renewable-amount',
          label: 'Energy consumption from other non-renewable sources in MWH',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'other-non-renewable.other-non-renewable' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'nuclear',
          type: 'checkbox',
          option: { value: 'nuclear', display: 'nuclear products' },
        },
        {
          type: 'number-input',
          id: 'nuclear-amount',
          label: 'Nuclear energy consumption in MWH',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'nuclear.nuclear' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'purchased-non-renew',
          type: 'checkbox',
          option: {
            value: 'purchased-non-renew',
            display: 'purchased or acquired electricity, heat, steam, and cooling from non-renewable sources',
          },
        },
        {
          type: 'number-input',
          id: 'purchased-non-renew-amount',
          label:
            'Energy consumption from purchased or acquired electricity, heat, steam, and cooling from non-renewable sources in MWH',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'purchased-non-renew.purchased-non-renew' },
                right: true,
              },
            },
          ],
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
    {
      id: 'G1-6',
      title: 'G1-6',
      elements: [
        {
          type: 'heading',
          text: 'G1-6 – Payment practices',
        },
        {
          type: 'text',
          text: 'The undertaking shall provide information on its payment practices to support transparency about these practices given the importance of timely cash flows to business partners, especially with respect to late payments to small and medium enterprises (SMEs).',
        },
        {
          type: 'number-input',
          id: 'AvgTimeToPayInvoice',
          description:
            'What is the average time the company takes to pay an invoice from the date when the contractual or statutory term of payment starts to be calculated, in number of days?',
        },
        {
          type: 'text',
          text: 'A description of the undertaking’s standard payment terms in number of days by main category of suppliers and the percentage of its payments aligned with these standard terms is required here.',
        },
        {
          type: 'boolean-choice',
          id: 'variingStandards',
          description:
            'Is the company dealing with standard contractual payment terms that differ significantly depending on country or type of supplier?',
          required: false,
        },
        {
          type: 'text',
          text: 'An example of what the description of standard contract term disclosures in paragraph 33 (b) could look like:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'variingStandards',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'ABC’s standard contract payment terms are payment on invoice for wholesalers which encompass approximately 80% of its annual invoices. It pays for services received within 30 days after receipt of the invoice which are about 5% of its annual invoices. The remainder of its invoices are paid within 60 days of receipt except for those in country X which in accordance with the marketplace standards are paid within 90 days of receipt.',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'variingStandards',
              },
            },
          ],
        },
        {
          type: 'number-input',
          id: 'numOfLegalProceedingsOutstanding',
          description:
            'What is the number of legal proceedings (currently outstanding) during the reporting period for late payments?',
        },
      ],
    },
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
  ],
};
