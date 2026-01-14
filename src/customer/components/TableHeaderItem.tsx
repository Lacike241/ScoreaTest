import React from "react";

interface Props {
    value: string
}

const TableHeaderItemComponent: React.FC<Props> = ({value}) => (
    <div className={'header-item'}>{value}</div>
);

export const TableHeaderItem = React.memo(TableHeaderItemComponent)