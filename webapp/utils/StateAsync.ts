import { State } from './State';

interface AsyncStateInternal<TArgs, TData, TError> {
  /**
   * The last successfully resolved data.
   */
  data?: TData;
  /**
   * The last error thrown.
   */
  error?: TError;
  /**
   * The current status of the asynchronous operation.
   */
  status: 'idle' | 'pending' | 'success' | 'error';
  /**
   * Performs the asynchronous operation which is tracked by the state.
   * @param args Arguments passed to/required by the function.
   * @param force Whether to force a new fetch. Default is `false` (which deduplicates the fetch calls).
   */
  fetch(args: TArgs, force?: boolean): Promise<TData>;
  /**
   * Resets the state to `idle`, purging any `data` and `error`.
   */
  reset(): void;
}

interface AsyncStateInternalFull<TArgs, TData, TError> extends AsyncStateInternal<TArgs, TData, TError> {
  /**
   * Whether `status` is `idle`.
   */
  isIdle: boolean;
  /**
   * Whether `status` is `pending`.
   */
  isPending: boolean;
  /**
   * Whether `status` is `success`.
   */
  isSuccess: boolean;
  /**
   * Whether `status` is `error`.
   */
  isError: boolean;
  /**
   * Whether `data` is set.
   */
  hasData: boolean;
  /**
   * Whether `error` is set.
   */
  hasError: boolean;
}

export type AsyncState<TArgs = void, TData = unknown, TError = unknown> = AsyncStateInternalFull<TArgs, TData, TError>;

/**
 * Options required by {@link createAsync}.
 */
export interface AsyncStateOptions<TArgs, TData, TError> {
  /**
   * The state into which the async state is integrated.
   */
  state: State<object>;
  /**
   * The name of the property under which the result of {@link createAsync} is stored within the state.
   * This is used internally to update/set the value of the async state information.
   */
  key: string;
  /**
   * Performs the asynchronous operation which is tracked by the state.
   * This function should resolve with a value or throw on error.
   * @param args Arguments passed to/required by the function.
   */
  fetch(args: TArgs): Promise<TData>;
  /**
   * Called when {@link fetch} resolves successfully.
   * @param data The data returned by the {@link fetch} function.
   */
  onSuccess?(data: TData): void;
  /**
   * Called when {@link fetch} throws an error.
   * @param error The error thrown by the {@link fetch} function.
   */
  onError?(error: TError): void;
}

/**
 * Creates an {@link AsyncState} object that can be added to a state container.
 * An async state is used to track the status of an arbitrary asynchronous operation, typically
 * an asynchronous data-fetching or data-manipulation operation.
 *
 * The function can be used like this:
 * ```ts
 *
 * interface MyState {
 *   resource: AsyncState<MyResourceArgs, MyResource>;
 * }
 *
 * interface MyResource {
 *   value: number;
 * }
 *
 * interface MyResourceArgs {
 *   id: string;
 * }
 *
 * const myState = createState<MyState>(({ state }) => ({
 *   resource: createAsync({
 *     state,
 *     key: 'resource',
 *     async fetch({ id }: MyResourceArgs) {
 *       return await httpRequest<MyResource>(`/api/v1/my-resource/${id}`);
 *     },
 *     onSuccess(myResource) {
 *       console.log('Resource fetched!', myResource);
 *     },
 *     onError(error) {
 *       console.error('Failed to fetch resource!', error);
 *     },
 *   }),
 * }));
 *
 * console.log(myState.get().resource.status); // idle
 *
 * myState.get().resource.fetch({ id: '123' });
 *
 * console.log(myState.get().resource.status); // pending
 *
 * // ...eventually...
 * console.log(myState.get().resource.status); // success or error
 * ```
 */
export function createAsync<TArgs = void, TData = unknown, TError = unknown>({
  state: { get, set },
  key,
  fetch,
  onSuccess,
  onError,
}: AsyncStateOptions<TArgs, TData, TError>): AsyncState<TArgs, TData, TError> {
  // This promise reflects the currently pending/running fetch operation.
  // If undefined, no fetch operation is running.
  //
  // `currentRun` is incremented whenever a new run is started via `fetch`.
  // This allows multiple concurrent fetches to determine which one is outdated.
  // Example for the `currentRun` assignments (time progresses from left to right):
  //
  // fetch (1)   fetch (3)   fetch (4)
  //    fetch (2)
  //                           fetch (5)
  let currentRunPromise: Promise<TData> | undefined = undefined;
  let currentRun = 0;

  const getState = () => get()[key] as AsyncStateInternal<TArgs, TData, TError>;
  const setState = (update: Partial<AsyncStateInternal<TArgs, TData, TError>>) => {
    set({
      [key]: withComputed({
        ...getState(),
        ...update,
      }),
    });
  };

  const fetchInternal = async (args, force = false) => {
    const current = getState();

    // If `force` is `false`, we deduplicate calls to fetch.
    // This means that, if another fetch is already running at the moment,
    // we don't kick off another concurrent fetch, but instead just wait for the current one
    // to resolve.
    if (current.status === 'pending' && currentRunPromise && !force) {
      return await currentRunPromise;
    }

    // Otherwise, i.e., when we are forced to start a new fetch, or when no fetch is running at the moment,
    // start a new one.
    // Store that newest fetch run in the promise and increment the `currentRun` counter, so that
    // it's possible to determine if other concurrently running fetches are outdated.
    return await (currentRunPromise = runMostRecentFetch(args, ++currentRun));
  };

  const runMostRecentFetch = async (args: TArgs, thisRun: number) => {
    try {
      setState({ status: 'pending' });
      const data = await fetch(args);

      // If this is the most recent run, we are allowed to update the state with our results.
      if (currentRun === thisRun) {
        setState({
          status: 'success',
          data,
          error: undefined,
        });

        onSuccess?.(data);
        return data;
      }
    } catch (error: any) {
      // If this is the most recent run, we are allowed to update the state with our results.
      if (currentRun === thisRun) {
        setState({
          status: 'error',
          error,
        });

        onError?.(error);
        throw error;
      }
    }

    // If we get here, currentRun !== thisRun.
    // This means that the current run was "overwritten" via a new fetch call (which is now stored
    // inside `currentRunPromise`).
    // -> Discard whatever result was produced by this run and simply return the result of the
    //    most up-to-date promise/run.
    return await (currentRunPromise ?? Promise.reject(new Error('Operation reset or canceled.')));
  };

  const reset = () => {
    setState({
      status: 'idle',
      data: undefined,
      error: undefined,
    });

    currentRun = 0;
    currentRunPromise = undefined;
  };

  return withComputed({
    data: undefined,
    status: 'idle',
    fetch: fetchInternal,
    reset,
  });
}

/**
 * Converts an {@link AsyncStateInternal} to the full {@link AsyncStateInternalFull} state
 * by computing the missing properties.
 */
function withComputed<TArgs, TData, TError>(
  state: AsyncStateInternal<TArgs, TData, TError>,
): AsyncStateInternalFull<TArgs, TData, TError> {
  return {
    ...state,
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    hasData: !!state.data,
    hasError: !!state.error,
  };
}
