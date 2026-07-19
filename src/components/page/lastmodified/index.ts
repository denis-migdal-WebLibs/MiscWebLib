import html from "MWL@2026:core/DOM/ShadowTemplate/parsers/html";

const title = document.querySelector("h1");
if( title !== null) {

    const div = html`<div class="lastmodified"></div>`

    const date = new Date(document.lastModified).toLocaleDateString('fr-FR', { year:"numeric", month:"long", day:"numeric", hour:"2-digit", minute: "2-digit"})

    div.textContent = `Dernière modification le ${date}.`;

    title.after(div);
}