import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';

export default class FormBuilderPropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
