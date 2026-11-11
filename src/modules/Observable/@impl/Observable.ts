import { CALLBACKS } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";
import { ObservableDetails } from "../@contract";
import { Observable } from "../@contract/@types";

const Observable: ObservableDetails["Observable"]
    = class implements Observable {
        readonly [CALLBACKS] = null;
    }

export {Observable};