import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';

export default class FormBuilderQuestionnairePropertiesArea extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
