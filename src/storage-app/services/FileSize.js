
class FileSize {
    constructor(bytes) {
        this.bytes = bytes;
        this.decimals = 2;
    }

    static inBytes (bytes) {
        return new FileSize(bytes);
    }

    format() {
        if (this.bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = this.decimals < 0 ? 0 : this.decimals;
        const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(this.bytes) / Math.log(k));

        return parseFloat((this.bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


    percent(bytes) {
        return Math.round((bytes / this.bytes) * 100);
    }
}

export default FileSize;
