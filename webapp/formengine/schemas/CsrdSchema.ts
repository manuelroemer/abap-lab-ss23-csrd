// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import deepClone from 'sap/base/util/deepClone';
import { FormSchema } from '../Schema';

export const csrdFormSchema: FormSchema = {
  refs: {
    conditions: {
      Page1Checked: {
        type: 'not',
        expression: {
          type: 'value',
          id: 'page1done',
        },
      },
      Page2Checked: {
        type: 'and',
        left: {
          type: 'not',
          expression: {
            type: 'value',
            id: 'page2done',
          },
        },
        right: {
          type: 'gt',
          left: {
            type: 'value',
            id: 'numEmployees',
          },
          right: 250,
        },
      },
      Page3Checked: {
        type: 'not',
        expression: {
          type: 'value',
          id: 'page3done',
        },
      },
      Page4Checked: {
        type: 'not',
        expression: {
          type: 'value',
          id: 'page4done',
        },
      },
      Page5Checked: {
        type: 'not',
        expression: {
          type: 'value',
          id: 'page5done',
        },
      },
      Page6Checked: {
        type: 'not',
        expression: {
          type: 'value',
          id: 'page6done',
        },
      },
      CSRDrelevant: {
        type: 'or',
        left: {
          type: 'and',
          left: {
            type: 'gt',
            left: {
              type: 'value',
              id: 'numEmployees',
            },
            right: 250,
          },
          right: {
            type: 'or',
            left: {
              type: 'gt',
              left: {
                type: 'value',
                id: 'netSales',
              },
              right: 40,
            },
            right: {
              type: 'gt',
              left: {
                type: 'value',
                id: 'totalBalancesheet',
              },
              right: 20,
            },
          },
        },
        right: {
          type: 'and',
          left: {
            type: 'gt',
            left: {
              type: 'value',
              id: 'netSales',
            },
            right: 40,
          },
          right: {
            type: 'gt',
            left: {
              type: 'value',
              id: 'totalBalancesheet',
            },
            right: 20,
          },
        },
      },
    },
  },
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
          required: true,
        },
        {
          type: 'number-input',
          id: 'netSales',
          label: 'Net sales in million euros',
          description: 'Please enter your net sales (in million euros):',
          required: true,
        },
        {
          type: 'number-input',
          id: 'totalBalancesheet',
          label: 'Balance sheet total in million euros',
          description: 'Please enter your balance sheet total (in million euros):',
          required: true,
        },
      ],
    },
    {
      id: 'GOV-5',
      title: 'GOV-5 General disclosures',
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'and',
            left: {
              type: 'gt',
              left: {
                type: 'value',
                id: 'numEmployees',
              },
              right: 250,
            },
            right: {
              type: 'ref',
              id: 'CSRDrelevant',
            },
          },
        },
      ],
      elements: [
        {
          type: 'heading',
          text: 'GOV-5 - Risk management and internal controls over sustainability reporting',
        },
        {
          type: 'heading',
          text: 'The undertaking shall disclose the main features of its risk management and internal control system in relation to the sustainability reporting process(es).',
          level: 5,
        },
        {
          type: 'heading',
          text: '34 (a): Disclose the scope, main features and components of the risk management and internal control processes and systems in relation to sustainability reporting:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'scope',
        },
        {
          type: 'heading',
          text: '34 (b): Disclose the risk assessment approach followed, including the risk prioritisation methodology:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'riskPrioritisation',
        },
        {
          type: 'heading',
          text: '34 (c): Disclose the main risks identified, actual and potential, and their mitigation strategies including related controls:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'mainRisks',
        },
        {
          type: 'heading',
          text: '34 (d): Provide a description of how the undertaking integrates the findings of its risk assessment and internal controls as regards the sustainability reporting process into relevant internal functions and processes:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'integrationRisks',
        },
        {
          type: 'heading',
          text: '34 (e): Provide a description of the periodic reporting of the findings to the administrative, management and supervisory bodies:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'periodicReporting',
        },
      ],
    },
    {
      id: 'IRO-1-E1',
      title: 'IRO-1-E1 Climate change',
      elements: [
        {
          type: 'heading',
          text: 'IRO-1-E1 – Description of the processes to identify and assess material climate-related impacts, risks and opportunities',
        },
        {
          type: 'heading',
          text: 'The undertaking shall describe the process to identify and assess climate-related impacts, risks and opportunities.',
          level: 5,
        },
        {
          type: 'heading',
          text: '18 (a): The companies impacts on climate change, in particular, the undertaking’s GHG emissions: ',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'impactGHGEmiss',
        },
        {
          type: 'heading',
          text: '18 (b): Climate-related physical risks in own operations and along the value chain: ',
          level: 5,
          marginTop: 'Small',
        },
        {
          id: 'tempRelated',
          type: 'checkbox',
          text: 'Temperature-related',
        },
        {
          type: 'heading',
          text: 'Temperature-related',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'tempRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'tempRelated-chronic',
          options: [
            {
              value: 'changingTemp',
              display: 'Changing temperature (air, freshwater, marine water)',
            },
            {
              value: 'heatStress',
              display: 'Heat stress',
            },
            {
              value: 'temperatureVari',
              display: 'Temperature variability',
            },
            {
              value: 'permafrostThawing',
              display: 'Permafrost thawing',
            },
          ],
          required: false,
          description: 'Temperature-related chronic:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'tempRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'tempRelated-acute',
          options: [
            {
              value: 'heatWave',
              display: 'Heat wave',
            },
            {
              value: 'coldwave',
              display: 'Cold wave/frost',
            },
            {
              value: 'wildfire',
              display: 'Wildfire',
            },
          ],
          required: false,
          description: 'Temperature-related acute:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'tempRelated',
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'temperature-related-input',
          description:
            'Assessment of how its assets and business activities may be exposed and are sensitive to these temperature-related hazards, creating gross physical risks for the undertaking.',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'tempRelated',
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'windRelated',
          type: 'checkbox',
          text: 'Wind-related',
        },
        {
          type: 'heading',
          text: 'Wind-related',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'windRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'windRelated-chronic',
          options: [
            {
              value: 'changingTWind',
              display: 'Changing wind patterns',
            },
          ],
          required: false,
          description: 'Wind-related chronic:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'windRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'windRelated-acute',
          options: [
            {
              value: 'cyclones',
              display: 'Cyclones, hurricanes, typhoons',
            },
            {
              value: 'storms',
              display: 'Storms (including blizzards, dust, and sandstorms)',
            },
            {
              value: 'tornado',
              display: 'Tornado',
            },
          ],
          required: false,
          description: 'Wind-related acute:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'windRelated',
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'wind-related-input',
          description:
            'Assessment of how its assets and business activities may be exposed and are sensitive to these wind-related hazards, creating gross physical risks for the undertaking.',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'windRelated',
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'waterRelated',
          type: 'checkbox',
          text: 'Water-related',
        },
        {
          type: 'heading',
          text: 'Water-related',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'waterRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'waterRelated-chronic',
          options: [
            {
              value: 'changingPrecipitation',
              display: 'Changing precipitation patterns and types (rain, hail, snow/ice)',
            },
            {
              value: 'hydrologicalVari',
              display: 'Precipitation or hydrological variability',
            },
            {
              value: 'oceanAcidification',
              display: 'Ocean acidification',
            },
            {
              value: 'salineIntrusion',
              display: 'Saline intrusion',
            },
            {
              value: 'seaLevelRise',
              display: 'Sea level rise',
            },
            {
              value: 'waterStress',
              display: 'Water stress',
            },
          ],
          required: false,
          description: 'Water-related chronic:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'waterRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'waterRelated-acute',
          options: [
            {
              value: 'drought',
              display: 'Drought',
            },
            {
              value: 'heavyPrecipitation',
              display: 'Heavy precipitation (rain, hail, snow/ice)',
            },
            {
              value: 'flood',
              display: 'Flood (coastal, fluvial, pluvial, ground water)',
            },
            {
              value: 'glacialLake',
              display: 'Glacial lake outburst',
            },
          ],
          required: false,
          description: 'Water-related acute:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'waterRelated',
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'water-related-input',
          description:
            'Assessment of how its assets and business activities may be exposed and are sensitive to these water-related hazards, creating gross physical risks for the undertaking.',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'waterRelated',
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'solidMassRelated',
          type: 'checkbox',
          text: 'Solid mass-related',
        },
        {
          type: 'heading',
          text: 'Solid mass-related',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'solidMassRelated-chronic',
          options: [
            {
              value: 'coastalErosion',
              display: 'Coastal erosion',
            },
            {
              value: 'soilDegradation',
              display: 'Soil degradation',
            },
            {
              value: 'soilErosion',
              display: 'Soil erosion',
            },
            {
              value: 'Solifluction',
              display: 'Solifluction',
            },
          ],
          required: false,
          description: 'Solid mass-related chronic:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'solidMassRelated-acute',
          options: [
            {
              value: 'avalanche',
              display: 'Avalanche',
            },
            {
              value: 'landslide',
              display: 'Landslide',
            },
            {
              value: 'subsidence',
              display: 'Subsidence',
            },
          ],
          required: false,
          description: 'Solid mass-related acute:',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'text-input',
          id: 'solidMass-related-input',
          description:
            'Assessment of how its assets and business activities may be exposed and are sensitive to these solid mass-related hazards, creating gross physical risks for the undertaking.',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '18 (c): Climate-related transition risks and opportunities in own operations and along the value chain:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'heading',
          text: 'Examples of climate-related transition events (examples based on TCFD classification):',
          level: 5,
        },
        {
          id: 'policy',
          type: 'checkbox',
          text: 'Policy and legal',
        },
        {
          type: 'heading',
          text: 'Policy and legal:',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'policy',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'policy-choice',
          options: [
            {
              value: 'pricingOfGHG',
              display: 'Increased pricing of GHG emissions',
            },
            {
              value: 'enhancedEmissions-reporting',
              display: 'Enhanced emissions-reporting obligations',
            },
            {
              value: 'mandatesServices',
              display: 'Mandates on and regulation of existing products and services',
            },
            {
              value: 'mandatesProcesses',
              display: 'Mandates on and regulation of existing production processes',
            },
            {
              value: 'litigation',
              display: 'Exposure to litigation',
            },
          ],
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'policy',
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'technology',
          type: 'checkbox',
          text: 'Technology',
        },
        {
          type: 'heading',
          text: 'Technology:',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'technology',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'technology-choice',
          options: [
            {
              value: 'lowerEmissionsOptions',
              display: 'Substitution of existing products and services with lower emissions options',
            },
            {
              value: 'unsuccessfulInvestment',
              display: 'Unsuccessful investment in new technologies',
            },
            {
              value: 'lowerEmissionsTech',
              display: 'Costs of transition to lower emissions technology',
            },
          ],
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'technology',
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'market',
          type: 'checkbox',
          text: 'Market',
        },
        {
          type: 'heading',
          text: 'Market:',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'market',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'market-choice',
          options: [
            {
              value: 'customerBehaviour',
              display: 'Changing customer behaviour',
            },
            {
              value: 'uncertaintyMarket',
              display: 'Uncertainty in market signals',
            },
            {
              value: 'costRawMaterials',
              display: 'Increased cost of raw materials',
            },
          ],
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'market',
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'reputation',
          type: 'checkbox',
          text: 'Reputation',
        },
        {
          type: 'heading',
          text: 'Reputation:',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'reputation',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'reputation-choice',
          options: [
            {
              value: 'shiftPreference',
              display: 'Shifts in consumer preference',
            },
            {
              value: 'stigmatization',
              display: 'Stigmatization of sector',
            },
            {
              value: 'stakeholderConcern',
              display: 'Increased stakeholder concern',
            },
            {
              value: 'stakeholderFeedback',
              display: 'Negative stakeholder feedback',
            },
          ],
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'reputation',
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '19: Explain how it has used climate-related scenario analysis to inform the identification and assessment of physical and transition risks and opportunities over the short-, medium- and long-term time horizons:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'heading',
          text: 'Short-term:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'shortTerm',
        },
        {
          type: 'heading',
          text: 'Medium-term:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'mediumTerm',
        },
        {
          type: 'heading',
          text: 'Long-term:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'longTerm',
        },
      ],
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'ref',
            id: 'CSRDrelevant',
          },
        },
      ],
    },
    {
      id: 'E1-5',
      title: 'E1-5 Climate change',
      elements: [
        {
          type: 'heading',
          text: 'E1-5 – Energy consumption and mix',
        },
        {
          type: 'heading',
          text: 'The undertaking shall provide information on its energy consumption and mix.',
          level: 5,
        },
        {
          type: 'heading',
          text: '35: What is the total energy consumption of your company in MWh?',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'totalEnergyCons',
        },
        {
          type: 'heading',
          text: '35 (a): Consumption from non-renewable sources:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'totalNonRenewEnergyCons',
          description: 'Total energy consumption from non-renewable sources in MWh:',
          marginBottom: 'Small',
        },
        {
          id: 'coal',
          type: 'checkbox',
          text: 'coal and coal products',
        },
        {
          type: 'number-input',
          id: 'coal-amount',
          description: 'Energy consumption from coal and coal products in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'coal',
                },
                right: true,
              },
            },
          ],
          marginTop: 'None',
          marginBottom: 'Small',
        },
        {
          id: 'petroleum',
          type: 'checkbox',
          text: 'crude oil and petroleum products',
        },
        {
          type: 'number-input',
          id: 'petroleum-amount',
          description: 'Energy consumption from crude oil and petroleum products in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'petroleum',
                },
                right: true,
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'gas',
          type: 'checkbox',
          text: 'natural gas',
        },
        {
          type: 'number-input',
          id: 'gas-amount',
          description: 'Energy consumption from natural gas in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'gas',
                },
                right: true,
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'other-non-renewable',
          type: 'checkbox',
          text: 'other non-renewable sources',
        },
        {
          type: 'number-input',
          id: 'other-non-renewable-amount',
          description: 'Energy consumption from other non-renewable sources in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'other-non-renewable',
                },
                right: true,
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'nuclear',
          type: 'checkbox',
          text: 'nuclear products',
        },
        {
          type: 'number-input',
          id: 'nuclear-amount',
          description: 'Nuclear energy consumption in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'nuclear',
                },
                right: true,
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'purchased-non-renew',
          type: 'checkbox',
          text: 'purchased or acquired electricity, heat, steam, and cooling from non-renewable sources',
        },
        {
          type: 'number-input',
          id: 'purchased-non-renew-amount',
          description:
            'Energy consumption from purchased or acquired electricity, heat, steam, and cooling from non-renewable sources in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'purchased-non-renew',
                },
                right: true,
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '35 (b) Consumption from renewable sources:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'totalRenewEnergyCons',
          description: 'Total energy consumption from renewable sources in MWh:',
          marginBottom: 'Small',
        },
        {
          id: 'renew-fuel',
          type: 'checkbox',
          text: 'renewable fuel sources',
        },
        {
          type: 'number-input',
          id: 'renew-fuel-amount',
          description: 'Energy consumption from renewable fuel sources in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'renew-fuel',
                },
                right: true,
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'purchased-renew',
          type: 'checkbox',
          text: 'purchased or acquired electricity, heat, steam, and cooling from renewable sources',
        },
        {
          type: 'number-input',
          id: 'purchased-renew-amount',
          description:
            'Energy consumption of purchased or acquired electricity, heat, steam, and cooling from renewable sources in MWh:',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'purchased-renew',
                },
                right: true,
              },
            },
          ],
          marginBottom: 'Small',
        },
        {
          id: 'self-generated',
          type: 'checkbox',
          text: 'self-generated non-fuel renewable energy',
        },
        {
          type: 'number-input',
          id: 'self-generated-amount',
          description: 'Energy consumption from self-generated non-fuel renewable energy in MWH',
          required: false,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'self-generated',
                },
                right: true,
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '36: Does the company produce energy?',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'boolean-choice',
          id: 'isProdEnergy',
          required: true,
        },
        {
          type: 'text',
          text: 'In addition the undertaking shall disaggregate and disclose separately its non-renewable energy production and renewable energy production in MWh.',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'value',
                id: 'isProdEnergy',
              },
            },
          ],
        },
        {
          type: 'heading',
          text: 'Energy intensity based on net revenue',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'heading',
          text: '37: Provide information on the energy intensity (total energy consumption per net revenue) associated with activities in high climate impact sectors:',
          level: 5,
        },
        {
          type: 'number-input',
          id: 'periodicReporting',
          description: 'Total energy consumption in high climate impact sectors in MWh:',
        },
        {
          type: 'number-input',
          id: 'periodicReporting',
          description: 'Net revenue in high climate impact sectors:',
        },
        {
          type: 'heading',
          text: '39: Specify the high climate impact sectors that are used to determine the energy intensity required by paragraph 37:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'sectorSpecification',
        },
        {
          type: 'heading',
          text: '40: Disclose the reconciliation to the relevant line item or notes in the financial statements of the net revenue amount from activities in high climate impact sectors (the denominator in the calculation of the energy intensity required by paragraph 37):',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'lineItems',
        },
      ],
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'ref',
            id: 'CSRDrelevant',
          },
        },
      ],
    },
    {
      id: 'S1-9',
      title: 'S1-9 Own workforce',
      elements: [
        {
          type: 'heading',
          text: 'S1-9 – Diversity indicators',
        },
        {
          type: 'heading',
          text: 'The undertaking shall disclose the gender distribution at top management and the age distribution amongst its employees.',
          level: 5,
        },
        {
          type: 'heading',
          text: '65 (a): Specify the gender distribution in number and percentage at top management level amongst its employees:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'numMaleManagement',
          label: 'Number of male employees at the top management level:',
        },
        {
          type: 'number-input',
          id: 'percMaleManagement',
          label: 'Percentage of male employees at the top management level:',
        },
        {
          type: 'number-input',
          id: 'numFemaleManagement',
          label: 'Number of female employees at the top management level:',
        },
        {
          type: 'number-input',
          id: 'percFemaleManagement',
          label: 'Percentage of female employees at the top management level:',
        },
        {
          type: 'heading',
          text: '65 (b): Distribution of employees by age group',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'percU30Empl',
          label: 'Percentage of employees under 30 years old:',
        },
        {
          type: 'number-input',
          id: 'perc30To50Empl',
          label: 'Percentage of employees between 30 and 50 years old:',
        },
        {
          type: 'number-input',
          id: 'percO50Empl',
          label: 'Percentage of employees older than 50 years old:',
        },
      ],
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'ref',
            id: 'CSRDrelevant',
          },
        },
      ],
    },
    {
      id: 'G1-6',
      title: 'G1-6 Business conduct',
      elements: [
        {
          type: 'heading',
          text: 'G1-6 – Payment practices',
        },
        {
          type: 'heading',
          text: 'The undertaking shall provide information on its payment practices to support transparency about these practices given the importance of timely cash flows to business partners, especially with respect to late payments to small and medium enterprises (SMEs).',
          level: 5,
        },
        {
          type: 'heading',
          text: '33 (a): What is the average time the company takes to pay an invoice from the date when the contractual or statutory term of payment starts to be calculated, in number of days?',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'AvgTimeToPayInvoice',
        },
        {
          type: 'heading',
          text: '33 (b): A description of the undertaking’s standard payment terms in number of days by main category of suppliers and the percentage of its payments aligned with these standard terms is required here.',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'boolean-choice',
          id: 'variingStandards',
          description:
            'Is the company dealing with standard contractual payment terms that differ significantly depending on country or type of supplier?',
          required: false,
        },
        {
          type: 'heading',
          text: 'An example of what the description of standard contract term disclosures in paragraph 33 (b) could look like:',
          level: 6,
          effects: [
            {
              effect: 'show',
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
              effect: 'show',
              condition: {
                type: 'value',
                id: 'variingStandards',
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '33 (c): What is the number of legal proceedings (currently outstanding) during the reporting period for late payments?',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'number-input',
          id: 'numOfLegalProceedingsOutstanding',
        },
        {
          type: 'heading',
          text: '33 (d): Include complementary information necessary to provide sufficient context:',
          level: 5,
          marginTop: 'Small',
        },
        {
          type: 'text-input',
          id: 'complementaryPaymentPractices',
        },
      ],
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'ref',
            id: 'CSRDrelevant',
          },
        },
      ],
    },
    {
      title: 'CSRD Checklist',
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
          required: true,
        },
        {
          type: 'number-input',
          id: 'netSales',
          label: 'Net sales in million euros',
          description: 'Please enter your net sales (in million euros):',
          required: true,
        },
        {
          type: 'number-input',
          id: 'totalBalancesheet',
          label: 'Balance sheet total in million euros',
          description: 'Please enter your balance sheet total (in million euros):',
          required: true,
        },
        {
          type: 'text',
          text: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'or',
                left: {
                  type: 'and',
                  left: {
                    type: 'gt',
                    left: {
                      type: 'value',
                      id: 'numEmployees',
                    },
                    right: 250,
                  },
                  right: {
                    type: 'or',
                    left: {
                      type: 'gt',
                      left: {
                        type: 'value',
                        id: 'netSales',
                      },
                      right: 40,
                    },
                    right: {
                      type: 'gt',
                      left: {
                        type: 'value',
                        id: 'totalBalancesheet',
                      },
                      right: 20,
                    },
                  },
                },
                right: {
                  type: 'and',
                  left: {
                    type: 'gt',
                    left: {
                      type: 'value',
                      id: 'netSales',
                    },
                    right: 40,
                  },
                  right: {
                    type: 'gt',
                    left: {
                      type: 'value',
                      id: 'totalBalancesheet',
                    },
                    right: 20,
                  },
                },
              },
            },
          ],
        },
        {
          type: 'heading',
          text: 'GOV-5 - Risk management and internal controls over sustainability reporting',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'gt',
                left: {
                  type: 'value',
                  id: 'numEmployees',
                },
                right: 250,
              },
            },
          ],
          marginTop: 'Large',
        },
        {
          type: 'heading',
          text: 'The undertaking shall disclose the main features of its risk management and internal control system in relation to the sustainability reporting process(es).',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page2Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '34 (a): The scope, main features and components of the risk management and internal control processes and systems in relation to sustainability reporting',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page2Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '34 (b): The risk assessment approach followed, including the risk prioritisation methodology',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page2Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '34 (c): The main risks identified, actual and potential, and their mitigation strategies including related controls',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page2Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '34 (d): Description of how the undertaking integrates the findings of its risk assessment and internal controls as regards the sustainability reporting process into relevant internal functions and processes',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page2Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '34 (e): Description of the periodic reporting of the findings to the administrative, management and supervisory bodies',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page2Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: 'GOV-5 done? ',
          description: '',
          helperText: '',
          id: 'page2done',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'gt',
                left: {
                  type: 'value',
                  id: 'numEmployees',
                },
                right: 250,
              },
            },
          ],
        },
        {
          type: 'heading',
          text: 'IRO-1-E1 – Description of the processes to identify and assess material climate-related impacts, risks and opportunities',
          marginTop: 'Large',
        },
        {
          type: 'heading',
          text: 'The undertaking shall describe the process to identify and assess climate-related impacts, risks and opportunities.',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page3Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '18 (a): Impacts on climate change',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page3Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '18 (b): Climate-related physical risks in own operations and along the value chain',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page3Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '18 (c): Climate-related transition risks and opportunities in own operations and along the value chain',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page3Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '19: Use of climate-related scenario analysis to inform the identification and assessment of physical and transition risks and opportunities over the short-, medium- and long-term time horizons',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page3Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: 'IRO-1-E1 done? ',
          description: '',
          helperText: '',
          id: 'page3done',
        },
        {
          type: 'heading',
          text: 'E1-5 – Energy consumption and mix',
          marginTop: 'Large',
        },
        {
          type: 'heading',
          text: 'The undertaking shall provide information on its energy consumption and mix.',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '35: Total energy consumption of your company in MWh ',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '35 (a): Total energy consumption from non-renewable sources',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          id: 'ai',
          type: 'checkbox',
          text: '35 (a) i.: coal and coal products',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'coal',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'aii',
          type: 'checkbox',
          text: '35 (a) ii.: crude oil and petroleum products',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'petroleum',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'aiii',
          type: 'checkbox',
          text: '35 (a) iii.: natural gas',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'gas',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'aiv',
          type: 'checkbox',
          text: '35 (a) iv.: other non-renewable sources',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'other-non-renewable',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'av',
          type: 'checkbox',
          text: '35 (a) v.: nuclear products',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'nuclear',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'avi',
          type: 'checkbox',
          text: '35 (a) vi.: purchased or acquired electricity, heat, steam, and cooling from non-renewable sources',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'purchased-non-renew',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '35 (b): Total energy consumption from renewable sources',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          id: 'bi',
          type: 'checkbox',
          text: '35 (b) i.: renewable fuel sources',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'renew-fuel',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'bii',
          type: 'checkbox',
          text: '35 (b) ii.: purchased or acquired electricity, heat, steam, and cooling from renewable sources',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'purchased-renew',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          id: 'biii',
          type: 'checkbox',
          text: '35 (b) iii.: self-generated non-fuel renewable energy',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'self-generated',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '36: Produced energy',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'isProdEnergy',
                },
                right: {
                  type: 'ref',
                  id: 'Page4Checked',
                },
              },
            },
          ],
        },
        {
          type: 'heading',
          text: 'Energy intensity based on net revenue',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
          marginTop: 'Small',
        },
        {
          type: 'checkbox',
          label: '',
          text: '37: Information on the energy intensity',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '39: High climate impact sectors that are used to determine the energy intensity required by paragraph 37',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '40: Relevant line item or notes in the financial statements of the net revenue amount ',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page4Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: 'E1-9 done? ',
          description: '',
          helperText: '',
          id: 'page4done',
        },
        {
          type: 'heading',
          text: 'S1-9 – Diversity indicators',
          marginTop: 'Large',
        },
        {
          type: 'heading',
          text: 'The undertaking shall disclose the gender distribution at top management and the age distribution amongst its employees.',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page5Checked',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          label: '',
          description: '65 (a): The gender distribution in number and percentage at top management level amongst',
          helperText: '',
          options: [
            {
              display: 'Number of male employees at the top management level',
              value: 'option-1',
            },
            {
              display: 'Percentage of male employees at the top management level',
              value: 'option-2',
            },
            {
              value: 'option-3',
              display: 'Number of female employees at the top management level',
            },
            {
              value: 'option-4',
              display: 'Percentage of female employees at the top management level',
            },
          ],
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page5Checked',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          label: '',
          description: '65 (b): Distribution of employees by age group',
          helperText: '',
          options: [
            {
              display: 'Percentage of employees under 30 years old',
              value: 'option-1',
            },
            {
              display: 'Percentage of employees between 30 and 50 years old',
              value: 'option-2',
            },
            {
              value: 'option-3',
              display: 'Percentage of employees older than 50 years old',
            },
          ],
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page5Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: 'S1-9 done?',
          description: '',
          helperText: '',
          id: 'page5done',
        },
        {
          type: 'heading',
          text: 'G1-6 – Payment practices',
          marginTop: 'Large',
        },
        {
          type: 'heading',
          text: 'The undertaking shall provide information on its payment practices to support transparency about these practices given the importance of timely cash flows to business partners, especially with respect to late payments to small and medium enterprises (SMEs).',
          level: 5,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page6Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '33 (a): The average time the company takes to pay an invoice from the date when the contractual or statutory term of payment starts to be calculated',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page6Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '33 (b): The undertaking’s standard payment terms in number of days by main category of suppliers and the percentage of its payments aligned with these standard terms',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page6Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '33 (c): Number of legal proceedings (currently outstanding) during the reporting period for late payments',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page6Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: '33 (d): Complementary information necessary to provide sufficient context',
          description: '',
          helperText: '',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ref',
                id: 'Page6Checked',
              },
            },
          ],
        },
        {
          type: 'checkbox',
          label: '',
          text: 'G1-6 done? ',
          description: '',
          helperText: '',
          id: 'page6done',
        },
        {
          type: 'heading',
          text: 'Congratulations, you have met all the requirements!',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'and',
                  left: {
                    type: 'and',
                    left: true,
                    right: {
                      type: 'or',
                      left: {
                        type: 'le',
                        left: {
                          type: 'value',
                          id: 'numEmployees',
                        },
                        right: 250,
                      },
                      right: {
                        type: 'value',
                        id: 'page2done',
                      },
                    },
                  },
                  right: {
                    type: 'and',
                    left: {
                      type: 'value',
                      id: 'page3done',
                    },
                    right: {
                      type: 'value',
                      id: 'page4done',
                    },
                  },
                },
                right: {
                  type: 'and',
                  left: {
                    type: 'value',
                    id: 'page5done',
                  },
                  right: {
                    type: 'value',
                    id: 'page6done',
                  },
                },
              },
            },
          ],
          marginTop: 'Large',
        },
      ],
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'ref',
            id: 'CSRDrelevant',
          },
        },
      ],
    },
    {
      title: 'Result',
      elements: [
        {
          type: 'heading',
          text: 'Thank you for participating! ',
          marginTop: 'Medium',
        },
        {
          type: 'heading',
          text: 'Your company is not required to disclose the CSRD.',
          marginTop: 'Medium',
        },
      ],
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'not',
            expression: {
              type: 'ref',
              id: 'CSRDrelevant',
            },
          },
        },
      ],
    },
  ],
};

// This is our updated schema for the demo. It's based on the CSRD schema and dynamically injects the following elements:
const updatedElements = [
  {
    type: 'heading',
    text: '📢 Customer Feedback',
  },
  {
    type: 'text',
    text: 'This new section was added to evaluate how the customer rates his experience with the CSRD questionnaire and the resulting checklist.',
  },
  {
    type: 'single-choice',
    label: 'How would you rate your experience with the CSRD questionnaire?',
    description: '',
    helperText: '',
    options: [
      {
        display: 'Awesome',
        value: 'awesome',
      },
      {
        display: 'Fantastic',
        value: 'fantastic',
      },
      {
        value: 'delightful',
        display: 'Delightful',
      },
    ],
    required: true,
    id: 'feedback-rating',
  },
  {
    type: 'text-input',
    label: 'Additional comments:',
    description: 'You can write anything here...',
    helperText: '...as long as it is positive feedback.',
    required: true,
    id: 'feedback-text',
    marginBottom: 'Large',
    rows: 4,
  },
];

const updatedCsrdFormSchema = deepClone(csrdFormSchema, Number.MAX_SAFE_INTEGER);
const pageToUpdate = updatedCsrdFormSchema.pages.length - 2;
updatedCsrdFormSchema.pages[pageToUpdate].elements = [
  ...updatedElements,
  ...updatedCsrdFormSchema.pages[pageToUpdate].elements,
];
export { updatedCsrdFormSchema };
