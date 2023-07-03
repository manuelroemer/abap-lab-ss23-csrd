import MessageBox, { Action } from 'sap/m/MessageBox';

export interface ConfirmationPromptOptions {
  title?: string;
  text?: string;
}

/**
 * Shows a generic confirmation prompt.
 * In contrast to UI5's default MessageBox, this function returns a promise reflecting the final choice.
 * @param options Options configuring the prompt.
 */
export function showConfirmation(options: ConfirmationPromptOptions) {
  return new Promise((res) =>
    MessageBox.confirm(options.text ?? '', {
      title: options.title,
      onClose(action: Action) {
        res(action == Action.OK);
      },
    }),
  );
}
