import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";

import {fetchCustomerPostcodes} from "src/api/customerApi";
import {useAppDispatch} from "src/app/hooks";
import {setRoot} from "src/customer/customerSlice";
import {getCalcGroups} from "src/helpers/customerHelper.ts";

export const useLoadFilters = (customerCount: number = 0) => {
    const dispatch = useAppDispatch()
    const {data, isLoading, error} = useQuery({
        queryKey: ["dynamicFilters", customerCount],
        queryFn: () => fetchCustomerPostcodes(customerCount),
    });

    useEffect(() => {
        if (data) {
            const newCalculatedData = getCalcGroups(data)
            if(newCalculatedData){
                dispatch(setRoot(newCalculatedData))
            }
        }
    }, [dispatch, data]);

    return {
        isFiltersLoading: isLoading,
        filtersError: error
    }
}