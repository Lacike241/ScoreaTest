import {useQuery} from "@tanstack/react-query";

import {fetchCustomerCount} from "src/api/customerApi";

export const useLoadAllCustomersCount = ()=>{
    const {data: allCustomerCount} = useQuery({
        queryKey: ["customerCount"],
        queryFn: () => fetchCustomerCount(),
    });

    return {
        allCustomerCount
    }
}