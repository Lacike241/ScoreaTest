import {useCallback} from "react";
import {useSearchParams} from "react-router";

import {useAppDispatch, useAppSelector} from "src/app/hooks";
import {PAGE_SIZE} from "src/constants/customerConstants";
import {useLoadCustomers} from "src/hooks/useLoadCustomers";
import {useLoadFilters} from "src/hooks/useLoadFilters";
import {Filter} from "./components/Filter";
import {Table} from "./components/Table";
import {setActualPage} from "./customerSlice";

import './Customer.css'

export const CustomerPage = () => {
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams({filter: ''});
    const filter = searchParams.get('filter')
    const actualPage = useAppSelector(state => state.customer.actualPage)
    const pageSize = PAGE_SIZE
    const maxDynamicFilters = 5

    const {customerCount, isDataLoading, data} = useLoadCustomers(actualPage, pageSize, filter)

    useLoadFilters(customerCount, filter)

    const handlePressFilter = useCallback((value: string) => {
        setSearchParams({filter: value})
        dispatch(setActualPage(1))
    }, [dispatch, setSearchParams])

    const filters = useAppSelector(state => state.customer.calculatedGroups)

    const handleChangePage = useCallback((value: number) => {
        dispatch(setActualPage(value))
    },[dispatch])

    return (
        <>
            <h1>ScoreaTest</h1>
            {filters &&
                <Filter
                    onPressFilter={handlePressFilter}
                    filters={filters.slice(0, maxDynamicFilters - 1)}
                />
            }
            {data ?
                <Table
                    data={data}
                    totalLength={customerCount ?? 0}
                    onChangePage={handleChangePage}
                    actualPage={actualPage}
                />
                : isDataLoading ?
                    <span>Loading...</span>
                    : <span> No data </span>
            }
        </>
    )
}