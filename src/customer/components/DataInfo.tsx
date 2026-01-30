import React from "react";

import {DataInfoLink} from "src/customer/components/DataInfoLink";
import type {KeyValueData} from "src/types/customerTypes";

interface Props {
    customerCount?: number
    filter: string | null
    topData: KeyValueData[]
    onPressDataInfoLink: (value: string) => void
}

const DataInfoComponent: React.FC<Props> = ({customerCount, filter, topData, onPressDataInfoLink}) => {

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
            <div style={{height: '20px'}}>
                {topData.length > 0 &&
                    <>
                        <span className={'label'}>{'Pod skupiny:'}</span>
                        {topData.map((item) => (
                            <DataInfoLink
                                key={item.key}
                                onPress={onPressDataInfoLink}
                                value={item.value}
                                topKey={item.key}
                                filter={filter}
                            />
                        ))}
                    </>
                }
            </div>
        </div>
    )
}

export const DataInfo = React.memo(DataInfoComponent)