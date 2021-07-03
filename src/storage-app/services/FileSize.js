const unitSystem = {
    factor: 1024,

    unit: {
        name: 'byte', short: 'B', plural: 'bytes',
    },

    units: [
        {prefix: 'kilo',  power: 1, short: 'kB'},
        {prefix: 'mega',  power: 2, short: 'MB'},
        {prefix: 'giga',  power: 3, short: 'GB'},
        {prefix: 'tera',  power: 4, short: 'TB'},
        {prefix: 'peta',  power: 5, short: 'PB'},
        {prefix: 'exa',   power: 6, short: 'EB'},
        {prefix: 'zetta', power: 7, short: 'ZB'},
        {prefix: 'yotta', power: 8, short: 'YB'},
    ],
}

class FileSize {
    constructor(bytes) {
        this.bytes = bytes;
        this.decimals = 2;
        this.units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        this.k = 1024;
    }

    static inBytes (bytes) {
        return new FileSize(bytes);
    }

    /**
     * @return {{value: number, unit: string, order: number}}
     */
    size() {
        const orderOfMagnitude = Math.floor(Math.log(this.bytes) / Math.log(this.k));
        const value = parseFloat((this.bytes / Math.pow(this.k, orderOfMagnitude)).toFixed(this.decimals));

        return {
            value: value,
            unit: this.units[orderOfMagnitude],
            order: orderOfMagnitude + 1,
        };
    }

    format() {
        if (this.bytes === 0) return `0 ${this.units[0]}`;

        const orderOfMagnitude = Math.floor(Math.log(this.bytes) / Math.log(this.k));
        return parseFloat((this.bytes / Math.pow(this.k, orderOfMagnitude)).toFixed(this.decimals)) + this.units[orderOfMagnitude];
    }

    percent(bytes) {
        return Math.round((bytes / this.bytes) * 100);
    }
}

export default FileSize;

export {
    FileSize,
    unitSystem,
}

