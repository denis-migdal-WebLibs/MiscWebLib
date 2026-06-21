import { createEvent, trigger } from "@/Reactive/Event";
import JSZip from "jszip";
import { Serializable } from "./DataStore/core/interfaces";
import { PropertiesProxy } from "@/Reactive/Properties/PropertiesStore";

type QuestionData<T extends unknown> = {
    QID    : string,
    comment: string,
    score  : number|null,
    coeff  : number|null,
    answer : T,
}

// 'cause we can listen to it.
export type Question<T extends unknown> = PropertiesProxy<QuestionData<T>>;


export default class StudentWork implements Serializable {

    resourceName = "unnamed";

    private data: Record<string, QuestionData<unknown>> = {};

    get nbQuestions() {
        return Object.keys(this.data).length;
    }

    getQuestionID(i: number) {
        return Object.keys(this.data)[i];
    }

    // mainly used for test/debug purpose.
    setQuestionsData(data: readonly QuestionData<unknown>[], origin: unknown) {

        this.data = {};
        for(let i = 0; i < data.length; ++i)
            this.data[data[i].QID] = data[i];

        trigger(this.change, origin);
    }

    setQuestionData(data: QuestionData<unknown>, origin: unknown) {
        this.data[data.QID] = data;
        trigger(this.change, origin);
    }

    getQuestionData(qid: string): QuestionData<unknown>|null {
        return this.data[qid] ?? null;
    }

    async import(buffer: ArrayBuffer, origin: unknown) {
        
        console.warn("importing subject...", origin);

        const zip = new JSZip();
        await zip.loadAsync(buffer);

        const file = zip.file("answers")!;
        this.data = JSON.parse( await file.async("string") ); // as X

        console.warn("end of importing subject...")
        trigger(this.change, origin);
    }
    async export() {
        const zip = new JSZip();
        zip.file("answers", JSON.stringify(this.data, null, '\t') );

        return await zip.generateAsync({type:"arraybuffer"}) as ArrayBuffer;
    }

    readonly change = createEvent(this);
}