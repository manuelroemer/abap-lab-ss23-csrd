import { FormSchema } from '../Schema';

export const demoFormSchema: FormSchema = {
  pages: [
    {
      title: 'All Controls',
      elements: [
        {
          type: 'heading',
          text: 'Hello From the Form Engine! I am a Heading!',
        },
        {
          type: 'text',
          text: 'I am a simple text. You should already know me from the previous page.',
        },
        {
          id: 'message',
          type: 'text-input',
          placeholder: 'Enter a message',
          label: 'Message',
          required: true,
          description: 'Enter a message that you want to convey to the world.',
          helperText: "If you don't know what to write, try navigating to the next page.",
          validationRules: [
            {
              message: 'You must write "Hello world!".',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'message',
                },
                right: 'Hello world!',
              },
            },
          ],
        },
        {
          type: 'number-input',
          id: 'a-number',
          label: 'What is your favorite number?',
          description: 'You have to pick one between 0 and 1000.',
          min: 0,
          max: 1000,
          required: true,
        },
        {
          type: 'boolean-choice',
          id: 'choice-understood',
          label: 'Message confirmation',
          description: 'Did you understand what message you had to write?',
          helperText: 'Tip: It has no effect what you choose here.',
          required: false,
        },
        {
          id: 'animal',
          type: 'single-choice',
          label: 'Your favorite animal',
          description: 'If you had to pick one, what is your favorite animal?',
          options: [
            {
              value: 'cat',
              display: 'Cat 🐈',
            },
            {
              value: 'dog',
              display: 'Dog 🐕',
            },
            {
              value: 'pandö',
              display: 'Panda 🐼',
            },
            {
              value: 'whale',
              display: 'Whale 🐳',
            },
          ],
          required: false,
          columns: 2,
        },
        {
          id: 'dessert',
          type: 'single-choice-select',
          label: 'What is your favorite dessert?',
          options: [
            {
              value: 'cake',
              display: 'Cake 🍰',
            },
            {
              value: 'cookie',
              display: 'Cookie 🍪',
            },
            {
              value: 'ice',
              display: 'Ice 🍧',
            },
          ],
          required: false,
        },
        {
          id: 'fruits',
          type: 'multi-choice',
          label: 'Fruits',
          description: 'What type of fruit do you like?',
          options: [
            {
              value: 'apples',
              display: 'Apples 🍎',
            },
            {
              value: 'bananas',
              display: 'Bananas 🍌',
            },
            {
              value: 'cherries',
              display: 'Cherry 🍒',
            },
          ],
          required: false,
        },
        {
          id: 'today',
          type: 'date-time',
          label: "What is today's date?",
          helperText: 'Hint: You can also pick any other date. We do not discriminate.',
          required: false,
        },
        {
          id: 'TestCheckbox',
          type: 'checkbox',
          text: 'I love apples 🍎',
        },
      ],
    },
    {
      title: 'The Panda',
      effects: [
        {
          effect: 'show',
          condition: {
            type: 'eq',
            left: {
              type: 'value',
              id: 'animal',
            },
            right: 'pandö',
          },
        },
      ],
      elements: [
        {
          type: 'heading',
          text: 'Panda Page',
        },
        {
          type: 'text',
          text: 'This page is only visible if you chose the Panda. 🐼',
        },
      ],
    },
    {
      title: 'Expression-Test',
      elements: [
        {
          type: 'number-input',
          id: 'num1',
          min: 0,
          max: 10,
          label: 'Please input a number here:',
          required: false,
        },
        {
          type: 'number-input',
          id: 'num2',
          min: 0,
          max: 10,
          label: 'Please input another number here:',
          required: false,
        },
        {
          type: 'text',
          text: 'Num1 is bigger than Num2! (>)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'gt',
                left: {
                  type: 'value',
                  id: 'num1',
                },
                right: {
                  type: 'value',
                  id: 'num2',
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Num1 is smaller than Num2! (<)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'lt',
                left: {
                  type: 'value',
                  id: 'num1',
                },
                right: {
                  type: 'value',
                  id: 'num2',
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Num1 is bigger than or equal to Num2! (>=)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ge',
                left: {
                  type: 'value',
                  id: 'num1',
                },
                right: {
                  type: 'value',
                  id: 'num2',
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Num1 is smaller than or equal to Num2! (<=)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'le',
                left: {
                  type: 'value',
                  id: 'num1',
                },
                right: {
                  type: 'value',
                  id: 'num2',
                },
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
              effect: 'show',
              condition: {
                type: 'and',
                left: {
                  type: 'value',
                  id: 'bool1',
                },
                right: {
                  type: 'value',
                  id: 'bool2',
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Either of booleans is true (yes)! (OR)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'or',
                left: {
                  type: 'value',
                  id: 'bool1',
                },
                right: {
                  type: 'value',
                  id: 'bool2',
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Both booleans have the same value! (EQ)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'bool1',
                },
                right: {
                  type: 'value',
                  id: 'bool2',
                },
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'The booleans have different values! (NE)',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'ne',
                left: {
                  type: 'value',
                  id: 'bool1',
                },
                right: {
                  type: 'value',
                  id: 'bool2',
                },
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Feedback Demo',
      elements: [
        {
          type: 'heading',
          text: '📢 Feedback (Demo)',
        },
        {
          type: 'single-choice',
          label: 'How would you rate your experience with the form builder?',
          description: '',
          helperText: '',
          options: [
            {
              display: 'Good',
              value: 'good',
            },
            {
              display: 'Medium',
              value: 'medium',
            },
            {
              value: 'bad',
              display: 'Bad',
            },
          ],
          id: 'demo-feedback',
        },
        {
          type: 'text-input',
          label: 'Why did you choose "Bad"?',
          description: "We'd be happy to hear your feedback.",
          helperText: '',
          required: true,
          rows: 3,
          id: 'demo-feedback-bad-reason',
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'demo-feedback',
                },
                right: 'bad',
              },
            },
          ],
        },
        {
          type: 'text-input',
          label: 'Any additional comments that you want to leave?',
          description: "Anything that isn't already covered by the above field.",
          helperText: '',
          required: true,
          rows: 3,
          effects: [
            {
              effect: 'show',
              condition: {
                type: 'eq',
                left: {
                  type: 'value',
                  id: 'demo-feedback',
                },
                right: 'bad',
              },
            },
          ],
          id: 'demo-feedback-bad-comments',
        },
      ],
    },
    {
      title: 'Feedback Recreation',
      elements: [
        {
          type: 'text-input',
          label: 'Why did you choose "Bad"?',
          description: "We'd be happy to hear your feedback.",
          helperText: '',
          required: true,
          rows: 3,
          id: 'feedback-bad-reason',
        },
        {
          type: 'text-input',
          label: 'Any additional comments that you want to leave?',
          description: "Anything that isn't already covered by the above field.",
          helperText: '',
          required: true,
          rows: 3,
          effects: [],
          id: 'feedback-bad-comments',
        },
      ],
    },
  ],
  refs: {
    conditions: {
      'feedback-bad-chosen': {
        type: 'eq',
        left: {
          type: 'value',
          id: 'feedback',
        },
        right: 'bad',
      },
    },
  },
};
