import {useQuery} from "@tanstack/react-query";

import {fetchCustomerCount, fetchCustomers} from "src/api/customerApi";
import type {Customer} from "src/types/customerTypes";

export const useLoadCustomers = (page: number, pageSize: number, filter: string | null)=>{
    const {data, isLoading} = useQuery<Customer[]>({
        queryKey: ["customers", page, pageSize, filter],
        queryFn: () => fetchCustomers(page, pageSize, filter),
    });

    const {data: customerCount} = useQuery({
        queryKey: ["customerCount", filter],
        queryFn: () => fetchCustomerCount(filter),
    });

    return {
        customerCount,
        isDataLoading: isLoading,
        data
    }
}