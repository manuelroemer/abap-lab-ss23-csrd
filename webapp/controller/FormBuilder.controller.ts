import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';
import MessageBox from 'sap/m/MessageBox';

export default class FormBuilderController extends BaseController {
  public onInit() {
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
    }
  }
}
