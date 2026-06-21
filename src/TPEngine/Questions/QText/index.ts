import CodeEditor from "@/DOM/Components/code/code-editor";
import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { Fixed, Value } from "@/Reactive/Properties/Controllers";
import { WithProperties } from "@/Reactive/Properties/createProperties";
import { syncProperties } from "@/Reactive/Properties/linkProperties";
import { observeProperties, observeProperty } from "@/Reactive/Properties/observeProperties";

// we assume empty string = null, avoid handling this special case.
export const QTextProperties = {
    QID    : Fixed<string|null>(null),
    coeff  : Fixed<number|null>(null),
    answer : Value(""),
    comment: Value(""),
    lang   : Value<string|null>(null),
    score  : Value<number|null>(null),
}

const QText = defineWebComponent(
    WithProperties(QTextProperties),
    {
        name   : "q-text",
        content: __LOAD_FILE__("./index.html"),
        style  : __LOAD_FILE__("./index.css"),
        elements: {
            editor: CodeEditor,
            grade : HTMLElement,
        },
        initialize: (ctx, ctrler) => {

            const editor = ctx.elements.editor;

            if( ctrler.properties.QID === null )
                throw new Error("Question needs a QID !");

            syncProperties( ctrler, editor.controller,
                            {
                                lang  : "lang",
                                answer: "text"
                            });

            observeProperty(ctrler, "comment", () => {
                ctx.target.style.setProperty(
                                                '--comment',
                                                `"${ctrler.properties.comment}"`
                                            );
            });

            observeProperties(ctrler, ["score", "coeff"], () => {

                const grade = ctx.elements.grade;
                const coeff = ctrler.properties.coeff;

                if( coeff === null) { // not graded.

                    ctx.target.style.setProperty("--grade-color", 
                                                 "transparent");
                    grade.textContent = "";
                    return;
                }

                const score = ctrler.properties.score;

                updateGradeColor(ctx.target, score);

                const points = score === null ? "" : `${score*coeff}`;
                ctx.elements.grade.textContent = `[${points}/${coeff}]`;
            });
        }
    });

export function updateGradeColor(target: HTMLElement, score: number|null) {
    
    let gradeColor = "transparent";
    if( score !== null)
        gradeColor = `hsl(${score * 120}, 100%, 50%)`

    target.style.setProperty("--grade-color", gradeColor);
}

// not ideal...
export default QText;
export type QText = InstanceType<typeof QText>;