import React from "react";

import {FilterItem} from "./FilterItem";

interface Props {
    filters: string[]
    onPressFilter: (value: string) => void
}

const FilterComponent: React.FC<Props> = ({filters, onPressFilter}) => {

    return (
        <div>
            <h4>Filter</h4>
            <div className="filter">
                {filters.map((item) => (
                    <FilterItem key={item} onPressFilter={onPressFilter} value={item}/>
                ))}
                <FilterItem key={'others'} onPressFilter={onPressFilter} value={''} label={'Others'}/>
            </div>
        </div>
    )
}

export const Filter = React.memo(FilterComponent)