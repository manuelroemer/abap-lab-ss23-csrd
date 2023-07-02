import { AsyncState, AsyncStateOptions, createAsync } from './StateAsync';

/**
 * Options required by {@link createAsync}.
 */
export interface QueryStateOptions<TArgs, TData, TError> extends AsyncStateOptions<TArgs, TData, TError> {
  getArgs(state: unknown): TArgs | null | undefined;
}

export type QueryState<TArgs = void, TData = unknown, TError = unknown> = AsyncState<TArgs, TData, TError>;

/**
 * Creates a {@link QueryState} object that can be added to a state container.
 * A query is a specialization of {@link AsyncState}, inspired by the popular React libraries
 * [`react-query`](https://tanstack.com/query/v4/docs/react/overview) and (`swr`)[https://swr.vercel.app/].
 *
 * It is an abstraction for fetching ("querying") arbitrary data based on arguments coming from the state.
 * A simple example is a web request. Assume that you have a state object like this:
 * ```ts
 * {
 *   resourceId: 123,
 * }
 * ```
 *
 * Now you want to make a web request and load the resource from the URL `/api/my-resource/RESOURCE_ID`,
 * where `RESOURCE_ID` is always the current value from the state.
 * This is what {@link createQuery} is for - it allows to query data based on arbitrary values from
 * the current state. The data fetching lifecycle is reflected *into* the state, meaning that a UI
 * can easily display, for example, loading information, errors, the data itself, etc.
 *
 * The function can be used like this:
 * ```ts
 * interface MyState {
 *   resourceId: string;
 *   resource: QueryState<string, MyResource>;
 * }
 *
 * interface MyResource {
 *   value: number;
 * }
 *
 * const myState = createState<MyState>(({ state }) => ({
 *   resource: createQuery({
 *     state,
 *     key: 'resource',
 *     getArgs: (state) => state.resourceId,
 *     async fetch(id) {
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
export function createQuery<TArgs = void, TData = unknown, TError = unknown>(
  options: QueryStateOptions<TArgs, TData, TError>,
): QueryState<TArgs, TData, TError> {
  const {
    key,
    state: { get, set, watch },
    getArgs,
  } = options;

  const asyncState = createAsync(options);

  watch(getArgs, (state) => {
    // Whenever the query's args change, refetch.
    // Force a refetch here to cancel/overwrite any ongoing query fetch.
    const args = getArgs(state);

    if (args === null || args === undefined) {
      set({
        [key]: {
          ...get()[key],
          status: 'idle',
          data: undefined,
          error: undefined,
        },
      });
    }

    if (args !== null && args !== undefined) {
      asyncState.fetch(args, true);
    }
  });

  return asyncState;
}
