import React from "react";

interface Props {
    filter: string | null
    onPress: (value: string) => void
    topKey: string
    value: number
}

const DataInfoLinkComponent: React.FC<Props> = ({topKey, onPress, value, filter})=>{
    const handlePress = () =>{
        onPress(`${filter}/${topKey}`)
    }
    return <span className={'data-info-link'} onClick={handlePress}>
        {`${topKey} (${value}) `}
    </span>
}

export const DataInfoLink = React.memo(DataInfoLinkComponent)