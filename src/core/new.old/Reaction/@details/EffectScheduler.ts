import { Effect, EffectScheduler } from "../@contract";

export class EffectSchedulerImpl implements EffectScheduler {
    
    protected readonly pending = new Array<Effect>();

    schedule(effect: Effect) {
        this.pending.push(effect);
    }

    execute() {
        for(let i = 0; i < this.pending.length; ++i)
            this.pending[i]();
        this.pending.length = 0;
    }
}