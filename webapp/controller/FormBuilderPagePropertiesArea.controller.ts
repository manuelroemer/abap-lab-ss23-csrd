import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';

export default class FormBuilderPagePropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
