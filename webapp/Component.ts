import UIComponent from 'sap/ui/core/UIComponent';
import Device from 'sap/ui/Device';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace csrdreporting
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: 'json',
  };

  init() {
    super.init();
    this.getRouter().initialize();
    this.setModel(new JSONModel(Device), 'device');
  }
}
