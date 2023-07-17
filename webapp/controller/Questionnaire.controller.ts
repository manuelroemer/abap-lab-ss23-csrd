import BaseController from './BaseController';
import MessageBox from 'sap/m/MessageBox';
import { connectRouterState } from '../utils/StateRouter';
import MessageToast from 'sap/m/MessageToast';
import { createQuestionnaireState } from '../state/Questionnaire';

export default class QuestionnaireController extends BaseController {
  state = createQuestionnaireState();

  public onInit() {
    this.connectState(this.state);
    connectRouterState(this.state, this.router, 'Questionnaire');
  }

  onPreviousPress() {
    this.state.get().goBackward();
  }

  onNextPress() {
    this.state.get().goForward();
  }

  async onSave() {
    try {
      await this.state.get().saveMutation.fetch();
      MessageToast.show('Your questionnaire was successfully saved!');
    } catch {
      MessageBox.error('An unexpected error occured while saving your questionnaire.');
    }
  }

  async onSubmitPress() {
    const { submit, submitMutation } = this.state.get();

    if (submit()) {
      try {
        await submitMutation.fetch();
        MessageToast.show('Your questionnaire was successfully saved!');
        this.navBack();
      } catch {
        MessageBox.error('An unexpected error occured while saving your questionnaire.');
      }
    }
  }
}
