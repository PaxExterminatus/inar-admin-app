import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/admin';

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
  docs({page = 1, parentId, per = 10}) {
    return axios.get(`/storage/${parentId}/docs/${per}`, {params: {page}});
  }

  /**
   * @param {?string} id
   * @returns {Promise<StorageGetResponse>}
   */
  get(id= null) {
    let url = '/storage';
    if (id) url += `/${id}`;

    return axios.get(url);
  }

  /**
   * @param {StorageItem} item
   * @return {Promise<StorageSaveResponse>}
   */
  save(item) {
    return axios.put('/storage', item);
  }

  /**
   * @param {StorageDoc} doc
   * @param {function} onUploadProgress
   * @return Promise<StorageGetResponse>
   */
  upload(doc, onUploadProgress) {
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

    return axios.post('/storage', form, config);
  }

  uploadCancel() {
    uploadCancelTokenSource.cancel('Operation canceled by the user');
    uploadCancelTokenSource = axios.CancelToken.source();
  }

  /**
   * @param {string} id
   * @return Promise<StorageGetResponse>
   */
  delete(id) {
    return axios.delete(`/storage/${id}`);
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
