import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

export default class FormBuilderPagePropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
