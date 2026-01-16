import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

import {fetchCustomerPostcodes} from "src/api/customerApi";
import {useAppDispatch} from "src/app/hooks";
import {setCalculatedGroups} from "src/customer/customerSlice";
import {getCalculatedGroups} from "src/helpers/customerHelper.ts";

export const useLoadFilters = (customerCount: number = 0, filter: string | null) => {
    const dispatch = useAppDispatch()
    const {data, isLoading, error} = useQuery({
        queryKey: ["dynamicFilters", customerCount],
        queryFn: () => fetchCustomerPostcodes(customerCount),
    });

    useEffect(() => {
        if (data) {
            const calculatedPscData = getCalculatedGroups(data, filter)
            if (calculatedPscData) {
                dispatch(setCalculatedGroups(calculatedPscData))
            }
        }
    }, [dispatch, data, filter]);

    return {
        isFiltersLoading: isLoading,
        filtersError: error
    }
}