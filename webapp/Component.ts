import UIComponent from 'sap/ui/core/UIComponent';
import Device from 'sap/ui/Device';
import JSONModel from 'sap/ui/model/json/JSONModel';
import { service } from './api/Api';

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
    this.setModel(service, 'svc');
  }
}
