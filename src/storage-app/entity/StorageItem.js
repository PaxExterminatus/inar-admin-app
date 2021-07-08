class StorageItem {
  /**
   * @param {?string} id
   * @param {?string} parent_id
   * @param {string} name
   * @param {number} size
   * @param {('local'|'kept'|'loading')} state
   * @param {('dir'|'doc')} type
   * @param {Object} props
   * @param {?string}download
   * @param {StorageDir} parent
   */
  constructor({id, parent_id, name, size = 0, state, type, props, download = null}) {
    this.id = id;
    this.name = name;
    this.parent_id = parent_id;
    this.type = type;
    this.download = download;
    this.props = this.makeProps(props)
  }

  makeProps(props) {
    return props;
  }

  /**
   * @return {Object}
   */
  static empty() {
    console.error('StorageItem.empty is abstract method override it.');
    return {};
  }

  /**
   * @param {StorageItem} source
   */
  fill(source) {
    this.id = source.id;
    this.parent_id = source.parent_id;
    this.name = source.name;
    this.size = source.size;
    this.state = source.state;
    this.props = this.makeProps(source.props);
  }

  /**
   * @param {?StorageItem} parent
   * @param {string} name
   * @param {('dir'|'doc')} type
   * @return {StorageItem}
   */
  static makeNew(name, parent = null, type) {
    return new StorageItem({
      id: null,
      name,
      parent_id: parent ? parent.id : null,
      type,
    });
  }
}

export default StorageItem
