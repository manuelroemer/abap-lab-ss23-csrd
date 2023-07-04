import { createFormBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';
import MessageBox from 'sap/m/MessageBox';

export default class FormBuilderController extends BaseController {
  state = createFormBuilderState();

  public onInit() {
    this.connectState(this.state);
  }

  onPreviousPagePress() {
    this.state.get().goBackward();
  }

  onNextPagePress() {
    this.state.get().goForward();
  }

  onSubmitPress() {
    if (this.state.get().submit()) {
      MessageBox.success(
        'The form would have been submitted successfully. You can see the console output for details about the final form engine state.',
        { title: 'Form Submitted Successfully' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(this.state.get().state);
      console.groupEnd();
    }
  }
}
