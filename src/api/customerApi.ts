import type {Customer, Data} from "src/types/customerTypes";


const DEFAULT_URL = 'https://demo.flexibee.eu/v2/c/demo/adresar'

// fetch customers by page
export const fetchCustomers = async (
    page: number,
    pageSize: number,
    filterUrl: string | null,
): Promise<Customer[]> => {
    const res = await fetch(`${DEFAULT_URL}/${filterUrl}.json?detail=custom:psc,nazev,kod&limit=${pageSize}&start=${pageSize * (page - 1)}`);
    // const res = await fetch(`${DEFAULT_URL}/(psc%20begins%20'${filter}').json?detail=custom:psc,nazev,kod&limit=${pageSize}&start=${pageSize * (page - 1)}`);
    if (!res.ok) throw new Error("Failed to fetch customers");
    const data: Data = await res.json();
    return data?.winstrom?.adresar ?? []
};

// fetch customerCount
export const fetchCustomerCount = async (filterUrl?: string | null): Promise<number> => {
    const res = await fetch(`${DEFAULT_URL}${filterUrl ? '/' + filterUrl : ''}.json?add-row-count=true`);
    // const res = await fetch(`${DEFAULT_URL}/(psc%20begins%20'${filter}').json?add-row-count=true`);
    if (!res.ok) throw new Error("Failed to fetch count of customers");
    const data: Data = await res.json();
    let result = 0;
    if (data?.winstrom && data?.winstrom["@rowCount"]) {
        result = +data.winstrom["@rowCount"]
    }
    return result
};

// fetch customerPostCodes
export const fetchCustomerPostcodes = async (limit: number): Promise<Customer[]> => {
    const res = await fetch(`${DEFAULT_URL}.json?detail=custom:psc&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch post codes");
    const data: Data = await res.json();
    let result: Customer[] = []
    if (data?.winstrom?.adresar) {
        result = data.winstrom.adresar
    }
    return result
};


export const fetchAllCustomers = async (limit: number): Promise<Customer[]> => {
    const res = await fetch(`${DEFAULT_URL}.json?detail=custom:psc,nazev,kod&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch customers");
    const data: Data = await res.json();
    // normalize psc data
    let resultData = data?.winstrom?.adresar ?? []
    if(resultData.length > 0){
        resultData = resultData?.map(r => ({
            ...r,
            psc: r.psc.replace(/\s+/g, ''),
        }))
    }
    return resultData
};