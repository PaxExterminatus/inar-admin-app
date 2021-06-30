class EditorState {
  constructor({show = false, loading = false} = {show: false, loading: false}) {
    this.show = show;
    this.loading = loading;
  }

  static init() {
    return new EditorState();
  }

  /**
   * @param {EditorState|Object} state
   * @return {EditorState}
   */
  static declare(state) {
    return state;
  }

  close() {
    this.show = false;
  }
  open() {
    this.show = true;
  }
  flipShow() {
    this.show = !this.show;
  }


  start() {
    this.loading = true;
  }
  stop() {
    this.loading = false;
  }
}

export default EditorState;
