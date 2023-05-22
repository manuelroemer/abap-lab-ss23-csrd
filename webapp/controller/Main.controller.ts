import Controller from 'sap/ui/core/mvc/Controller';
import JSONModel from 'sap/ui/model/json/JSONModel';
import { FormSchema } from 'webapp/formengine/schema';

export default class MainController extends Controller {
  vm = new JSONModel({
    schema: {
      pages: [
        {
          id: 'page1',
          name: 'Page 1',
          elements: [
            {
              type: 'heading',
              text: 'Hello From the Form Engine!',
            },
            {
              type: 'text',
              text: 'This text is automatically generated from a JSON schema.',
            },
            {
              type: 'text-input',
              id: 'message',
              placeholder: 'Enter a message',
              label: 'Message',
              required: true,
              description: 'Input fields can have a description text. How cool is that?',
            },
          ],
        },
      ],
    } satisfies FormSchema,
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
