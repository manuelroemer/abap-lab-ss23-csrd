import List from 'sap/m/List';
import { formBuilderState } from '../formbuilder/State';
import BaseController from './BaseController';
import ListItemBase from 'sap/m/ListItemBase';
import { showConfirmation } from '../utils/Confirmation';

export default class FormBuilderPageAreaController extends BaseController {
  onInit() {
    this.connectState(formBuilderState);

    // Of course, SAPUI cannot natively bind the selected index of a list.
    // It also doesn't natively update the selection when a list item is removed (even when the list
    // becomes empty).
    // -> We must do this manually. Again.
    formBuilderState.watch(
      (s) => [s.page, s.schema],
      ({ page }) => {
        const list = this.byId('pagesList') as List;
        list.setSelectedItem(list.getItems()[page]);
      },
    );
  }

  onPageSelectionChange(e) {
    const item = e.getSource().getSelectedItem() as ListItemBase;
    const list = item.getParent() as List;
    const index = list.indexOfItem(item);
    formBuilderState.get().setPage(index);
  }

  onAddPagePress() {
    const { addPage } = formBuilderState.get();
    addPage();
  }

  async onDeletePagePress() {
    const { removeSelectedPage } = formBuilderState.get();

    if (await showConfirmation({ text: 'Are you sure that you want to delete this page and all of its elements?' })) {
      removeSelectedPage();
    }
  }

  onMovePageUpPress() {
    const { moveSelectedPageUp } = formBuilderState.get();
    moveSelectedPageUp();
  }

  onMovePageDownPress() {
    const { moveSelectedPageDown } = formBuilderState.get();
    moveSelectedPageDown();
  }
}
