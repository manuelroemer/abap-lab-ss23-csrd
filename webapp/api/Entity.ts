/* eslint-disable @typescript-eslint/no-empty-interface */

/**
 * The conventional shape of any OData entity that is managed by the app's backend.
 */
export interface Entity {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
}

/**
 * The conventional shape of any OData entity that is managed by the app's backend,
 * as expected during a create operation.
 */
export interface EntityCreate {
  // Empty on purpose. None of the default attributes can be created right now.
}

/**
 * The conventional shape of any OData entity that is managed by the app's backend,
 * as expected during an update operation.
 */
export interface EntityUpdate {
  // Empty on purpose. None of the default attributes can be updated right now.
}
