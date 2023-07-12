import deepClone from 'sap/base/util/deepClone';
import deepEqual from 'sap/base/util/deepEqual';
import Context from 'sap/ui/model/Context';
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
   * A reference to the state object itself.
   * Useful when destructuring the state.
   */
  state: State<T>;
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
   * @param notify Whether to notify subscribers about the state change.
   */
  set(value: Partial<T> | ((previous: T) => Partial<T>), replace?: boolean, notify?: boolean): T;
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
  /**
   * Notifies about a state change, if one is pending.
   * This does not update the associated {@link JSONModel} if called within a batch operation.
   */
  notify(): void;
  /**
   * Runs the given function as a batch operation.
   * State changes only propagate to the associated {@link JSONModel} after the batch operation
   * has completed.
   * Subscribers are called normally.
   * @param fn The function to be run as a batch operation.
   */
  batch<TResult = void>(fn: () => void): TResult;
}

/**
 * Represents a function which is called whenever a {@link State} object notifies about a state change.
 * The function receives the following parameters:
 * - `nextValue`: The new (next) value.
 * - `previousValue`: The previous value.
 * - `state`: The {@link State} object which triggered the notification.
 */
export type StateSubscriber<T extends object> = (nextValue: T, previousValue: T | undefined, state: State<T>) => void;

export type StateGet<T extends object> = State<T>['get'];
export type StateSet<T extends object> = State<T>['set'];
export type StateSubscribe<T extends object> = State<T>['subscribe'];
export type StateWatch<T extends object> = State<T>['watch'];
export type StateReset<T extends object> = State<T>['reset'];
export type CreateState<T extends object> = (state: State<T>) => T;

interface StateOptions {
  /**
   * A display name for the state.
   * Used when logging state changes.
   */
  name?: string;
}

/**
 * Creates a new {@link State} object from the provided initial value.
 * @param createInitialState Creates the initial state object.
 * @returns A {@link State} which holds the initial value provided by {@link createInitialState}.
 */
export function createState<T extends object>(
  createInitialState: CreateState<T>,
  options: StateOptions = {},
): State<T> {
  const maxCloneDepth = 100;
  const model = new JSONModel({});
  const subscribers: Array<StateSubscriber<T>> = [];
  let currentValue = undefined as unknown as T;
  let lastNotifiedValue = undefined as unknown as T;
  let lastNotifiedModelValue = undefined as unknown as T;
  let initialValue: T = undefined as unknown as T;
  let pendingBatches = 0;

  const state = Object.freeze<State<T>>({
    model,

    get state() {
      return state;
    },

    get() {
      return currentValue;
    },

    set(value, replace = false, notify = true) {
      if (typeof value === 'function') {
        value = value(currentValue);
      }

      const previous = currentValue;
      const next = (replace ? value : Object.assign({}, currentValue, value)) as T;
      currentValue = next;

      if (notify) {
        state.notify();
      }

      console.group(`State Change${options.name ? ' - ' + options.name : ''}`);
      console.debug(replace ? 'Full Replace' : Object.keys(value).join(', '));
      console.debug('Previous: ', previous);
      console.debug('Next: ', currentValue);
      console.groupEnd();

      return next;
    },

    subscribe(cb) {
      subscribers.push(cb);
      return () => subscribers.splice(subscribers.indexOf(cb), 1);
    },

    watch(selector, cb) {
      return state.subscribe((nextValue, previousValue, state) => {
        // Special case: When the state is created for the first time, we don't have a previous value.
        // The selector requires it, which is why we cannot call the selector here.
        // Instead, immediately invoke the callback (because the state *did* change, from nothing to something).
        if (previousValue === undefined) {
          cb(nextValue, previousValue, state);
          return;
        }

        const previous = selector(previousValue);
        const next = selector(nextValue);

        if (!deepEqual(previous, next, maxCloneDepth)) {
          cb(nextValue, previousValue, state);
        }
      });
    },

    reset() {
      state.set(deepClone(initialValue, maxCloneDepth), true);
    },

    notify() {
      // Subscribers are always notified (only if there was a change, of course).
      // These are typically very fast, therefore frequent calls don't hurt.
      if (currentValue !== lastNotifiedValue) {
        const previous = lastNotifiedValue;
        lastNotifiedValue = currentValue;

        state.batch(() => {
          for (const subscriber of subscribers) {
            subscriber(currentValue, previous, state);
          }
        });
      }

      // Updating the associated JSON model can become a very expensive operation.
      // Therefore, this is only done once per "batch" of state changes, at the end,
      // once all other subscribers have settled.
      if (pendingBatches === 0 && currentValue !== lastNotifiedModelValue) {
        lastNotifiedModelValue = currentValue;

        model.setProperty('/', deepClone(currentValue, maxCloneDepth));
        console.debug(`${options.name ?? 'State'} JSON model synchronized.`);
      }
    },

    batch(fn) {
      let result: any = undefined;

      try {
        pendingBatches++;
        result = fn();
      } finally {
        pendingBatches--;
      }

      state.notify();
      return result;
    },
  });

  // We're automatically batching any function that is part of the state, as these
  // typically trigger state changes. Batching them by default makes sense, performance-wise.
  const withAutoBatchedFunctions = (initial: T) => {
    for (const [key, value] of Object.entries(initial)) {
      if (typeof value === 'function') {
        initial[key] = (...args: any[]) => state.batch(() => value(...args));
      }
    }

    return initial;
  };

  initialValue = withAutoBatchedFunctions(createInitialState(state));
  state.reset();

  // UI5's models support two-way binding. When the model updates, the internal state must
  // be synchronized with the new values.
  // Calling `state.set` here *does* again update the model, but it is smart enough to not
  // run into cycles.
  model.attachPropertyChange((e) => {
    const context = e.getParameter('context') as Context | undefined;
    const path = context?.getPath() ?? e.getParameter('path') ?? '/';
    const topLevelProperty = path.split('/')[1];
    const topLevelPath = `/${topLevelProperty}`;
    const topLevelValue = model.getProperty(topLevelPath);
    const stateUpdate = { [topLevelProperty]: deepClone(topLevelValue, maxCloneDepth) };
    state.set(stateUpdate);
  });

  return state;
}
