import { NULL_OBJ } from "MWL@2026/@exports/types";
import { Coordinator } from "../@core";

export class NullCoordinator implements Coordinator<{}> {
    readonly subjectModel = NULL_OBJ;
    readonly    viewModel = NULL_OBJ;
}