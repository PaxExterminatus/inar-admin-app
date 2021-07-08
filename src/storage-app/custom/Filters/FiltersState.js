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
        };
    }

    loadingOn() {
        this.state.loading = true;
    }

    loadingOff() {
        this.state.loading = false;
    }

    disabledOn() {
        this.state.loading = true;
    }

    disabledOff() {
        this.state.loading = false;
    }
}

export default FiltersState;
