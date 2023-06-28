import BaseController from './BaseController';
import { createFormEngineContext } from '../formengine/FormEngineContext';
import { csrdSchema } from '../formengine/CsrdSchema';
import MessageBox from 'sap/m/MessageBox';

export default class QuestionnaireController extends BaseController {
  formEngineState = createFormEngineContext(csrdSchema);

  public onInit() {
    this.connectState(this.formEngineState, 'formEngine');
  }

  onPreviousPress() {
    this.formEngineState.get().goBackward();
  }

  onNextPress() {
    this.formEngineState.get().goForward();
  }

  onSubmitPress() {
    const { submit, state } = this.formEngineState.get();

    // TODO: Actual submission.
    if (submit()) {
      MessageBox.success(
        'The form would have been submitted successfully. You can see the console output for details about the final form engine state.',
        { title: 'Form Submitted Successfully' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(state);
      console.groupEnd();
    }
  }
}
