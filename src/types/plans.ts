import type { CoverageGetAtt } from "./coverage";

export type DaysPlanRisk = {
    numberDay:number;
    price:number;
    id?:string;
}

export type RiskPlan = {
    days: DaysPlanRisk[];
    id:string;
    name?:string;
    active?:boolean;
}

export type CoveragePlan =  {
    price:number;
    coverage_id:string;
}

export type CoveragePlanAttributes = CoverageGetAtt & {
    price:number;
}


export type PlanCreateAtt = {
    name:string;
    risks: RiskPlan[];
    coveragesSelected: CoveragePlan[];
    typeEventsSelected: {event_id:string}[];
    restrictionPrice:number
}

export type TCreateVersionPlan = {
    name:string;
    id: string;
    risks: RiskPlan[];
    status: boolean;
    coveragesSelected: CoveragePlan[];
    typeEventsSelected: {event_id:string}[];
    restrictionPrice:number
}

export type PlanUpdateAtt = {
    name?:string;
    restrictionPrice?:number;
    id:string;
    status?:boolean;
}

export type PlanGetAttributes = {
    id:string;
    name:string;
    restrictionPrice:number;
    status:boolean;
    version_id:string;
    eventPlans: {id:string;name:string;}[];
    coverages: {id:string;name:string;price:number}[];
}

export type TCoverageGetPlan = {
    name:string;
    price:number;
    id:string;
}

export type PlanCotizador = {
    planId:string;
    risk_id:string;
    planName:string;
    riskName:string;
    coverages: TCoverageGetPlan[];
    restriction:number;
    price:number;
}

export type TParamsPlanCotizador = {
    eventId:string;
    numberDays:number;
    risk_id:string;
}

export type TBodyCotizador = {
    event_name:string;
    event_id:string;
    cant_personas: number;
    fec_desde:string;
    fec_hasta:string;
    days:number;
    risk_id:string;
}
