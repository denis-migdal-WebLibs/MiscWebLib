import BrowserFile from "@/TPEngine/DataStore/BrowserFile";
import LocalStorage from "@/TPEngine/DataStore/LocalStorage";
import StudentWork, { Question } from "@/TPEngine/StudentWork";

import "@/TPEngine/Questions/QText";
import { observe } from "@/Reactive/Event";

function getQuestions() {
    type QuestionElement = HTMLElement & {
        readonly properties: Question<unknown>
    };

    return [...document.querySelectorAll<QuestionElement>("q-text")].map( e => {
        console.warn(JSON.stringify(e.properties));
        return e.properties
    });
}

const s = new StudentWork();

function syncQuestions(
                        work     : StudentWork,
                        questions: readonly Question<unknown>[]
                    ) {
    
    const q = {} as Record<string, Question<unknown>>;
    for(let i = 0; i < questions.length; ++i)
        // @ts-ignore: TODO
        q[questions[i].QID] = questions[i];
    
    observe(work, () => {
        //TODO: merge info...
    });
}

const questions = getQuestions();
syncQuestions(s, questions);

//TODO: sync (?)...


const buffer = await s.export();
s.import(buffer);

const localStore = new LocalStorage(s, "test");

await localStore.save();
await localStore.load();

const file = new BrowserFile(s, ".csv");

document.querySelector(".export")!.addEventListener("click", () => {
    file.save();
});
document.querySelector(".import")!.addEventListener("click", () => {
    file.load();
});