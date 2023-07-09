import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

export default class FormBuilderPropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
