import BaseController from './BaseController';
import { demoFormSchema } from '../formengine/DemoFormSchema';
import { createFormEngineContext } from '../formengine/FormEngineContext';

export default class QuestionnaireController extends BaseController {
  formEngineState = createFormEngineContext(demoFormSchema);

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
