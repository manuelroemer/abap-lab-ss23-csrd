import BaseController from './BaseController';
import { createFormEngineContext } from '../formengine/FormEngineContext';
import { csrdSchema } from '../formengine/CsrdSchema';

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
}
