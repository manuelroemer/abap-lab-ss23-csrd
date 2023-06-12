import UIComponent from 'sap/ui/core/UIComponent';
import Controller from 'sap/ui/core/mvc/Controller';
import History from 'sap/ui/core/routing/History';
import { State } from '../utils/State';

export default class BaseController extends Controller {
  get router() {
    return UIComponent.getRouterFor(this);
  }

  navBack() {
    const history = History.getInstance();
    const previousHash = history.getPreviousHash();

    if (previousHash) {
      window.history.go(-1);
    } else {
      this.router.navTo('Main', {}, true);
    }
  }

  connectState(state: State, modelName = 'state') {
    this.getView()?.setModel(state.model, modelName);
  }
}
