import React from 'react';

interface Props {
    value: string
    label?: string
    onPressFilter: (value: string)=> void
}

const FilterItemComponent: React.FC<Props> = ({label, value, onPressFilter}) => {

    const handlePressFilter = ()=>{
        onPressFilter(value)
    }

    return (
        <div onClick={handlePressFilter}>
            <span className={'filter-value'}>{label ?? `PSC ${value === '' ? 'xxxxxx' : value}`}</span>
        </div>
    )
}

export const FilterItem = React.memo(FilterItemComponent)