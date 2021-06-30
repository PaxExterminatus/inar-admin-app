import StorageItem from './StorageItem';

class DocProps {
  constructor({preview = null, url = null, polygons = null, size = null, description = null, note = null, topic = null, thesis = null} = {}) {
    this.preview = preview;
    this.url = url;
    this.polygons = polygons;
    this.size = size;
    this.description = description;
    this.note = note;
    this.topic = topic;
    this.thesis = thesis;
  }
}

class StorageDoc extends StorageItem {
  /**
   * @param {?string} id
   * @param {?string} parent_id
   * @param {string} name
   * @param {number} size
   * @param {('local'|'kept'|'loading')} state
   * @param {DocProps} props
   * @param {File} file
   */
  constructor({id, parent_id, name, size, state, props, file}) {
    super({id, parent_id, name, type: 'doc', props});
    this.size = size;
    this.state = state;
    this.file = file;
    this.polygons = 0;
  }

  /**
   * @param {DocProps} props
   * @return {DocProps}
   */
  makeProps(props) {
    return new DocProps(props);
  }

  kept() {
    this.state = 'kept';
  }

  /**
   * @param {StorageDoc|Object} doc
   * @return {StorageDoc}
   */
  fill(doc) {
    super.fill(doc);
    this.id = doc.id;
    this.parent_id = doc.parent_id;
    this.name = doc.name;
    this.size = doc.size;
    this.state = doc.state;
  }

  copy() {
    return new StorageDoc({
      id: this.id,
      parent_id: this.parent_id,
      name: this.name,
      state: this.state,
      size: this.size,
      file: this.file,
    });
  }

  /**
   * @param {StorageItem} parent
   * @return {StorageItem}
   */
  static make(parent) {
    return StorageDoc.makeNew('', parent, 'doc');
  }

  /**
   * Make storage doc from response data
   * @param {StorageResponseDataFile} data
   */
  static init(data) {
    return new StorageDoc({
      id: data.id,
      parent_id: data.parent_id,
    })
  }

  /**
   * @return {StorageDoc}
   */
  static empty() {
    return new StorageDoc({
      id: null,
      parent_id: null,
      name: '',
      size: 0,
      state: 'local',
      props: new DocProps(),
      file: null,
    })
  }

  /**
   * Make storage doc from response data
   * @param {File} file
   * @param {?StorageDir} parent
   */
  static local(file, parent) {
    return new StorageDoc({
      id: null,
      parent_id: parent ? parent.id : null,
      name: file.name,
      size: file.size,
      state: 'local',
      file: file,
    });
  }

  /**
   * @param {StorageDoc|Object} doc
   * @return {StorageDoc}
   */
  static declare(doc) {
    return doc;
  }
}

export default StorageDoc;