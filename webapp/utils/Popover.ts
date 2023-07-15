import Popover from 'sap/m/Popover';
import Text from 'sap/m/Text';

export interface PopoverOptions {
  title?: string;
  text: string;
}

/**
 * Shows a generic popover.
 * @param options Options configuring the popover.
 */
export function showPopover(options: PopoverOptions) {
  return new Popover({
    title: options.title ?? '',
    placement: 'Auto',
    content: [new Text({ text: options.text ?? '' }).addStyleClass('sapUiTinyMargin')],
  });
}
