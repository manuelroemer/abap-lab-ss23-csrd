import ODataModel from 'sap/ui/model/odata/v2/ODataModel';

/**
 * The central {@link ODataModel} used for interacting with the backend.
 */
export const service = new ODataModel('/sap/opu/odata/sap/Z_00_T1_SS23_CSRD_SRV/', {
  useBatch: false,
  json: true,
});

/**
 * The shape of an OData response with multiple results.
 */
export interface ODataResults<T> {
  results: Array<T>;
}

/**
 * Creates functions for interacting with a standard OData API, i.e., all its CRUD endpoints.
 * @param entitySet The name of the OData entity set, as it appears in the URL.
 */
export function createStandardODataApi<
  TEntity extends object,
  TEntityCreate extends object = TEntity,
  TEntityUpdate extends object = TEntity,
>(entitySet: string) {
  return {
    getAllEntities(parameters?: ReadEntityParameters) {
      return readEntity<ODataResults<TEntity>>(entitySet, parameters);
    },
    getEntity(id: string, parameters?: ReadEntityParameters) {
      return readEntity<TEntity>(`${entitySet}('${id}')`, parameters);
    },
    createEntity(data: TEntityCreate, parameters?: CreateEntityParameters) {
      return createEntity<TEntityCreate>(entitySet, data, parameters);
    },
    updateEntity(id: string, data: Partial<TEntityUpdate>, parameters?: UpdateEntityParameters) {
      return updateEntity<Partial<TEntityUpdate>>(`${entitySet}('${id}')`, data, parameters);
    },
    deleteEntity(id: string, parameters?: DeleteEntityParameters) {
      return deleteEntity(`${entitySet}('${id}')`, parameters);
    },
  };
}

type ODataModelReadParameters = NonNullable<Parameters<ODataModel['read']>[1]>;
export type ReadEntityParameters = Omit<ODataModelReadParameters, 'success' | 'error'>;

/**
 * A promisified wrapper around {@link ODataModel.read}.
 * @param path The relative path to the OData entity set.
 * @param parameters Additional request parameters.
 */
export function readEntity<T extends object = object>(path: string, parameters?: ReadEntityParameters) {
  return new Promise<T>((res, rej) => {
    service.read(path, {
      ...parameters,
      success: (data) => res(data),
      error: (e) => rej(e),
    });
  });
}

type ODataModelCreateParameters = NonNullable<Parameters<ODataModel['create']>[2]>;
export type CreateEntityParameters = Omit<ODataModelCreateParameters, 'success' | 'error'>;

/**
 * A promisified wrapper around {@link ODataModel.create}.
 * @param path The relative path to the OData entity set.
 * @param data The object to be created.
 * @param parameters Additional request parameters.
 */
export function createEntity<T extends object = object>(path: string, data: T, parameters?: CreateEntityParameters) {
  return new Promise<T>((res, rej) => {
    service.create(path, data, {
      ...parameters,
      success: (data: T) => res(data),
      error: (e) => rej(e),
    });
  });
}

type ODataModelUpdateParameters = NonNullable<Parameters<ODataModel['update']>[2]>;
export type UpdateEntityParameters = Omit<ODataModelUpdateParameters, 'success' | 'error'>;

/**
 * A promisified wrapper around {@link ODataModel.update}.
 * @param path The relative path to the OData entity set.
 * @param data The object to be updated.
 * @param parameters Additional request parameters.
 */
export function updateEntity<T extends object>(path: string, data: T, parameters?: UpdateEntityParameters) {
  return new Promise<T>((res, rej) => {
    service.update(path, data, {
      ...parameters,
      success: (data: T) => res(data),
      error: (e) => rej(e),
    });
  });
}

type ODataModelDeleteParameters = NonNullable<Parameters<ODataModel['remove']>[1]>;
export type DeleteEntityParameters = Omit<ODataModelDeleteParameters, 'success' | 'error'>;

/**
 * A promisified wrapper around {@link ODataModel.remove}.
 * @param path The relative path to the OData entity set.
 * @param parameters Additional request parameters.
 */
export function deleteEntity(path: string, parameters?: DeleteEntityParameters) {
  return new Promise((res, rej) => {
    service.remove(path, {
      ...parameters,
      success: () => res(undefined),
      error: (e) => rej(e),
    });
  });
}
