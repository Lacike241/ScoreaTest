import React from "react";

import {FilterItems} from "src/customer/components/FilterItems.tsx";
import type {CalculatedGroups, GroupItem} from "src/types/customerTypes.ts";

interface Props {
    filters: CalculatedGroups
    currentGroupFilter: GroupItem
    onPressFilter: (value: string) => void
    onPressResetFilter: () => void
    filter: string[] | undefined
    lvl: number
}

const FilterComponent: React.FC<Props> = ({currentGroupFilter, filters, onPressFilter, onPressResetFilter, filter, lvl}) => {

    const handlePressReset = () => {
        onPressResetFilter()
    }

    return (
        <div>
            <button onClick={handlePressReset}>
                {'Reset filter'}
            </button>
            <div className="filter">
                {filter && (
                    <FilterItems
                        currentGroupFilter={currentGroupFilter}
                        filter={filter}
                        filters={filters}
                        onPressFilter={onPressFilter}
                        lvl={lvl}
                    />
                )}
            </div>
        </div>
    )
}

export const Filter = React.memo(FilterComponent)