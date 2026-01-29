import React from "react";

import {sumUniqueValuesByPrefix} from "src/helpers/customerHelper";
import type {CalculatedGroups, GroupItem} from "src/types/customerTypes";
import {FilterItem} from "./FilterItem";

interface Props {
    filters: CalculatedGroups
    currentGroupFilter: GroupItem
    onPressFilter: (value: string) => void
    filter: string[]
    lvl: number
    prevKey?: string
    allCustomerCount?: number
}

const FilterItemsComponent: React.FC<Props> = (
    {
        allCustomerCount,
        currentGroupFilter,
        filters,
        onPressFilter,
        filter,
        lvl,
        prevKey
    }) => {

    return (<div className={lvl > 0 ? 'nested-filter' : ''}>
            {currentGroupFilter && currentGroupFilter?.top?.map((item) => (
                <div key={item.key}>
                    <FilterItem
                        isActive={filter[lvl] === item.key}
                        onPressFilter={onPressFilter}
                        value={`${prevKey ? prevKey + '/' : ''}${item.key}`} label={`${item.key} (${item.value})`}
                    />
                    {filter[lvl] === item.key ? (
                        <FilterItems
                            filter={filter}
                            onPressFilter={onPressFilter}
                            filters={filters}
                            currentGroupFilter={filters[item.key]}
                            prevKey={`${prevKey ? prevKey + '/' : ''}${item.key}`}
                            lvl={lvl + 1}
                        />
                    ) : null}
                </div>
            ))}
            {currentGroupFilter?.others?.length > 0 &&
                <FilterItem
                    key={`${prevKey}-others`}
                    onPressFilter={onPressFilter}
                    value={`${prevKey ? prevKey + '/' : ''}others`}
                    label={`Others (${sumUniqueValuesByPrefix(currentGroupFilter?.others, currentGroupFilter?.top, lvl === 0 ? allCustomerCount : undefined)})`}
                    isActive={filter[lvl] === 'others'}
                />
            }
        </div>
    )

}

export const FilterItems = React.memo(FilterItemsComponent)