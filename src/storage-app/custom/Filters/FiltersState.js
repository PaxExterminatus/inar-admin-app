class FilterParams {
    constructor({type}) {
        this.type = type;
    }
}

class FilterValues extends FilterParams {
    constructor() {
        super({
            type: [
                {code: 'posed', name: 'Posed'},
                {code: 'rigged', name: 'Rigged'},
                {code: 'animated', name: 'Animated'},
            ],
        });
    }
}

class FilterInput extends FilterParams  {
    constructor() {
        super({
            type: '',
        });
        this.exceeded = false;
        this.name = '';
        this.extension = '';
        this.size = {
            min: 0,
            max: 0,
        };
        this.polygon = {
            min: 0,
            max: 0,
        };
        this.dirId = '';
        this.search = false;
    }
}

class Filter {
    constructor() {
        this.value = new FilterValues();
        this.input = new FilterInput();
    }
}

class FiltersState extends Filter {
    constructor() {
        super();
        this.state = {
            loading: false,
            disabled: false,
            dynamic: false,

            show: false,

            search: {
                loading: false,
                disabled: false,
            },
        };
    }

    searchStart() {
        this.state.search.loading = true;
        this.state.search.disabled = true;
    };

    searchStop() {
        this.state.search.loading = false;
        this.state.search.disabled = false;
    }

    clear() {
        this.input = new FilterInput();
    }

    /** @param {?StorageDir} dir */
    set dir(dir) {
        this.input.dirId = dir.id;
    }
}

export default FiltersState;
