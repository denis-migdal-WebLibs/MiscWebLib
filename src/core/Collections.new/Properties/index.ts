import { PropertiesFactory } from "./@contrat";
import {PropertiesFactoryImpl} from "./@details/Properties";

const Properties: PropertiesFactory = PropertiesFactoryImpl;

export {Properties};


export {updateProperties} from "./@services/updateProperties";