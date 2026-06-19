// BrowserFile
import { download } from "./core/download";
import { DataStore, Serializable } from "./core/interfaces";
import { upload } from "./core/upload";

export default class BrowserFile extends DataStore {

    readonly extension: string;

    constructor(target: Serializable, extension: string) {
        super(target);
        this.extension = extension;
    }

    override async read(): Promise<ArrayBuffer|null> {

        const file = await upload(this.extension)
        if(file === null) return null;

        this.target.resourceName = file.name;
        
        return await file.arrayBuffer();
    }

    override async write(buffer: ArrayBuffer) {
        
        download( buffer, this.target.resourceName, this.extension);
    }
}