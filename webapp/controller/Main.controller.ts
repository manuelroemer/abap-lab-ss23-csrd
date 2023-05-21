import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';

export default class MainController extends Controller {
  vm = new JSONModel({
    schema: {},
    state: {},
  });

  public onInit() {
    this.getView()?.setModel(this.vm, 'vm');
  }

  public updateJSON() {
    this.vm.setProperty('/state', {
      message: 'Hello world!',
    });
  }
}
