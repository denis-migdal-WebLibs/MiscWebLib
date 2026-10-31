import { ReactionEffect } from "../@contract/@types/def";

export class ReactionEffectScheduler {
    
    protected readonly pending = new Array<ReactionEffect>();

    schedule(effect: ReactionEffect) {
        this.pending.push(effect);
    }

    execute() {
        for(let i = 0; i < this.pending.length; ++i)
            this.pending[i]();
        this.pending.length = 0;
    }
}