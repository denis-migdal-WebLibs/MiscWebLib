import CodeEditor from "@/DOM/Components/code/code-editor";
import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import createPropertiesFactory from "@/Reactive/Properties/createPropertiesFactory";
import { Value } from "@/Reactive/Properties/PropertyTypes";

//TODO: extract...
const QTextProperties = createPropertiesFactory({
    answer: Value(""),
    lang  : Value(null as null|string),
});

const QText = defineWebComponent(class QText {

        //TODO: WithProperties...
        readonly properties: ReturnType<typeof QTextProperties>;

        constructor(opts: {answer?: string, lang?: string|null}) {
            this.properties = QTextProperties(opts);
        }

    }, {
        name   : "q-text",
        content: __LOAD_FILE__("./index.html"),
        style  : __LOAD_FILE__("./index.css"),
        elements: {
            editor: CodeEditor
        },
        initialize: (ctx, ctrler) => {

            ctx.elements.editor.properties.lang=  ctrler.properties.lang;
            ctx.elements.editor.properties.text = ctrler.properties.answer; 

            //TODO: RefreshRules...
        }
    });

export default QText;

/*
import computedLink from "@MWL/events/links/computedLink";
import link from "@MWL/events/links/link";

       const html = require('!!raw-loader!./index.html').default as string;
export const css  = require('!!raw-loader!./index.css' ).default as string;

const DEFAULTS = {
    answer: null as null|string,
    meta  : null as null|AnswerMeta
}

class QText extends LISSBase.WithContent( template(html) )
                            .WithStyle  ( style(css) )
                            .WithInput (DEFAULTS)
                            .WithOutput(DEFAULTS) {

    // === HTML Elements ===
    readonly pts       = +this.host.getAttribute("pts")!;
    readonly el_answer = this.content.querySelector<CodeEditor>(".answer")!;
    readonly el_grade  = this.content.querySelector<HTMLElement>(".grade" )!;

    constructor() {
        super();

        // init...
        const codeLang   = this.host.getAttribute('code-lang');
        if( codeLang !== null )
            this.el_answer.setAttribute('code-lang', codeLang);

        // link input
        this.parsedInput.addListener( () => this.updateGUI() );
        computedLink(this.parsedInput, this.el_answer.inputSignal,
                    () => {
                        return {
                            value: this.parsedInput.value.answer ?? ""
                        }
                    });

        // link output
        computedLink(this.el_answer.outputSignal,
                     this.outputSignal,
                        () => {
                            return {
                                answer: this.el_answer.output.value,
                                meta  : this.input.meta
                            }
                        }
                    );

        // editor link
        link(this.parsedInput, this.outputSignal);
    }

    updateGUI(): void {

        const meta = this.input.meta;

        setGlobalGrade(this.el_grade, meta, this.pts,
                            (grade) => grade*this.pts);
        setAnswerColor(this.el_answer, meta?.grade);
        setComment    (this.el_answer, meta);
    }
}

define(QText);

// ========================================
// ============== helpers =================
// ========================================

export function setComment(target: HTMLElement, meta: AnswerMeta|null) {

    const comment = meta === null ? "" : meta.comment;

    if(comment === "")
        target.removeAttribute("comment");
    else
        target.setAttribute("comment", comment);
}

export function setGlobalGrade(target: HTMLElement, meta: AnswerMeta|null, max: number, pts: (grade: number) => number) {

    if( max === 0)
        return;

    const score = meta === null ? "" : `${pts(meta.grade)}`;
    target.textContent = `[${score}/${max}]`;
}

export function setAnswerColor(target: HTMLElement, grade: number|undefined) {

    if( grade == undefined) {
        target.removeAttribute('grade');
    } else if(grade === 0) {
        target.setAttribute('grade', "0");
    } else if(grade === 1) {
        target.setAttribute('grade', "1");
    } else if(grade <= 0.5) {
        target.setAttribute('grade', "<=.5");
    } else if(grade >  0.5) {
        target.setAttribute('grade', ">.5");
    }
}
*/