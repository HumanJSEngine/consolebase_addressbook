export interface Person {
    name: string;
    site: string;
    number: string;
}

export interface pageParams {
    perPage: number;
    curPage: number;
}


export interface Mode {
    searchModePaginate: Person;
    idxInfo:Person;
    searchCondition: Person;
    tempPerson: Person;
    idx: string;
    master: number;
    slave: number;
    modify: number;
    pageParams : pageParams
}
