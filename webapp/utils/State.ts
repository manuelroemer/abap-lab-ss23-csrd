import deepClone from 'sap/base/util/deepClone';
import deepEqual from 'sap/base/util/deepEqual';
import merge from 'sap/base/util/merge';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * An object which provides a simple state management solution for UIs, heavily inspired by
 * the [Zustand](https://github.com/pmndrs/zustand) library.
 *
 * This state implementation integrates well with SAPUI5's `JSONModel`.
 * It provides a Zustand-inspired API for managing state and internally synchronizes it with the
 * `JSONModel` instance (both ways).
 * This allows using a simple and modern state management approach while still leveraging UI5's
 * data binding features via the `JSONModel`.
 *
 * A {@link State} object is created by calling {@link createState}. Here is an example which
 * creates a rudimentary "counter" state:
 *
 * ```ts
 * type CounterState = {
 *   count: number;
 *   increment(): void;
 *   decrement(): void;
 * };
 *
 * const state = createState<CounterState>(({ get, set }) => ({
 *   count: 0,
 *   increment: () => set({ count: get().count + 1 }),
 *   decrement: () => set({ count: get().count - 1 }),
 * }));
 *
 * const unsubscribe = state.subscribe(({ count }) => console.log(count));
 *
 * const { count, increment, decrement } = state.get();
 * state.set({ count: 123 }); // logs: "123"
 * increment(); // logs: "124"
 * decrement(); // logs: "123"
 * ```
 */
export interface State<T extends object = object> {
  /**
   * The {@link JSONModel} that is internally synchronized with the state.
   * Use this model for data-binding to the state.
   */
  readonly model: JSONModel;
  /**
   * Returns the state's current value.
   */
  get(): T;
  /**
   * Sets the state's next value.
   * This accepts partial values. Unless `replace` is `false`, the provided value is merged with
   * the current value.
   * @param value The state's next value. Can be a partial value or a function which
   *   determines the next (partial) value based on the current value.
   * @param replace Replaces the entire state with the provided value instead of merging it.
   */
  set(value: Partial<T> | ((previous: T) => Partial<T>), replace?: boolean): T;
  /**
   * Subscribes the given callback to state changes.
   * This returns a disposer function which, when called, unsubscribes the given callback.
   * @param cb The {@link StateSubscriber} callback to be invoked when the state changes.
   */
  subscribe(cb: StateSubscriber<T>): () => void;
  /**
   * Similarly to {@link subscribe}, this subscribes the given callback to state changes.
   * This does, however, only invoke the callback when **a specific**, selected value changes.
   * @param selector A function which returns the value to be watched for changes.
   * @param cb The {@link StateSubscriber} callback to be invoked when the selected value changes.
   */
  watch<S>(selector: (state: T) => S, cb: StateSubscriber<T>): () => void;
  /**
   * Resets the state to its initial value.
   */
  reset(): void;
}

/**
 * Represents a function which is called whenever a {@link State} object notifies about a state change.
 * The function receives the following parameters:
 * - `nextValue`: The new (next) value.
 * - `previousValue`: The previous value.
 * - `state`: The {@link State} object which triggered the notification.
 */
export type StateSubscriber<T extends object> = (nextValue: T, previousValue: T, state: State<T>) => void;

export type StateGet<T extends object> = State<T>['get'];
export type StateSet<T extends object> = State<T>['set'];
export type CreateState<T extends object> = (stateAccessors: { get: StateGet<T>; set: StateSet<T> }) => T;

/**
 * Creates a new {@link State} object from the provided initial value.
 * @param createInitialState Creates the initial state object.
 * @returns A {@link State} which holds the initial value provided by {@link createInitialState}.
 */
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

      console.group('State change');
      console.info('Previous: ', previousValue);
      console.info('Next: ', nextValue);
      console.groupEnd();

      return nextValue;
    },
    subscribe(cb) {
      subscribers.push(cb);
      return () => subscribers.splice(subscribers.indexOf(cb), 1);
    },
    watch(selector, cb) {
      return this.subscribe((nextValue, previousValue, state) => {
        const previous = selector(previousValue);
        const next = selector(nextValue);

        if (!deepEqual(previous, next)) {
          cb(nextValue, previousValue, state);
        }
      });
    },
    reset() {
      this.set(deepClone(initialValue), true);
    },
  });

  initialValue = createInitialState(state);
  state.reset();

  // UI5's models support two-way binding. When the model updates, the internal state must
  // be synchronized with the new values.
  // Calling `state.set` here *does* again update the model, but it is smart enough to not
  // run into cycles.
  model.attachPropertyChange(() => {
    const modelValue = model.getProperty('/');
    state.set(deepClone(modelValue));
  });

  return state;
}
