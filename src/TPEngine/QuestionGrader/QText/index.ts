import CodeEditor from "@/DOM/Components/code/code-editor";
import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { updateProperties } from "@/Reactive/Properties/PropertiesStore";
import WithProperties from "@/Reactive/Properties/WithProperties";
import { QTextProperties, updateGradeColor } from "@/TPEngine/Questions/QText";

const QGText = defineWebComponent(
    WithProperties(QTextProperties), {
    name: "qg-text",
    content: __LOAD_FILE__("./index.html"),
    style  : __LOAD_FILE__("./index.css"),
    elements: {
        editor : CodeEditor,
        comment: HTMLElement,
        score  : HTMLInputElement,
    },
    initialize: (ctx, ctrler) => {

        // no sync: WE are the one pushing changes.

        const comment = ctx.elements.comment;
        comment.textContent = ctrler.properties.comment;
        comment.addEventListener("input", () => {
            ctrler.properties.comment = comment.textContent;
        });

        const scoreInput = ctx.elements.score;

        const score = ctrler.properties.score;
        updateGradeColor(ctx.target, score);
        scoreInput.value = `${score}`;

        scoreInput.addEventListener("input", () => {
            const score = +scoreInput.value;
            ctrler.properties.score = score;
            updateGradeColor(ctx.target, score);
        });

        updateProperties(ctx.elements.editor.properties, {
            lang: ctrler.properties.lang,
            text: ctrler.properties.answer
        });
    }
})

export default QGText;