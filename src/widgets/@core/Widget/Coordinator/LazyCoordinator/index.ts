import { NULL_OBJ } from "MWL@2026/@exports/types";
import { Coordinator } from "../@core";
import { getModelFactory, ModelProvider } from "../@core/ModelProvider";

export function LazyCoordinator<
                            Config extends Record<string, any>,
                            T extends object
                        >(modelProvider: ModelProvider<Config, T>) {

    const modelFactory = getModelFactory(modelProvider);

    return class LazyCoordinator implements Coordinator<
                                                T,
                                                (args: Partial<Config>) => T
                                            > {

        presentationModel: T|null = null;

        readonly viewModel: (args: Partial<Config>) => T;

        constructor(config: Partial<Config> = NULL_OBJ) {

            this.viewModel = (args: Partial<Config>) => {
                args = Object.assign({}, args, config);
                return this.presentationModel = modelFactory(args);
            };
        }

        get subjectModel() {
            __ASSERT__(this.presentationModel !== null,
                        "viewModel MUST be called!");
            return this.presentationModel
        }
    }
}