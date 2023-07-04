import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';

export default class FormBuilderElementPropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }
}
