import { createStandardODataApi } from './Api';
import type { Entity, EntityCreate, EntityUpdate } from './Entity';

/**
 * The shape of the `FormSchema` backend entity.
 */
export interface FormSchemaEntity extends Entity {
  Type: string;
  Version: number;
  SchemaJson: string;
  MetadataJson: string;
  IsDraft: boolean;
  Name: string;
  Description: string;
}

/**
 * The shape of the `FormSchema` backend entity, as expected during a create operation.
 */
export interface FormSchemaEntityCreate extends EntityCreate {
  Type: string;
  SchemaJson: string;
  MetadataJson: string;
  IsDraft: boolean;
  Name: string;
  Description: string;
}

/**
 * The shape of the `FormSchema` backend entity, as expected during an update operation.
 */
export interface FormSchemaEntityUpdate extends EntityUpdate {
  SchemaJson?: string;
  MetadataJson?: string;
  IsDraft?: boolean;
  Name?: string;
  Description?: string;
}

const api = createStandardODataApi<FormSchemaEntity, FormSchemaEntityCreate, FormSchemaEntityUpdate>('/FormSchemaSet');
export const getAllFormSchemaEntities = api.getAllEntities;
export const getFormSchemaEntity = api.getEntity;
export const createFormSchemaEntity = api.createEntity;
export const updateFormSchemaEntity = api.updateEntity;
export const deleteFormSchemaEntity = api.deleteEntity;
