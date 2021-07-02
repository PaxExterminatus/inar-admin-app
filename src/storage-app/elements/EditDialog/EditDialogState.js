const errors = {
    "errors": {
        "props.max_size": [
            "Set the maximum file size"
        ]
    }
}

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

    set show(value) {
        this.options.show = value;
    }

    get loading() {
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

    wait() {
        this.options.wait = true;
    }
    stop() {
        this.options.wait = false;
    }
}

export default EditDialogState;
