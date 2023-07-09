import Table from 'sap/m/Table';
import { formBuilderState } from '../state/FormBuilder';
import BaseController from './BaseController';

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
}
