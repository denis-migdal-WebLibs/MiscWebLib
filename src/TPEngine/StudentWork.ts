import { createEvent } from "@/Reactive/Event";
import JSZip from "jszip";
import { Serializable } from "./DataStore/core/interfaces";
import { Properties } from "@/Reactive/Properties/Property";

// 'cause we can listen to it.
export type Question<T extends unknown> = Properties<{
    QID    : string,
    comment: string,
    score  : number|null,
    coeff  : number|null,
    answer : T,
}>;

export default class StudentWork implements Serializable {

    resourceName = "unnamed";

    async import(buffer: ArrayBuffer) {
        const zip = new JSZip();
        await zip.loadAsync(buffer);

        const file = zip.file("answers")!;
        const data = JSON.parse( await file.async("string") ); // as X
        
        console.warn("imported", data);
        //TODO: setData + notify...
    }
    async export() {
        const data = {foo: 42};

        const zip = new JSZip();
        zip.file("answers", JSON.stringify(data, null, '\t') );

        return await zip.generateAsync({type:"arraybuffer"}) as ArrayBuffer;
    }

    readonly change = createEvent(this);
}