import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';

export default class FormBuilderController extends BaseController {
  public onInit() {
    this.connectState(formBuilderState);
  }
}
