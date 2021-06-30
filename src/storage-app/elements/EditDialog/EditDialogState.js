class EditDialogState {

    /** @param {EditDialogOptions|Object} options */
    constructor(options) {
        this.options = options;
    }

    /**
     * @param {EditDialogOptions|Object} options
     * @returns {EditDialogState}
     */
    static make(options) {
        return new EditDialogState(options);
    }

    get show() {
        return this.options.show;
    }

    get wait() {
        return this.options.wait;
    }

    get header() {
        return this.options.header;
    }

    open() {
        this.options.show = true;
    }
    close() {
        this.options.show = false;
    }
}

export default EditDialogState;
