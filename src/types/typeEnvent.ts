export type CreateTypeEventBody = {
    name:string;
    risk_id:string;
}

export type UpdateTypeEventBody = {
    id:string;
    name:string;
    risk_id:string;
    status:boolean;
}