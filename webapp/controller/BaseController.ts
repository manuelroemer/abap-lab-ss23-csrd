import UIComponent from 'sap/ui/core/UIComponent';
import Controller from 'sap/ui/core/mvc/Controller';
import History from 'sap/ui/core/routing/History';
import { State } from '../utils/State';
import ResourceModel from 'sap/ui/model/resource/ResourceModel';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';

export default class BaseController extends Controller {
  get router() {
    return UIComponent.getRouterFor(this);
  }

  get i18n() {
    return this.getView()!.getModel('i18n')! as ResourceModel;
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

    // Detect when the user navigates away from the current page.
    // When that happens, reset the state so that, when the page is shown again later,
    // we start again from the *initial* state.
    // Honestly, this should be the default behavior in any UI framework, but hey... ¯\_(ツ)_/¯
    let previousRoute = undefined;
    this.router.attachRouteMatched((e) => {
      const nextRoute = e.getParameter('name');
      const didChange = !!previousRoute && previousRoute !== nextRoute;
      previousRoute = nextRoute;

      if (didChange) {
        state.reset();
      }
    });
  }

  translate(key: string, fallback = key) {
    const bundle = this.i18n.getResourceBundle() as ResourceBundle;
    return bundle.getText(key) ?? fallback;
  }
}
