import CodeEditor from "@/DOM/Components/code/code-editor";
import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { Value } from "@/Reactive/Properties/Controllers";
import { WithProperties } from "@/Reactive/Properties/createProperties";
import { syncProperties } from "@/Reactive/Properties/linkProperties";
import { baseStyle, observeMeta, QProperties } from "../core/base";

// we assume empty string = null, avoid handling this special case.
export const QTextProperties = {
    ...QProperties(""),
    lang   : Value<string|null>(null),
}

export default defineWebComponent(
    WithProperties(QTextProperties),
    {
        name   : "q-text",
        content: __LOAD_FILE__("./index.html"),
        style  : baseStyle,
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

            observeMeta(ctx, ctrler, true);
        }
    });