import axios from 'axios'

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
 *   }
 * }} StorageResponseDataFolder
 */

/**
 * @typedef {{
 *   id: number
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
  /**
   * @param {?string} id
   * @returns {Promise<StorageGetResponse>}
   */
  get(id= null) {
    let url = 'http://127.0.0.1:8000/api/admin/storage';
    if (id) url += `/${id}`;

    return axios.get(url);
  }

  /**
   * @param {StorageItem} item
   * @return {Promise<StorageSaveResponse>}
   */
  save(item) {
    return axios.put('/api/admin/storage', item);
  }

  /**
   * @param {StorageDoc} doc
   * @param {function} onUploadProgress
   * @return Promise<StorageGetResponse>
   */
  upload(doc, onUploadProgress) {
    console.log('upload doc', doc)
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
    if (doc.name) form.append('name', doc.name);
    if (doc.parent_id) form.append('parent_id', doc.parent_id);

    return axios.post('/api/admin/storage', form, config);
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
    return axios.delete(`/api/admin/storage/${id}`);
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