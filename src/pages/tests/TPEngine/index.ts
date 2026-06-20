import BrowserFile from "@/TPEngine/DataStore/BrowserFile";
import LocalStorage from "@/TPEngine/DataStore/LocalStorage";
import StudentWork, { Question } from "@/TPEngine/StudentWork";

import "@/TPEngine/Questions/QText";

function getQuestions() {
    type QuestionElement = HTMLElement & {
        readonly properties: Question<unknown>
    };

    return [...document.querySelectorAll<QuestionElement>("q-text")].map( e => {
        console.warn(JSON.stringify({...e.properties}));
        return e.properties
    });
}

const questions = getQuestions();

const s = new StudentWork();


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