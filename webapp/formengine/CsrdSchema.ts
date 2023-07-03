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
      id: 'GOV-5',
      title: 'GOV-5 General disclosures',
      effects: [
        {
          effect: 'hide',
          condition: {
            type: 'gt',
            left: { type: 'value', id: 'numEmployees' },
            right: 250,
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
        },
        {
          type: 'text-input',
          id: 'scope',
        },
        {
          type: 'heading',
          text: '34 (b): Disclose the risk assessment approach followed, including the risk prioritisation methodology:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'riskPrioritisation',
        },
        {
          type: 'heading',
          text: '34 (c): Disclose the main risks identified, actual and potential, and their mitigation strategies including related controls:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'mainRisks',
        },
        {
          type: 'heading',
          text: '34 (d): Provide a description of how the undertaking integrates the findings of its risk assessment and internal controls as regards the sustainability reporting process into relevant internal functions and processes:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'integrationRisks',
        },
        {
          type: 'heading',
          text: '34 (e): Provide a description of the periodic reporting of the findings to the administrative, management and supervisory bodies:',
          level: 5,
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
        },
        {
          type: 'text-input',
          id: 'impactGHGEmiss',
        },
        {
          type: 'heading',
          text: '18 (b): Climate-related physical risks in own operations and along the value chain: ',
          level: 5,
        },
        {
          id: 'tempRelated',
          type: 'checkbox',
          option: { value: 'tempRelated', display: 'Temperature-related' },
        },
        {
          type: 'heading',
          text: 'Temperature-related',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'tempRelated.tempRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'tempRelated-chronic',
          options: [
            { value: 'changingTemp', display: 'Changing temperature (air, freshwater, marine water)' },
            {
              value: 'heatStress',
              display: 'Heat stress',
            },
            { value: 'temperatureVari', display: 'Temperature variability' },
            { value: 'permafrostThawing', display: 'Permafrost thawing' },
          ],
          required: false,
          description: 'Temperature-related chronic:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'tempRelated.tempRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'tempRelated-acute',
          options: [
            { value: 'heatWave', display: 'Heat wave' },
            {
              value: 'coldwave',
              display: 'Cold wave/frost',
            },
            { value: 'wildfire', display: 'Wildfire' },
          ],
          required: false,
          description: 'Temperature-related acute:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'tempRelated.tempRelated',
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
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'tempRelated.tempRelated',
              },
            },
          ],
        },
        {
          id: 'windRelated',
          type: 'checkbox',
          option: { value: 'windRelated', display: 'Wind-related' },
        },
        {
          type: 'heading',
          text: 'Wind-related',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'windRelated.windRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'windRelated-chronic',
          options: [{ value: 'changingTWind', display: 'Changing wind patterns' }],
          required: false,
          description: 'Wind-related chronic:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'windRelated.windRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'windRelated-acute',
          options: [
            { value: 'cyclones', display: 'Cyclones, hurricanes, typhoons' },
            {
              value: 'storms',
              display: 'Storms (including blizzards, dust, and sandstorms)',
            },
            { value: 'tornado', display: 'Tornado' },
          ],
          required: false,
          description: 'Wind-related acute:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'windRelated.windRelated',
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
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'windRelated.windRelated',
              },
            },
          ],
        },
        {
          id: 'waterRelated',
          type: 'checkbox',
          option: { value: 'waterRelated', display: 'Water-related' },
        },
        {
          type: 'heading',
          text: 'Water-related',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'waterRelated.waterRelated',
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
            { value: 'oceanAcidification', display: 'Ocean acidification' },
            { value: 'salineIntrusion', display: 'Saline intrusion' },
            { value: 'seaLevelRise', display: 'Sea level rise' },
            { value: 'waterStress', display: 'Water stress' },
          ],
          required: false,
          description: 'Water-related chronic:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'waterRelated.waterRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'waterRelated-acute',
          options: [
            { value: 'drought', display: 'Drought' },
            {
              value: 'heavyPrecipitation',
              display: 'Heavy precipitation (rain, hail, snow/ice)',
            },
            { value: 'flood', display: 'Flood (coastal, fluvial, pluvial, ground water)' },
            { value: 'glacialLake', display: 'Glacial lake outburst' },
          ],
          required: false,
          description: 'Water-related acute:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'waterRelated.waterRelated',
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
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'waterRelated.waterRelated',
              },
            },
          ],
        },
        {
          id: 'solidMassRelated',
          type: 'checkbox',
          option: { value: 'solidMassRelated', display: 'Solid mass-related' },
        },
        {
          type: 'heading',
          text: 'Solid mass-related',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'solidMassRelated.solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'solidMassRelated-chronic',
          options: [
            { value: 'coastalErosion', display: 'Coastal erosion' },
            {
              value: 'soilDegradation',
              display: 'Soil degradation',
            },
            { value: 'soilErosion', display: 'Soil erosion' },
            { value: 'Solifluction', display: 'Solifluction' },
          ],
          required: false,
          description: 'Solid mass-related chronic:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'solidMassRelated.solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'solidMassRelated-acute',
          options: [
            { value: 'avalanche', display: 'Avalanche' },
            {
              value: 'landslide',
              display: 'Landslide',
            },
            { value: 'subsidence', display: 'Subsidence' },
          ],
          required: false,
          description: 'Solid mass-related acute:',
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'solidMassRelated.solidMassRelated',
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
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'solidMassRelated.solidMassRelated',
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '18 (c): Climate-related transition risks and opportunities in own operations and along the value chain:',
          level: 5,
        },
        {
          type: 'heading',
          text: 'Examples of climate-related transition events (examples based on TCFD classification):',
          level: 5,
        },
        {
          id: 'policy',
          type: 'checkbox',
          option: { value: 'policy', display: 'Policy and legal' },
        },
        {
          type: 'heading',
          text: 'Policy and legal:',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'policy.policy',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'policy-choice',
          options: [
            { value: 'pricingOfGHG', display: 'Increased pricing of GHG emissions' },
            {
              value: 'enhancedEmissions-reporting',
              display: 'Enhanced emissions-reporting obligations',
            },
            { value: 'mandatesServices', display: 'Mandates on and regulation of existing products and services' },
            { value: 'mandatesProcesses', display: 'Mandates on and regulation of existing production processes' },
            { value: 'litigation', display: 'Exposure to litigation' },
          ],
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'policy.policy',
              },
            },
          ],
        },
        {
          id: 'technology',
          type: 'checkbox',
          option: { value: 'technology', display: 'Technology' },
        },
        {
          type: 'heading',
          text: 'Technology:',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'technology.technology',
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
            { value: 'lowerEmissionsTech', display: 'Costs of transition to lower emissions technology' },
          ],
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'technology.technology',
              },
            },
          ],
        },
        {
          id: 'market',
          type: 'checkbox',
          option: { value: 'market', display: 'Market' },
        },
        {
          type: 'heading',
          text: 'Market:',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'market.market',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'market-choice',
          options: [
            { value: 'customerBehaviour', display: 'Changing customer behaviour' },
            {
              value: 'uncertaintyMarket',
              display: 'Uncertainty in market signals',
            },
            { value: 'costRawMaterials', display: 'Increased cost of raw materials' },
          ],
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'market.market',
              },
            },
          ],
        },
        {
          id: 'reputation',
          type: 'checkbox',
          option: { value: 'reputation', display: 'Reputation' },
        },
        {
          type: 'heading',
          text: 'Reputation:',
          level: 5,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'reputation.reputation',
              },
            },
          ],
        },
        {
          type: 'multi-choice',
          id: 'reputation-choice',
          options: [
            { value: 'shiftPreference', display: 'Shifts in consumer preference' },
            {
              value: 'stigmatization',
              display: 'Stigmatization of sector',
            },
            { value: 'stakeholderConcern', display: 'Increased stakeholder concern' },
            { value: 'stakeholderFeedback', display: 'Negative stakeholder feedback' },
          ],
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'value',
                id: 'reputation.reputation',
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '19: Explain how it has used climate-related scenario analysis to inform the identification and assessment of physical and transition risks and opportunities over the short-, medium- and long-term time horizons:',
          level: 5,
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
        },
        {
          type: 'number-input',
          id: 'totalEnergyCons',
        },
        {
          type: 'heading',
          text: '35 (a): Consumption from non-renewable sources:',
          level: 5,
        },
        {
          type: 'number-input',
          id: 'totalNonRenewEnergyCons',
          description: 'Total energy consumption from non-renewable sources in MWh:',
        },
        {
          id: 'coal',
          type: 'checkbox',
          option: { value: 'coal', display: 'coal and coal products' },
        },
        {
          type: 'number-input',
          id: 'coal-amount',
          description: 'Energy consumption from coal and coal products in MWh:',
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
          description: 'Energy consumption from crude oil and petroleum products in MWh:',
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
          description: 'Energy consumption from natural gas in MWh:',
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
          description: 'Energy consumption from other non-renewable sources in MWh:',
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
          description: 'Nuclear energy consumption in MWh:',
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
          description:
            'Energy consumption from purchased or acquired electricity, heat, steam, and cooling from non-renewable sources in MWh:',
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
          type: 'heading',
          text: '35 (b) Consumption from renewable sources:',
          level: 5,
        },
        {
          type: 'number-input',
          id: 'totalRenewEnergyCons',
          description: 'Total energy consumption from renewable sources in MWh:',
        },
        {
          id: 'renew-fuel',
          type: 'checkbox',
          option: { value: 'renew-fuel', display: 'renewable fuel sources' },
        },
        {
          type: 'number-input',
          id: 'renew-fuel-amount',
          description: 'Energy consumption from renewable fuel sources in MWh:',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'renew-fuel.renew-fuel' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'purchased-renew',
          type: 'checkbox',
          option: {
            value: 'purchased-renew',
            display: 'purchased or acquired electricity, heat, steam, and cooling from renewable sources',
          },
        },
        {
          type: 'number-input',
          id: 'purchased-renew-amount',
          description:
            'Energy consumption of purchased or acquired electricity, heat, steam, and cooling from renewable sources in MWh:',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'purchased-renew.purchased-renew' },
                right: true,
              },
            },
          ],
        },
        {
          id: 'self-generated',
          type: 'checkbox',
          option: { value: 'self-generated', display: 'self-generated non-fuel renewable energy' },
        },
        {
          type: 'number-input',
          id: 'self-generated-amount',
          description: 'Energy consumption from self-generated non-fuel renewable energy in MWH',
          required: false,
          effects: [
            {
              effect: 'hide',
              condition: {
                type: 'eq',
                left: { type: 'value', id: 'self-generated.self-generated' },
                right: true,
              },
            },
          ],
        },
        {
          type: 'heading',
          text: '36: Does the company produce energy?',
          level: 5,
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
              effect: 'hide',
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
        },
        {
          type: 'text-input',
          id: 'sectorSpecification',
        },
        {
          type: 'heading',
          text: '40: Disclose the reconciliation to the relevant line item or notes in the financial statements of the net revenue amount from activities in high climate impact sectors (the denominator in the calculation of the energy intensity required by paragraph 37):',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'lineItems',
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
          text: '65 (a): Specify the the gender distribution in number and percentage at top management level amongst its employees:',
          level: 5,
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
        },
        {
          type: 'number-input',
          id: 'AvgTimeToPayInvoice',
        },
        {
          type: 'heading',
          text: '33 (b): A description of the undertaking’s standard payment terms in number of days by main category of suppliers and the percentage of its payments aligned with these standard terms is required here.',
          level: 5,
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
          type: 'heading',
          text: '33 (c): What is the number of legal proceedings (currently outstanding) during the reporting period for late payments?',
          level: 5,
        },
        {
          type: 'number-input',
          id: 'numOfLegalProceedingsOutstanding',
        },
        {
          type: 'heading',
          text: '33 (d): Include complementary information necessary to provide sufficient context:',
          level: 5,
        },
        {
          type: 'text-input',
          id: 'complementaryPaymentPractices',
        },
      ],
    },
  ],
};
