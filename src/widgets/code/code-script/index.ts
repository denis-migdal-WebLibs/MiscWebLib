import { defineWidget, Coordinator, View } from "MWL@2026/exports/DOM/Widget";
import { WithProperties } from "MWL@2026/exports/Reactive/PropertySystem";
import { Fixed } from "MWL@2026/exports/Reactive/PropertySystem/controllers";
import { hl } from "../hl";

const Script = defineWidget(
    "code-script",
    Coordinator(WithProperties({
            // we assume that the script content should not be modified.
            text: Fixed(""),
            lang: Fixed("text"),
        }) ),
    View({
        style: [
            __LOAD_FILE__("../Tomorrow.css"),
            __LOAD_FILE__("./index.css"),
        ],
        setup(ctrler) {

            let text   = ctrler.text;
            const lang = ctrler.lang;

            if(text[0] === '\n') {
                this.target.classList.toggle("block", true);
                text = unindent(text);
            }

            // else causes issue with live server
            if(lang === "html") {
                text = text.replace("<xbody>", "</body>");
                text = text.replace("<xscript>", "</script>");
            }
            
            this.root.innerHTML = raw2html(text, lang);
        }
    })
);

export function unindent(code: string) {
    const offset = code.search(/[\S]/);
    const indent = code.slice(1, offset);

    code = code.replaceAll("\n" + indent, "\n");

    const end = code.lastIndexOf('\n');
    code = code.slice(1, end);

    return code;
}

export function keepSpaces(code: string) {
    code = code.replaceAll('\n', '<br/>\n')
               .replaceAll('  ', '&nbsp;&nbsp;')
               .replaceAll('> ', '>&nbsp;')
               .replaceAll(' <', '&nbsp;<')
               .replaceAll('\n ', '\n&nbsp;');

    return code;
}

export function raw2html(code: string, codeLang: string) {

    const replaced: string[] = [];
    code = code.replaceAll(/\<h\>(.*?)\<\/h\>/g, (_, match) => {
        replaced.push(match);
        return `__${replaced.length-1}__`
    });

    code = hl(code, codeLang);

    code = code.replaceAll(/__([\d]*)__/g, (_, match) => {

        let content = replaced[+match];
        content = content.replaceAll(/(\$[\w_]*)/g, (_, match) => {
            return `<var>${match}</var>`
        });

        return `<h>${content}</h>`;
    });

    return keepSpaces(code); // due to stupid FF bug.
}


for(let script of document.querySelectorAll('script[type^="c-"]') ) {

    const code = new Script({
        text: script.textContent!,
        lang: script.getAttribute("type")!.slice(2)
    })

    const attrs = script.attributes;
    for(let attr of attrs)
        code.setAttribute(attr.name, attr.value);

    script.replaceWith(code);
}