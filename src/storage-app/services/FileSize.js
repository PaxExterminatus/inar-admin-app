const unitSystem = {
    units: [
        {name: 'byte',      plural: 'bytes',      prefix: '',      short: 'B',  factor: 1,    power: 1,},
        {name: 'kilobyte',  plural: 'kilobytes',  prefix: 'kilo',  short: 'kB', factor: 1024, power: 1,},
        {name: 'megabyte',  plural: 'megabytes',  prefix: 'mega',  short: 'MB', factor: 1024, power: 2,},
        {name: 'gigabyte',  plural: 'gigabytes',  prefix: 'giga',  short: 'GB', factor: 1024, power: 3,},
        //{name: 'terabyte',  plural: 'terabytes',  prefix: 'tera',  short: 'TB', factor: 1024, power: 4,},
        //{name: 'petabyte',  plural: 'petabytes',  prefix: 'peta',  short: 'PB', factor: 1024, power: 5,},
        //{name: 'exabyte',   plural: 'exabytes',   prefix: 'exa',   short: 'EB', factor: 1024, power: 6,},
        //{name: 'zettabyte', plural: 'zettabytes', prefix: 'zetta', short: 'ZB', factor: 1024, power: 7,},
        //{name: 'yottabyte', plural: 'yottabytes', prefix: 'yotta', short: 'YB', factor: 1024, power: 8,},
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
        if (!this.bytes) return {
            value: 0,
            unit: '',
            order: 0,
        };

        const orderOfMagnitude = Math.floor(Math.log(this.bytes) / Math.log(this.k));
        const value = parseFloat((this.bytes / Math.pow(this.k, orderOfMagnitude)).toFixed(this.decimals));

        return {
            value: value,
            unit: this.units[orderOfMagnitude],
            order: orderOfMagnitude,
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
