import {useSearchParams} from "react-router";

import {useAppDispatch, useAppSelector} from "src/app/hooks";
import {PAGE_SIZE} from "src/constants/customerConstants";

import './Customer.css'
import {useQuery} from "@tanstack/react-query";
import type {CalculatedGroups, Customer} from "src/types/customerTypes.ts";
import {fetchAllCustomers} from "src/api/customerApi.ts";
import {Table} from "src/customer/components/Table.tsx";
import {useCallback, useEffect, useMemo} from "react";
import {resetChild, setActualPage, setChild, setRoot} from "src/customer/customerSlice.ts";
import {getTopData} from "src/helpers/customerHelper.ts";
import {getOthersDataByFilter, getPaginatedData, getRootCalculatedGroups} from "src/helpers/customerHelper2.ts";
import {Filter} from "src/customer/components/Filter.tsx";

export const CustomerPage = () => {
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams({filter: ''});
    const filter = searchParams.get('filter')
    const currentPage = useAppSelector(state => state.customer.actualPage)
    const pageSize = PAGE_SIZE

    const {data, isLoading} = useQuery<Customer[]>({
        queryKey: ["allCustomers"],
        queryFn: () => fetchAllCustomers(0),
    });

    const handleChangePage = useCallback((value: number) => {
        dispatch(setActualPage(value))
    }, [dispatch])

    const calculatedGroups = useAppSelector(state => state.customer.calculatedGroups)

    const lastFilterValue = useMemo(() => {
        let result
        if (filter) {
            const splitedFilter = filter.split('/')
            result = splitedFilter[splitedFilter.length - 1]
        }
        return result
    }, [filter])

    const getOthersData = useCallback((data: Customer[], calculatedGroups: CalculatedGroups, filter: string) => {
        let result = data
        if (data && filter) {
            result = getOthersDataByFilter(data, calculatedGroups, filter)
        }
        return result
    }, [])

    const filteredData = useMemo(() => {
        let result: Customer[] = data ?? []
        let count = result.length
        if (filter && filter.length > 0 && lastFilterValue && data) {

            if (lastFilterValue === 'others') {
                const othersData = getOthersData(data, calculatedGroups, filter)
                result = othersData
                count = othersData.length
            } else {
                const dataByFilter = result.filter((item) => item.psc.startsWith(lastFilterValue))
                result = dataByFilter
                count = dataByFilter.length
            }
        }
        // slice by pagination
        if (result) {
            result = getPaginatedData(result, pageSize, currentPage)
        }

        return {
            data: result,
            currentPageCount: count
        }
    }, [data, currentPage, pageSize, filter, calculatedGroups, lastFilterValue, getOthersData])

    useEffect(() => {
        // load root calculatedGroups
        if (data) {
            const root = getRootCalculatedGroups(data)
            dispatch(setRoot(root))
        }
    }, [data, dispatch]);

    useEffect(() => {
        // load calculatedGroups by filter
        const filterValues = filter?.split('/')
        if (filterValues && filterValues.length > 0) {
            filterValues.forEach((fItem, idx) => {
                let isFilterInTop = false
                if (calculatedGroups && !calculatedGroups[fItem] && fItem !== 'others') {
                    let groupItemData = calculatedGroups.root
                    const prevFilterValue = filterValues[idx - 1]
                    if (prevFilterValue && calculatedGroups && calculatedGroups[prevFilterValue] && idx > 0) {
                        groupItemData = calculatedGroups[prevFilterValue]
                    }
                    if (groupItemData) {
                        if (fItem) {
                            const findIndex = groupItemData.top.findIndex((item) => item.key === fItem)
                            if (findIndex >= 0) {
                                isFilterInTop = true
                            }
                        }
                        if (isFilterInTop) {
                            const dataForFv = getTopData(groupItemData.child[fItem], 5)
                            dispatch(setChild({
                                data: dataForFv,
                                name: fItem
                            }))
                        }
                    }
                }
            })
        }
    }, [filter, calculatedGroups, dispatch]);

    const setFilterAndActualPage = useCallback((filter: string)=>{
        setSearchParams({filter})
        dispatch(setActualPage(1))
    }, [dispatch, setSearchParams])

    const handlePressFilter = useCallback((value: string) => {
        setFilterAndActualPage(value)
    }, [setFilterAndActualPage])

    const handlePressResetFilter = useCallback(()=>{
        setFilterAndActualPage('')
        dispatch(resetChild())
    }, [dispatch, setFilterAndActualPage])

    return (
        <>
            <h1>ScoreaTest </h1>
            <div className={'content'}>
                {calculatedGroups &&
                    <Filter
                        onPressFilter={handlePressFilter}
                        onPressResetFilter={handlePressResetFilter}
                        filters={calculatedGroups}
                        currentGroupFilter={calculatedGroups.root}
                        filter={filter?.split('/')}
                        lvl={0}
                    />
                }
                {data ?
                    <Table
                        data={filteredData.data}
                        totalLength={filteredData.currentPageCount}
                        onChangePage={handleChangePage}
                        actualPage={currentPage}
                    />
                    : isLoading ?
                        <span>Loading...</span>
                        : <span> No data </span>
                }
            </div>
        </>
    )
}