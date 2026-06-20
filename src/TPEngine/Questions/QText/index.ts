import CodeEditor from "@/DOM/Components/code/code-editor";
import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { Value } from "@/Reactive/Properties/PropertyTypes";
import WithProperties from "@/Reactive/Properties/WithProperties";
import { syncProperties } from "@/Reactive/Properties/linkProperties";
import { observeProperties, observeProperty } from "@/Reactive/Properties/observeProperties";

// we assume empty string = null, avoid handling this special case.
const QTextProperties = {
    //TODO: QID
    answer : Value(""),
    comment: Value(""),
    lang   : Value<string|null>(null),
    coeff  : Value<number|null>(null),
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

            syncProperties( ctrler, editor,
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

                let gradeColor = "transparent"

                if( coeff === null) { // not graded.

                    ctx.target.style.setProperty("--grade-color", gradeColor);
                    grade.textContent = "";
                    return;
                }

                const score = ctrler.properties.score;

                if( score !== null)
                    gradeColor = `hsl(${score * 120}, 100%, 50%)`

                ctx.target.style.setProperty("--grade-color", gradeColor);

                const points = score === null ? "" : `${score*coeff}`;
                ctx.elements.grade.textContent = `[${points}/${coeff}]`;
            });
        }
    });

// not ideal...
export default QText;
export type QText = InstanceType<typeof QText>;