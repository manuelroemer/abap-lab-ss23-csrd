import BaseController from './BaseController';
import { createState } from '../utils/State';
import { createFormEngineContext } from '../formengine/FormEngineContext';
import { demoFormSchema } from '../formengine/DemoFormSchema';

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
}

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}
