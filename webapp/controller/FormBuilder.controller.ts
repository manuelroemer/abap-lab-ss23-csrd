import BaseController from './BaseController';
import { createState } from '../utils/State';
import { createFormEngineContext } from '../formengine/FormEngineContext';
import { demoFormSchema } from '../formengine/DemoFormSchema';
import MessageBox from 'sap/m/MessageBox';

interface FormBuilderState {
  schemaJson: string;
  stateJson: string;
}

export default class FormBuilderController extends BaseController {
  formEngineState = createFormEngineContext(demoFormSchema);

  state = createState<FormBuilderState>(() => ({
    schemaJson: JSON.stringify(demoFormSchema, null, 4),
    stateJson: '{}',
  }));

  public onInit() {
    this.connectState(this.state);
    this.connectState(this.formEngineState, 'formEngine');

    this.state.watch(
      (s) => s.schemaJson,
      ({ schemaJson }) => {
        const schema = tryParseJson(schemaJson);
        schema && this.formEngineState.get().setSchema(schema);
      },
    );

    this.state.watch(
      (s) => s.stateJson,
      ({ stateJson }) => {
        console.log('JSON change: ', stateJson.substring(0, 10));
        const state = tryParseJson(stateJson);
        state && this.formEngineState.get().setState(state);
      },
    );

    this.formEngineState.watch(
      (s) => s.state,
      ({ state }) => {
        console.log('Engine state change: ', state);
        this.state.set({ stateJson: JSON.stringify(state, null, 4) });
      },
    );
  }

  onPreviousPagePress() {
    this.formEngineState.get().goBackward();
  }

  onNextPagePress() {
    this.formEngineState.get().goForward();
  }

  onSubmitPress() {
    if (this.formEngineState.get().submit()) {
      MessageBox.success(
        'The form would have been submitted successfully. You can see the console output for details about the final form engine state.',
        { title: 'Form Submitted Successfully' },
      );

      console.group('📄 Submitted Form state: ');
      console.info(this.formEngineState.get().state);
      console.groupEnd();
    }
  }
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
