import Table from 'sap/m/Table';
import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';
import List from 'sap/m/List';

export default class FormBuilderElementPropertiesAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);
  }

  onAddChoiceOptionPress() {
    formBuilderState.get().addChoiceOption();
  }

  onRemoveChoiceOptionPress() {
    const table = this.byId('multiChoiceOptions') as Table;
    const items = table.getSelectedItems();
    const indices = items.map((item) => table.indexOfItem(item));
    formBuilderState.get().deleteChoiceOption(indices);
    table.removeSelections(true);
  }

  onAddElementEffectPress() {
    formBuilderState.get().addElementEffect();
  }

  onDeleteElementEffectPress() {
    const list = this.byId('elementEffects') as List;
    const selectedItem = list.getSelectedItem();
    const index = list.indexOfItem(selectedItem);
    formBuilderState.get().deleteElementEffect(index);
  }

  onAddElementValidationRulePress() {
    formBuilderState.get().addElementValidationRule();
  }

  onDeleteElementValidationRulePress() {
    const list = this.byId('elementValidationRules') as List;
    const selectedItem = list.getSelectedItem();
    const index = list.indexOfItem(selectedItem);
    formBuilderState.get().deleteElementValidationRule(index);
  }
}
