import {useCallback, useEffect, useMemo} from "react";
import {useSearchParams} from "react-router";

import {useAppDispatch, useAppSelector} from "src/app/hooks";
import {PAGE_SIZE} from "src/constants/customerConstants";
import {DataInfo} from "src/customer/components/DataInfo";
import {Filter} from "src/customer/components/Filter";
import {getChildForTop, getDataForRoot, getFilterUrlFromTopData} from "src/helpers/customerHelper";
import {useLoadCustomers} from "src/hooks/useLoadCustomers";
import {useLoadFilters} from "src/hooks/useLoadFilters";
import {useLoadAllCustomersCount} from "src/hooks/useLoadAllCustomersCount";
import type {GroupItem} from "src/types/customerTypes";
import {Table} from "./components/Table";
import {setActualPage, setChild} from "./customerSlice";

import './Customer.css'

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
        let resultUrl: string | null = ''
        if (filterValues) {
            const lastFilterValue = filterValues[filterValues.length - 1]
            resultUrl = `(psc%20begins%20'${lastFilterValue}'`
            if (lastFilterValue.length > 3) {
                resultUrl += `%20or%20psc%20begins%20'${lastFilterValue.slice(0, 3)}%20${lastFilterValue.slice(3)}')`
            } else {
                resultUrl += ')'
            }
            if (lastFilterValue === 'others') {
                if (filterValues.length >= 2) {
                    const fV = filterValues[filterValues.length - 2]
                    const fVTop: GroupItem['top'] = filters[fV]?.top
                    resultUrl = getFilterUrlFromTopData(fVTop, fV)
                } else {
                    const fVTop: GroupItem['top'] = filters.root?.top
                    resultUrl = getFilterUrlFromTopData(fVTop)
                }
            } else if (lastFilterValue === '') {
                resultUrl = null
            }
        }
        return resultUrl
    }, [filter, filters])

    const {customerCount, isDataLoading, data} = useLoadCustomers(
        actualPage, pageSize, filterUrl
    )

    useLoadFilters(allCustomerCount)

    const calculatedGroups = useAppSelector(state => state.customer.calculatedGroups)

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
                            const sortedArray = groupItemData.child[fItem]
                            const {rootData, othersData} = getDataForRoot(sortedArray, 5)
                            const {children, others} = getChildForTop(othersData, rootData)
                            dispatch(setChild({
                                data: {
                                    child: children,
                                    others,
                                    top: rootData
                                },
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
    }, [dispatch, setSearchParams])

    const handleChangePage = useCallback((value: number) => {
        dispatch(setActualPage(value))
    }, [dispatch])

    return (
        <>
            <h3>ScoreaTest - Zoznam zákazníkov</h3>
            <DataInfo filter={filter} customerCount={customerCount} />
            <div className={'content'}>
                {filters &&
                    <Filter
                        onPressFilter={handlePressFilter}
                        filters={filters}
                        currentGroupFilter={filters.root}
                        filter={filter?.split('/')}
                        lvl={0}
                        allCustomerCount={allCustomerCount}
                    />
                }
                <div className="container">
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
            </div>
        </>
    )
}