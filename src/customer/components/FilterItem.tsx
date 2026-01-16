import React from 'react';

interface Props {
    value: string
    label?: string
    onPressFilter: (value: string)=> void
    isActive?: boolean
}

const FilterItemComponent: React.FC<Props> = ({isActive, label, value, onPressFilter}) => {

    const handlePressFilter = ()=>{
        onPressFilter(value)
    }

    return (
        <div className={isActive ? 'active-filter' : 'filter-wrapper'} onClick={handlePressFilter}>
            <span className={'filter-value'}>{label ?? `PSC ${value === '' ? 'xxxxxx' : value}`}</span>
        </div>
    )
}

export const FilterItem = React.memo(FilterItemComponent)