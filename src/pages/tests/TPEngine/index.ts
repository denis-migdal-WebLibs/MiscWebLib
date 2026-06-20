import BrowserFile from "@/TPEngine/DataStore/BrowserFile";
import LocalStorage from "@/TPEngine/DataStore/LocalStorage";
import StudentWork from "@/TPEngine/StudentWork";


//import "@/TPEngine/Questions/QText";
import QText from "@/TPEngine/Questions/QText";

try {
    const x = 
        new QText({
            answer: "console.warn('ok');",
            lang  : "ts",
            score : 0.5,
            coeff : 2,
            comment: "[HERE]",
        });

    x.textContent = "Question";

    document.body.append(x);
} catch(e) {
    console.warn(e);
}

const s = new StudentWork();


const buffer = await s.export();
s.import(buffer);

const localStore = new LocalStorage(s, "test");

await localStore.save();
await localStore.load();

const file = new BrowserFile(s, ".csv");

document.querySelector(".export")!.addEventListener("click", () => {
    file.save();
});
document.querySelector(".import")!.addEventListener("click", () => {
    file.load();
});