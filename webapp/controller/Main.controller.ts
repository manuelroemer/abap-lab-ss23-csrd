import BaseController from './BaseController';

export default class MainController extends BaseController {
  navToFormBuilder() {
    this.router.navTo('FormBuilder');
  }

  navToQuestionnaire() {
    this.router.navTo('Questionnaire');
  }

  navToCustomerManagement() {
    this.router.navTo('CustomerManagement');
  }
}
