import {html} from "MWL@2026/exports/DOM";

const title = document.querySelector("h1");
if( title !== null) {

    const div = html`<div class="lastmodified"></div>`

    const date = formatDate(new Date(document.lastModified));
    div.textContent = `Dernière modification le ${date}.`;

    title.after(div);
}

function formatDate(date: Date) {
    return date.toLocaleDateString('fr-FR', {
                        year  : "numeric",
                        month : "long",
                        day   : "numeric",
                        hour  : "2-digit", 
                        minute: "2-digit"
                    })
}