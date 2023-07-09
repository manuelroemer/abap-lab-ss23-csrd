import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

export default class FormBuilderQuestionnairePropertiesArea extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
