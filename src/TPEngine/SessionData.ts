import JSZip from "jszip";
import { Serializable } from "./DataStore/core/interfaces";
import StudentWork from "./StudentWork";
import { createEvent, trigger } from "@/Reactive/Event";

export default class SessionData implements Serializable {

    resourceName = "";

    subjectURL: string|null      = null;
    corrige   : StudentWork|null = null;

    rendus: Record<string, StudentWork> = {};

    async import(buffer: ArrayBuffer, origin: unknown) {

        const zip = new JSZip();
        await zip.loadAsync(buffer);

        this.rendus = {};
    
        for(let filename in zip.files) {

            if(filename === "sujet.url") {
                this.subjectURL = (await zip.file(filename)!.async("string")).trim();
                continue;
            }

            const answers = new StudentWork();
            await answers.import(await zip.file(filename)!.async("arraybuffer"),origin);
            answers.resourceName = filename;

            if(filename === "corrige.answers") {
                this.corrige = answers;
                continue;
            }

            // TODO: from Moodle + verif RNG/IP.
            const studentID = filename.split('_')[2].slice(0,-8);
            this.rendus[studentID] = answers;
        }
    
        trigger(this.change, origin);
    }
    async export(): Promise<ArrayBuffer> {

        if( this.corrige === null || this.subjectURL === null)
            throw new Error("Can't export when no sessionData loaded!");

        const zip = new JSZip();

        zip.file("sujet.url", this.subjectURL );
        zip.file("corrige.answers", await this.corrige.export() );

        for( const student in this.rendus ) {
            const rendu = this.rendus[student];
            zip.file(rendu.resourceName, await rendu.export() );
        }

        return await zip.generateAsync({type:"arraybuffer"}) as ArrayBuffer;
    }

    readonly change = createEvent(this);
}

