export interface Coordinator<
                        SubjectModel,
                        ViewModel = SubjectModel
                    > {
    readonly subjectModel: SubjectModel,
    readonly    viewModel: ViewModel
}

export type CoordinatorClass<
                Config extends Record<string, any>,
                SubjectModel,
                ViewModel
        > = {
            new(config?: Partial<Config>): Coordinator<SubjectModel, ViewModel>
        };