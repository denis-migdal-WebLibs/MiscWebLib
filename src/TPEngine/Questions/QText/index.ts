import CodeEditor from "@/DOM/Components/code/code-editor";
import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { Value } from "@/Reactive/Properties/PropertyTypes";
import WithProperties from "@/Reactive/Properties/WithProperties";
import { syncProperties } from "@/Reactive/Properties/linkProperties";

const QTextProperties = {
    answer: Value(""),
    lang  : Value(null as null|string),
}

const QText = defineWebComponent(
    WithProperties(QTextProperties),
    {
        name   : "q-text",
        content: __LOAD_FILE__("./index.html"),
        style  : __LOAD_FILE__("./index.css"),
        elements: {
            editor: CodeEditor
        },
        initialize: (ctx, ctrler) => {

            syncProperties( ctrler, ctx.elements.editor,
                            {
                                lang  : "lang",
                                answer: "text"
                            });

            console.warn("end");
            //TODO: RefreshRules...
        }
    });

export default QText;

/*
    // === HTML Elements ===
    readonly pts       = +this.host.getAttribute("pts")!;
    readonly el_grade  = this.content.querySelector<HTMLElement>(".grade" )!;

    updateGUI(): void {

        const meta = this.input.meta;

        setGlobalGrade(this.el_grade, meta, this.pts,
                            (grade) => grade*this.pts);
        setAnswerColor(this.el_answer, meta?.grade);
        setComment    (this.el_answer, meta);
    }
}

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