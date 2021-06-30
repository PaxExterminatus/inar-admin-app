import StorageItem from './StorageItem';

class DirProps {
  constructor({preview = null, max_polygons = null, max_size = null} = {preview: null, max_polygons: null, max_size: null}) {
    this.preview = preview;
    this.max_size = max_size;
    this.max_polygons = max_polygons;
  }
}

class StorageDir extends StorageItem {
  /**
   * @param {?string} id
   * @param {?string} parent_id
   * @param {string} name
   * @param {number} size
   * @param {('local'|'kept'|'loading')} state
   * @param {DirProps} props
   */
  constructor({id, parent_id, name, size, state, props}) {
    super({id, parent_id, name, size, state, type: 'dir', props});
  }

  /**
   * @param {DirProps} props
   * @return {DirProps}
   */
  makeProps(props) {
    return new DirProps(props);
  }

  /**
   * @return {StorageDir}
   */
  static empty(name) {
    return new StorageDir({
      id: null,
      parent_id: null,
      name,
      size: 0,
      state: 'local',
      props: new DirProps(),
    })
  }

  /**
   * @param {StorageItem} parent
   * @return {StorageItem}
   */
  static make(parent) {
    return StorageDir.makeNew('New folder', parent, 'dir');
  }
}

export default StorageDir;
