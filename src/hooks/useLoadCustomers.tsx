import {useQuery} from "@tanstack/react-query";

import {fetchCustomerCount, fetchCustomers} from "src/api/customerApi";
import type {Customer} from "src/types/customerTypes";

export const useLoadCustomers = (page: number, pageSize: number, filterUrl: string | null)=>{
    const {data, isLoading} = useQuery<Customer[]>({
        queryKey: ["customers", page, pageSize, filterUrl],
        queryFn: () => fetchCustomers(page, pageSize,filterUrl),
    });

    const {data: customerCount} = useQuery({
        queryKey: ["customerCount", filterUrl],
        queryFn: () => fetchCustomerCount(filterUrl),
    });

    return {
        customerCount,
        isDataLoading: isLoading,
        data
    }
}