import { createStandardODataApi } from './Api';
import type { Entity, EntityCreate, EntityUpdate } from './Entity';

/**
 * The shape of the `Customer` backend entity.
 */
export interface CustomerEntity extends Entity {
  Name: string;
  CustomerCode: string;
}

/**
 * The shape of the `Customer` backend entity, as expected during a create operation.
 */
export interface CustomerEntityCreate extends EntityCreate {
  Name: string;
  CustomerCode: string;
}

/**
 * The shape of the `Customer` backend entity, as expected during an update operation.
 */
export interface CustomerEntityUpdate extends EntityUpdate {
  Name?: string;
  CustomerCode?: string;
}

const api = createStandardODataApi<CustomerEntity, CustomerEntityCreate, CustomerEntityUpdate>('/CustomerSet');
export const getAllCustomerEntities = api.getAllEntities;
export const getCustomerEntity = api.getEntity;
export const createCustomerEntity = api.createEntity;
export const updateCustomerEntity = api.updateEntity;
export const deleteCustomerEntity = api.deleteEntity;
