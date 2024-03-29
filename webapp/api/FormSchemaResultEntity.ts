import { createStandardODataApi } from './Api';
import type { Entity, EntityCreate, EntityUpdate } from './Entity';

/**
 * The shape of the `FormSchemaResult` backend entity.
 */
export interface FormSchemaResultEntity extends Entity {
  CustomerId: string;
  FormSchemaId: string;
  ResultJson: string;
  MetadataJson: string;
  IsDraft: boolean;
}

/**
 * The shape of the `FormSchemaResult` backend entity, as expected during a create operation.
 */
export interface FormSchemaResultEntityCreate extends EntityCreate {
  CustomerId: string;
  FormSchemaId: string;
  ResultJson: string;
  MetadataJson: string;
  IsDraft: boolean;
}

/**
 * The shape of the `FormSchemaResult` backend entity, as expected during an update operation.
 */
export interface FormSchemaResultEntityUpdate extends EntityUpdate {
  FormSchemaId?: string;
  ResultJson?: string;
  MetadataJson?: string;
  IsDraft?: boolean;
}

const api = createStandardODataApi<FormSchemaResultEntity, FormSchemaResultEntityCreate, FormSchemaResultEntityUpdate>(
  '/FormSchemaResultSet',
);
export const getAllFormSchemaResultEntities = api.getAllEntities;
export const getFormSchemaResultEntity = api.getEntity;
export const createFormSchemaResultEntity = api.createEntity;
export const updateFormSchemaResultEntity = api.updateEntity;
export const deleteFormSchemaResultEntity = api.deleteEntity;
