import StorageItem from './StorageItem';
import StorageDir from './StorageDir';

class DocProps {
  constructor({preview = null, url = null, polygons = null, size = null,
                description = null, note = null,
                topic = null, thesis = null, cover = null, type = null} = {}) {
    this.preview = preview;
    this.url = url;
    this.polygons = polygons;
    this.size = size;
    this.description = description;
    this.note = note;
    this.topic = topic;
    this.thesis = thesis;
    this.cover = cover;
    this.type = type;
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
   * @param {?File} file
   * @param {?File} preview
   * @param {?string} download
   * @param {StorageItem} parent
   */
  constructor({id, parent_id, name, size, state, props,
                file = null, preview = null, download = null, parent = null}) {

    super({id, parent_id, name, type: 'doc', props, download,});
    this.size = size;
    this.state = state;
    this.file = file;
    this.preview = preview;
    this.polygons = 0;

    if (parent) this.parentSet(parent);
  }

  parentSet({id, parent_id, name, size, props}) {
    this.parent = new StorageDir({id, parent_id, name, state: 'kept', size, props});
  }

  /**
   * @param {File} file
   */
  previewAttach(file) {
    this.preview = file;
    return this;
  }
  previewDetach() {
    this.preview = null;
    return this;
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
    console.log('fill', doc);
    super.fill(doc);
    this.makeProps(doc.props);
    this.parent = new StorageDir(doc.parent);
  }

  copy() {
    return new StorageDoc({
      id: this.id,
      parent_id: this.parent_id,
      name: this.name,
      state: this.state,
      size: this.size,
      props: this.props,
      parent: this.parent,
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
  static empty({name = '', parent = null} = {name: '', parent_id: null}) {
    return new StorageDoc({
      id: null,
      parent_id: parent ? parent.id || null : null,
      parent: parent,
      name,
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