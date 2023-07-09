import MessageBox from 'sap/m/MessageBox';
import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

export default class FormBuilderPreviewAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }

  onPreviousPagePress() {
    formBuilderState.get().goBackward();
  }

  onNextPagePress() {
    formBuilderState.get().goForward();
  }

  onSubmitPress() {
    if (formBuilderState.get().submit()) {
      MessageBox.success(
        'The form would have been submitted successfully. You can see the console output for details about the final form engine state.',
        { title: 'Form Submitted Successfully' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(formBuilderState.get().state);
      console.groupEnd();
    } else {
      MessageBox.error(
        'The form would not have been submitted. You can see the console output for details about the final form engine state.',
        { title: 'Form Submission Failed' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(formBuilderState.get().state);
      console.groupEnd();
    }
  }
}
