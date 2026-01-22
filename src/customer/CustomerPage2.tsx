import {useSearchParams} from "react-router";

import {useAppDispatch, useAppSelector} from "src/app/hooks";
import {PAGE_SIZE} from "src/constants/customerConstants";

import './Customer.css'
import {useQuery} from "@tanstack/react-query";
import type {CalculatedGroups, Customer} from "src/types/customerTypes.ts";
import {fetchAllCustomers} from "src/api/customerApi.ts";
import {Table} from "src/customer/components/Table.tsx";
import {useCallback, useEffect, useMemo} from "react";
import {setActualPage, setChild, setRoot} from "src/customer/customerSlice.ts";
import {getRooTop} from "src/helpers/customerHelper.ts";
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

    function startsWithButNot(value: string, requiredPrefix: string, forbiddenPrefixes: string[] = []) {
        const str = value;

        return (
            str.startsWith(requiredPrefix) &&
            !forbiddenPrefixes.some(p =>
                str.startsWith(p)
            )
        );
    }

    const getOthersData = useCallback((data: Customer[], calculatedGroups: CalculatedGroups, filter: string) => {
        let result = data
        if (data && filter) {
            const filterValues = filter.split('/')
            if (filterValues.length >= 2) {
                const fV = filterValues[filterValues.length - 2]
                if (calculatedGroups[fV]) {
                    const notStartWith = calculatedGroups[fV]?.top.map((item) => item.key)
                    result = data.filter((item) => startsWithButNot(item.psc, fV, notStartWith))
                }
            } else {
                const notStartWith = calculatedGroups.root?.top.map((item) => item.key)
                result = data.filter((item) => startsWithButNot(item.psc, '', notStartWith))
            }
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
            const start = pageSize * (currentPage - 1)
            const end = (pageSize * currentPage) - 1
            result = result.slice(start, end)
        }

        return {
            data: result,
            currentPageCount: count
        }
    }, [data, currentPage, pageSize, filter, calculatedGroups, lastFilterValue, getOthersData])

    function getRootCalculatedGroups(items: Customer[]): CalculatedGroups['root'] {
        if (!items?.length) return {
            child: {},
            top: [],
            others: []
        };
        // default PSG length to 10
        const length = 10;
        let allGroup = {};
        for (let prefixLen = 1; prefixLen < length; prefixLen++) {
            const currentGroup: Record<string, number> = {};
            for (const item of items) {
                const psc = item.psc;
                const itemPrefixLen = Math.min(psc.length, prefixLen)
                const prefix = psc.slice(0, itemPrefixLen - 1);
                currentGroup[prefix] ??= 0;
                currentGroup[prefix]++;
            }
            allGroup = allGroup ? {...allGroup, ...currentGroup} : currentGroup
        }

        const sortedArray = Object.entries<number>(allGroup)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => ({key, value}));

        return getRooTop(sortedArray, 5)
    }

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
                            const dataForFv = getRooTop(groupItemData.child[fItem], 5)
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

    const handlePressFilter = useCallback((value: string) => {
        setSearchParams({filter: value})
        dispatch(setActualPage(1))
    }, [setSearchParams, dispatch])

    return (
        <>
            <h1>ScoreaTest </h1>
            <div className={'content'}>
                {calculatedGroups &&
                    <Filter
                        onPressFilter={handlePressFilter}
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