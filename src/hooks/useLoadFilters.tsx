import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

import {fetchCustomerPostcodes} from "src/api/customerApi";
import {useAppDispatch} from "src/app/hooks";
import {setCalculatedGroups} from "src/customer/customerSlice";

export const useLoadFilters = (customerCount: number = 0, filter: string | null) => {
    const dispatch = useAppDispatch()
    const {data, isLoading, error} = useQuery({
        queryKey: ["dynamicFilters", customerCount, filter],
        queryFn: () => fetchCustomerPostcodes(customerCount, filter),
    });

    useEffect(() => {
        if (data) {
            dispatch(setCalculatedGroups(data))
        }
    }, [dispatch, data]);

    return {
        isFiltersLoading: isLoading,
        filtersError: error
    }
}