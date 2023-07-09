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

  async onSubmitPress() {
    const {
      submit,
      submitMutation,
      parameters: { customerId },
    } = this.state.get();

    if (submit()) {
      try {
        await submitMutation.fetch();
        MessageToast.show('Your questionnaire was successfully saved!');
        this.router.navTo('CustomerManagement', { customerId });
      } catch {
        MessageBox.error('An unexpected error occured while saving your questionnaire.');
      }
    }
  }
}
