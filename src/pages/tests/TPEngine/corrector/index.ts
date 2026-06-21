import { resolve } from "@/DOM/ElementsResolver";
import { observeChanges } from "@/Reactive/Observers/observe";
import ObserverRegistry from "@/Reactive/Observers/ObserverRegistry";
import { updateProperties } from "@/Reactive/Properties/createProperties";
import BrowserFile from "@/TPEngine/DataStore/BrowserFile";
import LocalStorage from "@/TPEngine/DataStore/LocalStorage";
import Pager from "@/TPEngine/Pager";
import QGText from "@/TPEngine/QuestionGrader/QText";
import SessionData from "@/TPEngine/SessionData";


const elems = resolve(document.body, {
                        importBtn  : HTMLElement,
                        exportBtn  : HTMLElement,
                        iframe     : HTMLIFrameElement,
                        pager      : Pager,
                        answersArea: HTMLElement,
                    });

const session = new SessionData();


function updateSubjectPage(url: string, corrige: ArrayBuffer) {

        // need to wait the page to load in order to push the corrige.
        elems.iframe.addEventListener("load", () => {
            elems.iframe.contentWindow!.postMessage({
                type: "corrige",
                value: corrige }, "*");
        }, {once: true});

        elems.iframe.src = url;
}

// set subject...
observeChanges(session, async function() {
    if( this.origin !== localStore && this.origin !== file )
        return;

    // update subject
    updateSubjectPage(session.subjectURL!, await session.corrige!.export())

    updateProperties(elems.pager.properties, {
        cur: 0,
        max: session.corrige!.nbQuestions,
    });
    /*
        this.#filter.updateFilter(content.rendus.map( r => r.student_id ));
    */
})

//TODO...
const localStore = new LocalStorage(session, "y");
await localStore.load();

observeChanges(session, async function() {
    if( this.origin === localStore) return;

    await localStore.save();
});

const file = new BrowserFile(session, ".zip");
elems.importBtn.addEventListener("click", () => file.load() );
elems.exportBtn.addEventListener("click", () => file.save() );


const observers = new ObserverRegistry();

observeChanges(elems.pager.properties, () => {

    const QID = session.corrige!.getQuestionID( elems.pager.properties.cur );
    
    elems.iframe.contentWindow?.postMessage({
                                                type: "highlight",
                                                value: QID
                                            }, "*");

    const fields = new Array<HTMLElement>();

    observers.clear();

    //TODO: merge...
    for(const student in session.rendus) {
        const rendu = session.rendus[student];
        
        const answer = rendu.getQuestionData(QID);

        const qg = new QGText(answer as any);

        observers.observeChanges(qg.properties, () => {
            // @ts-ignore
            rendu.setQuestionData(qg.properties, observers)
        });

        fields.push( qg );
    }
    elems.answersArea.replaceChildren(...fields);
});