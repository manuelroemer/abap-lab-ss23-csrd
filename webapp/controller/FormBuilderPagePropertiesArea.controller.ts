import List from 'sap/m/List';
import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

export default class FormBuilderPagePropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }

  onAddPageEffectPress() {
    formBuilderState.get().addPageEffect();
  }

  onDeletePageEffectPress() {
    const list = this.byId('pageEffects') as List;
    const selectedItem = list.getSelectedItem();
    const index = list.indexOfItem(selectedItem);
    formBuilderState.get().deletePageEffect(index);
  }
}
