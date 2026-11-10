import { PropertiesRenderer } from "../@contract/@types/def";
import { Property } from "../../Property/@contract/@types/def";
import { PropertiesRendererDetails } from "../@contract";
import { Renderer } from "./Renderer";
import { WithProperties } from "../../Property/@contract/@types/WithProperties";
import { getProperties, getPropertiesKeys } from "../../Property/@impl/Helpers/WithProperties";
import { getVersion } from "../../Reaction";

// 1. get nodes => get versions.
// 2. store versions... (flip ?).

const PropertiesRenderer: PropertiesRendererDetails["PropertiesRenderer"]
    = class <T extends Record<string, Property<any>>>
                                implements PropertiesRenderer<T> {

        readonly renderer = new Renderer();
        readonly changed      = new Array<boolean>();
        readonly prevVersions = new Array<number>();

        readonly keys      : ReadonlyArray<string>;
        readonly properties: ReadonlyArray<Property<unknown>>;

        constructor(target: WithProperties<T>) {
            
            this.keys       = getPropertiesKeys(target);
            this.properties = getProperties(target);

            this.changed.length = this.keys.length;
            this.prevVersions.length = this.keys.length;

            this.prevVersions.fill(-1); // -1 for initial call.
        }

        addRule(keys: readonly Extract<keyof T, string>[], effect: () => void) {

            const idx = new Array<number>(keys.length);
            for(let i = 0; i < keys.length; ++i)
                idx[i] = this.keys.indexOf(keys[i]);

            const cond = () => {

                for(let i = 0; i < idx.length; ++i)
                    if( this.changed[i] )
                        return true;

                return false;
            };

            this.renderer.addRule(cond, effect);
        }

        afterRender(after: () => void) { this.renderer.afterRender(after); }

        render() {

            for(let i = 0; i < this.changed.length; ++i) {
                const curVersion     = getVersion(this.properties[i]);
                this.changed[i]      = this.prevVersions[i] < curVersion;
                this.prevVersions[i] = curVersion;
            }

            return this.renderer.render();
        }
    }

export {PropertiesRenderer};