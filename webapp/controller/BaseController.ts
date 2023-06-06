import UIComponent from 'sap/ui/core/UIComponent';
import Controller from 'sap/ui/core/mvc/Controller';
import History from 'sap/ui/core/routing/History';

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
}
