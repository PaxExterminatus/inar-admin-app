import StorageItem from './StorageItem';

class DirProps {
  constructor({preview = null, max_polygons = null, max_size = null} = {preview: null, max_polygons: null, max_size: null}) {
    this.preview = preview;
    this.max_size = max_size;
    this.max_polygons = max_polygons;
  }
}

class DirSate {
  constructor({selected = false, loading = false, type = 'kept'}) {
    this.selected = selected;
    this.loading = loading;
    this.type = type;
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
    this.state = new DirSate({});
  }

  get maxPolygons() {
    return this.props.max_polygons;
  }

  get maxSize() {
    return this.props.max_size;
  }

  makeProps(props) {
    return new DirProps(props);
  }

  static empty(name = '') {
    return new StorageDir({
      id: null,
      parent_id: null,
      name,
      size: 0,
      state: 'local',
      props: new DirProps(),
    })
  }

  copy() {
    return new StorageDir({
      id: this.id,
      parent_id: this.parent_id,
      type: 'dir',
      name: this.name,
      size: this.size,
      state: this.state,
      props: this.props,
    });
  }

  select() {
    this.state.selected = true;
  }
  unSelect() {
    this.state.selected = false;
  }

  wait() {
    this.state.loading = true;
  }
  stop() {
    this.state.loading = false;
  }

  makeChild() {
    return new StorageDir({
      id: null,
      parent_id: this.id,
      name: 'New folder',
      size: 0,
      state: 'local',
      props: new DirProps(),
    })
  }
}

export default StorageDir;
