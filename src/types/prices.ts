
export type TPricesGetDaysPlanRisk = {
    id:string;
    numberDay:number;
    price:number;
}

export type RiskPrices = {
    id:string;
    name:string;
    days: TPricesGetDaysPlanRisk[];
}

export type TPricesGetPlanRisk = {
    version_plan_id:string;
    risks: RiskPrices[]
}

export type TParamsPricesGetPlanRisk = {
    risk_id:string;
    planId:string;
}