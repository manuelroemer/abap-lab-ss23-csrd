import Router from 'sap/ui/core/routing/Router';
import { State } from './State';

/**
 * Represents how route and query parameters are stored in a state.
 */
export interface RouterState<TParameters extends object = object, TQuery extends object = object> {
  /**
   * The route parameters.
   */
  parameters: Partial<TParameters>;
  /**
   * The query parameters.
   */
  query: Partial<TQuery>;
}

/**
 * Merges the route and query parameters of a router's current route into the specified state object,
 * allowing the state to subscribe and react to route parameter changes.
 * @param state The state into which the route parameters should be merged.
 * @param router The router to which the state should listen.
 */
export function connectRouterState<TParameters extends object = object, TQuery extends object = object>(
  state: State<RouterState<TParameters, TQuery>>,
  router: Router,
  routeName?: string,
) {
  const handler = (e) => {
    const parameters = { ...e.getParameters().arguments };
    const query = { ...parameters['?query'] };
    delete parameters['?query'];
    state.set({ parameters, query });
  };

  const route = router.getRoute(routeName ?? '');
  if (route) {
    route.attachPatternMatched(handler);
  } else {
    router.attachRoutePatternMatched(handler);
  }
}
