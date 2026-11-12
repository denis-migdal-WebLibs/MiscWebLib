import { NULL_OP } from "MWL@2026/modules/@types";
import {Renderer} from "../@contract/@types/def";

const Renderer = class implements Renderer {

        after = NULL_OP;
        readonly conds   = new Array<() => boolean>();
        readonly effects = new Array<() => void   >();

        addRule(cond: () => boolean, effect: () => void) {
            this.conds  .push(cond);
            this.effects.push(effect);
        }

        afterRender(after: () => void) {
            this.after = after;
        }

        render() {

            let rendered = false;

            for(let i = 0; i < this.effects.length; ++i)
                if( this.conds[i]() ) {
                    this.effects[i]();
                    rendered = true;
                }

            if( rendered )
                this.after();
        }
    }

export {Renderer};