import axios from 'axios'
axios.defaults.baseURL = '/api/admin/';
//axios.defaults.baseURL = 'http://127.0.0.1:8000/api/admin/';

/**
 * @typedef {{
 *   data: {
 *     folders: StorageResponseDataFolder[]
 *     files: StorageResponseDataFile[]
 *   }
 * }} StorageGetResponse
 */

/**
 * @typedef {{
 *   data: {
 *     folders: StorageResponseDataFolder[]
 *     files: StorageResponseDataFile[]
 *     item: StorageResponseDataFile
 *     parent: StorageResponseDataFolder|null
 *   }
 * }} StorageSaveResponse
 */

/**
 * @typedef {{
 *   id: string
 *   name: string
 *   type: ('dir')
 *   size: number|null
 *   parent_id: string|null
 *   props: {
 *     id: string
 *     preview: string|null
 *     max_polygons: number
 *     max_size: number
 *     over: number
 *   }
 * }} StorageResponseDataFolder
 */

/**
 * @typedef {{
 *   id: string
 *   name: string
 *   parent_id: number
 *   size: number
 *   props: {
 *     id: string
 *     type: ('posed'|'rigged'|'animated')
 *     preview: string|null
 *     url: string|null
 *     polygons: number|null
 *     size: number|null
 *     description: string|null
 *     note: string|null
 *     topic: string|null
 *     thesis: string|null
 *   }
 * }} StorageResponseDataFile
 */
let uploadCancelTokenSource = axios.CancelToken.source();

class StorageClient {
  /**
   * @param {{page: number, per: number}} pagination
   * @param {Object} filter
   * @param {?string} parent
   * @return {Promise<AxiosResponse<any>>}
   */
  docs({pagination, filter, parent}) {
    const filter64 = btoa(JSON.stringify(filter));
    const pagination64 = btoa(JSON.stringify(pagination));
    return axios.get(`/storage/docs`, {
      params:
          {
            page: pagination.page,
            filter: filter64,
            pagination: pagination64,
            parent: parent
          }
    });
  }

  /**
   * @param {?string} id
   * @param {FilterInput} filter
   * @param {{page: number, per: number}} pagination
   * @returns {Promise<StorageGetResponse>}
   */
  get({id, filter, pagination})
  {
    const params = {
      filter: btoa(JSON.stringify(filter)),
      pagination: btoa(JSON.stringify(pagination)),
    };

    return axios.get(`/storage/${id || ''}`, {params});
  }

  /**
   * @param {StorageItem} item
   * @param filter
   * @param pagination
   * @return {Promise<StorageSaveResponse>}
   */
  save({item, filter, pagination}) {
    return axios.put('/storage', {item, filter, pagination});
  }

  /**
   * @param {StorageDoc} doc
   * @param {function} onUploadProgress
   * @param filter
   * @param pagination
   * @return Promise<StorageGetResponse>
   */
  upload(doc, onUploadProgress, {filter, pagination}) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      cancelToken: uploadCancelTokenSource.token,
    };

    const form = new FormData();

    if (doc.id) form.append('id', doc.id);
    if (doc.file) form.append('file', doc.file);
    if (doc.preview) form.append('preview', doc.preview);
    if (doc.name) form.append('filename', doc.name);
    if (filter) form.append('filter', btoa(JSON.stringify(filter)));
    if (pagination) form.append('pagination', btoa(JSON.stringify(pagination)));

    return axios.post('/storage', form, config);
  }

  uploadCancel() {
    uploadCancelTokenSource.cancel('Operation canceled by the user');
    uploadCancelTokenSource = axios.CancelToken.source();
  }

  /**
   * @param {string} id
   * @param {FilterInput} filter
   * @param {{page: number, per: number}} pagination
   * @return Promise<StorageGetResponse>
   */
  delete({id, filter, pagination}) {
    const params = {
      filter: btoa(JSON.stringify(filter)),
      pagination: btoa(JSON.stringify(pagination)),
    };
    return axios.delete(`/storage/${id}`, {params});
  }

  static make() {
    return new StorageClient();
  }
}

const storageClient = StorageClient.make();

export {
  StorageClient,
  storageClient,
}
