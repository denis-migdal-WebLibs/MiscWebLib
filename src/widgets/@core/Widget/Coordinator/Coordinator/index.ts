import { NULL_OBJ } from "MWL@2026/@exports/types";
import { getModelViewFactory, ModelViewProvider } from "../@core/ModelViewProvider";
import { getModelFactory, ModelProvider } from "../@core/ModelProvider";
import { CoordinatorClass } from "../@core";

type CoordinatorOpts<
                        T extends object,
                        SubjectModel = T,
                            ViewModel = T,
                    > = {
    subjectModel?: ModelViewProvider<NoInfer<T>, SubjectModel>,
       viewModel?: ModelViewProvider<NoInfer<T>,    ViewModel>,
};

// explicit return type annotation required.
export function Coordinator<
                        Config extends Record<string, any>,
                        T extends object,
                        SubjectModel = T,
                           ViewModel = T,
                >(
                    modelProvider: ModelProvider<Config, T>,
                    opts: CoordinatorOpts<T, SubjectModel, ViewModel> = NULL_OBJ
                ): CoordinatorClass<Config, SubjectModel, ViewModel> {

    const viewModel    = getModelViewFactory(opts.viewModel);
    const subjectModel = getModelViewFactory(opts.subjectModel);

    const modelFactory = getModelFactory(modelProvider);

    // we need static informations...
    return class Coordinator {

        readonly presentationModel;

        constructor(config: Partial<Config> = NULL_OBJ) {
            this.presentationModel = modelFactory(config);
        }

        get    viewModel() { return    viewModel(this.presentationModel) }
        get subjectModel() { return subjectModel(this.presentationModel) }
    }
}