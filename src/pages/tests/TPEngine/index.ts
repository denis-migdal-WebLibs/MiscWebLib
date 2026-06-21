import "@/TPEngine/Questions/QText";

import BrowserFile from "@/TPEngine/DataStore/BrowserFile";
import LocalStorage from "@/TPEngine/DataStore/LocalStorage";
import StudentWork, { Question } from "@/TPEngine/StudentWork";

import { observe, observeChanges } from "@/Reactive/Event";
import { updateProperties } from "@/Reactive/Properties/PropertiesStore";
import { resolve } from "@/DOM/ElementsResolver";

const elems = resolve(document.body, {
                            "importBtn": HTMLElement,
                            "exportBtn": HTMLElement
                        });

function getQuestions() {
    type QuestionElement = HTMLElement & {
        readonly properties: Question<unknown>
    };

    return [...document.querySelectorAll<QuestionElement>("q-text")];
}

const s = new StudentWork();

//TODO...
const localStore = new LocalStorage(s, "x");
await localStore.load();

observeChanges(s, async function() {
    if( this.origin === localStore) return;

    await localStore.save();
});

function syncQuestions(
                        work     : StudentWork,
                        questions: readonly Question<unknown>[]
                    ) {
    
    for(let i = 0; i < questions.length; ++i) {
        observeChanges(questions[i], function() {
            if( this.origin === work) return;

            // this is easier to use the same origin.
            work.setQuestionData(questions[i], questions);
        });
    }

    observe(work, function () {

        if( this.origin === questions ) return;

        for(let i = 0; i < questions.length; ++i) {

            const data = work.getQuestionData(questions[i].QID);
            if( data === null )
                continue;

            //TODO: update fonction or something ?
            const update = {...data};
            // @ts-ignore
            delete update.QID;
            // @ts-ignore
            delete update.coeff;

            updateProperties(questions[i], update, work);
        }
    });
}

const questions = getQuestions();
syncQuestions(s, questions.map(e => e.properties));

const file = new BrowserFile(s, ".answer");
elems.importBtn.addEventListener("click", () => file.load() );
elems.exportBtn.addEventListener("click", () => file.save() );


// highlight
addEventListener("message", (e) => {

    if( typeof e.data === "string" )
        return; // setImmediate junk.

    if( e.data.type === "highlight" ) {
        highlight(e.data.value);
        return;
    }
})

function highlight(QID: string) {

    document.querySelector(".answer_highlight")?.classList.remove("answer_highlight");

    const q = questions.find( (e) => e.properties.QID === QID);
    if( q === undefined)
        return;

    q.classList.add('answer_highlight');

    //const vh = document.documentElement.clientHeight;
    const ah = q.clientHeight;

    document.querySelector("main")!.scrollTo({
        top: q.offsetTop - (document.documentElement.clientHeight / 2 + ah / 2),
        behavior: "instant"
    });
}