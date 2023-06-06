import deepClone from 'sap/base/util/deepClone';
import merge from 'sap/base/util/merge';
import JSONModel from 'sap/ui/model/json/JSONModel';

export interface State<T extends object> {
  model: JSONModel;
  get(): T;
  set(value: Partial<T> | ((previous?: T) => Partial<T>), replace?: boolean): T;
  subscribe(cb: StateSubscriber<T>): () => void;
  reset(): void;
}

export type StateSubscriber<T extends object> = (nextValue: T, previousValue: T | undefined, state: State<T>) => void;

export type StateGet<T extends object> = State<T>['get'];
export type StateSet<T extends object> = State<T>['set'];
export type CreateState<T extends object> = (stateAccessors: { get: StateGet<T>; set: StateSet<T> }) => T;

export function createState<T extends object>(createInitialState: CreateState<T>): State<T> {
  const model = new JSONModel({});
  const subscribers: Array<StateSubscriber<T>> = [];
  let currentValue = undefined as unknown as T;
  let initialValue: T = undefined as unknown as T;

  const state = Object.freeze<State<T>>({
    model,
    get() {
      return currentValue;
    },
    set(value, replace = false) {
      if (typeof value === 'function') {
        value = value(currentValue);
      }

      const previousValue = currentValue;
      const nextValue = (replace ? value : merge({}, currentValue, value)) as T;

      currentValue = nextValue;
      model.setProperty('/', deepClone(nextValue));

      for (const subscriber of subscribers) {
        subscriber(nextValue, previousValue, this);
      }

      return nextValue;
    },
    subscribe(cb) {
      subscribers.push(cb);
      return () => subscribers.splice(subscribers.indexOf(cb), 1);
    },
    reset() {
      this.set(deepClone(initialValue), true);
    },
  });

  initialValue = createInitialState(state);
  state.reset();

  // Synchronize the internal state values when the model updates.
  // Calling `state.set` here *does* again update the model, but it is smart enough to not
  // run into cycles.
  model.attachPropertyChange(() => {
    const modelValue = model.getProperty('/');
    state.set(deepClone(modelValue));
  });

  return state;
}
