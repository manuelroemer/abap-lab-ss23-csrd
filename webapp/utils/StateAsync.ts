import { StateGet, StateSet } from './State';

interface AsyncStateInternal<TArgs extends object, TData, TError> {
  __promise?: Promise<TData>;
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
   */
  fetch(args: TArgs): Promise<TData>;
}

interface AsyncStateInternalFull<TArgs extends object, TData, TError> extends AsyncStateInternal<TArgs, TData, TError> {
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
}

export type AsyncState<TArgs extends object, TData> = Omit<AsyncStateInternalFull<TArgs, TData, any>, '__promise'>;

/**
 * Options required by {@link createAsync}.
 */
export interface AsyncStateOptions<TArgs extends object, TData, TError> {
  /**
   * The {@link StateGet} getter function of the state within which {@link createAsync} is called.
   */
  get: StateGet<object>;
  /**
   * The {@link StateSet} setter function of the state within which {@link createAsync} is called.
   */
  set: StateSet<object>;
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
 * const myState = createState<MyState>(({ get, set }) => ({
 *   resource: createAsync({
 *     get,
 *     set,
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
export function createAsync<TArgs extends object = object, TData = unknown, TError = unknown>({
  get,
  set,
  key,
  fetch,
  onSuccess,
  onError,
}: AsyncStateOptions<TArgs, TData, TError>): AsyncState<TArgs, TData> {
  const getState = () => get()[key] as AsyncStateInternal<TArgs, TData, TError>;

  const setState = (update: Partial<AsyncStateInternal<TArgs, TData, TError>>) => {
    set({
      [key]: withComputed({
        ...getState(),
        ...update,
      }),
    });
  };

  return withComputed({
    __promise: undefined,
    data: undefined,
    status: 'idle',
    async fetch(args) {
      const current = getState();

      // We don't want to allow multiple concurrently resolving promises.
      // If a promise is already pending at the moment, don't start a new one.
      // Simply await the pending one.
      if (current.status === 'pending' && current.__promise) {
        return await current.__promise;
      }

      try {
        const promise = fetch(args);

        setState({
          __promise: promise,
          status: 'pending',
        });

        const data = await promise;

        setState({
          __promise: undefined,
          status: 'success',
          data,
        });

        onSuccess?.(data);
        return data;
      } catch (error: any) {
        setState({
          __promise: undefined,
          status: 'error',
          error,
        });

        onError?.(error);
        throw error;
      }
    },
  });
}

/**
 * Converts an {@link AsyncStateInternal} to the full {@link AsyncStateInternalFull} state
 * by computing the missing properties.
 */
function withComputed<TArgs extends object, TData, TError>(
  state: AsyncStateInternal<TArgs, TData, TError>,
): AsyncStateInternalFull<TArgs, TData, TError> {
  return {
    ...state,
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}
