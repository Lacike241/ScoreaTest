import {useCallback, useMemo} from "react";
import {useSearchParams} from "react-router";

import {useAppDispatch, useAppSelector} from "src/app/hooks";
import {PAGE_SIZE} from "src/constants/customerConstants";
import {useLoadCustomers} from "src/hooks/useLoadCustomers";
import {useLoadFilters} from "src/hooks/useLoadFilters";
import {useLoadAllCustomersCount} from "src/hooks/useLoadAllCustomersCount.tsx";
import {Filter} from "src/customer/components/Filter.tsx";
import {Table} from "./components/Table";
import {setActualPage} from "./customerSlice";

import './Customer.css'
import type {GroupItem} from "src/types/customerTypes.ts";
import {getFilterUrlFromTopData} from "src/helpers/customerHelper.ts";

export const CustomerPage = () => {
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams({filter: ''});
    const filter = searchParams.get('filter')
    const actualPage = useAppSelector(state => state.customer.actualPage)
    const pageSize = PAGE_SIZE

    const {allCustomerCount} = useLoadAllCustomersCount()

    const filters = useAppSelector(state => state.customer.calculatedGroups)

    const filterUrl = useMemo(() => {
        const filterValues = filter?.split('/')
        let resultUrl = ''
        if (filterValues) {
            const lastFilterValue = filterValues[filterValues.length - 1]
            resultUrl =`(psc%20begins%20'${lastFilterValue}')`
            if (lastFilterValue === 'others') {
                if (filterValues.length >= 2) {
                    const fV = filterValues[filterValues.length - 2]
                    const fVTop: GroupItem['top'] = filters[fV]?.top
                    resultUrl = getFilterUrlFromTopData(fVTop, fV)
                }else {
                    const fVTop: GroupItem['top'] = filters.root?.top
                    resultUrl = getFilterUrlFromTopData(fVTop)
                }
            }
        }
        return resultUrl
    }, [filter, filters])

    const {customerCount, isDataLoading, data} = useLoadCustomers(
        actualPage, pageSize, filterUrl
    )

    useLoadFilters(allCustomerCount, filter)

    const handlePressFilter = useCallback((value: string) => {
        setSearchParams({filter: value})
        dispatch(setActualPage(1))
    }, [dispatch, setSearchParams])

    const handleChangePage = useCallback((value: number) => {
        dispatch(setActualPage(value))
    }, [dispatch])

    return (
        <>
            <h1>ScoreaTest</h1>
            <div className={'content'}>
                {filters &&
                    <Filter
                        onPressFilter={handlePressFilter}
                        filters={filters}
                        currentGroupFilter={filters.root}
                        filter={filter?.split('/')}
                        lvl={0}
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
            </div>
        </>
    )
}