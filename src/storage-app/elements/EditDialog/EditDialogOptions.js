

class EditDialogOptions {
    constructor() {
        this.header = '';
        this.show = false;
        this.wait = false;
        this.yesLabel = 'Save';
        this.noLabel = 'Cancel';
    }

    yes({label}) {
        this.yes = label;
        return this;
    }

    static init() {
        return new EditDialogOptions();
    }

    headerSet(header) {
        this.header = header;
        return this;
    }

    showSet(show = true) {
        this.show = show;
        return this;
    }

    waitSet(wait = true) {
        this.wait = wait;
        return this;
    }
}

export default EditDialogOptions
