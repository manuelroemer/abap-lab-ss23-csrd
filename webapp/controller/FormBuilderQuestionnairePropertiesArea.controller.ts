import List from 'sap/m/List';
import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

export default class FormBuilderQuestionnairePropertiesArea extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }

  onAddRefConditionPress() {
    formBuilderState.get().addRefCondition();
  }

  onDeleteRefConditionPress() {
    const list = this.byId('refConditions') as List;
    const selectedItem = list.getSelectedItem();
    const index = list.indexOfItem(selectedItem);
    formBuilderState.get().deleteRefCondition(index);
  }

}
