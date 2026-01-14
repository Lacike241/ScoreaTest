import React from "react";

interface Props {
    value: string | number
}

const TableRowItemComponent: React.FC<Props> = ({value}) => (
    <span className={'row-item'}>{value}</span>
)

export const TableRowItem = React.memo(TableRowItemComponent)