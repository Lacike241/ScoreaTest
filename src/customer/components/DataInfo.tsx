import React from "react";

interface Props {
    customerCount?: number
    filter: string | null
}

const DataInfoComponent: React.FC<Props> = ({customerCount, filter})=>{

    return (
        <div className={'data-info'}>
            <div className={'data-info-text'}>
                <span className={'label'}>Počet záznamov:</span>
                <span>{customerCount ?? 0}</span>
            </div>
            <div className={'data-info-text'}>
                <span className={'label'}>{'Filter:'}</span>
                <span>{filter ?? 0}</span>
            </div>
        </div>
    )
}

export const DataInfo = React.memo(DataInfoComponent)