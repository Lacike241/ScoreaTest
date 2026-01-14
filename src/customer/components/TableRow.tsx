import React from "react";

import type {Customer} from "src/types/customerTypes";
import {TableRowItem} from "./TableRowItem";

interface Props {
    id: Customer['id']
    nazev: Customer['nazev']
    psc: Customer['psc']
}

const TableRowComponent: React.FC<Props> = ({id, nazev, psc}) => {

    return (
        <div className="row">
            <TableRowItem value={id}/>
            <TableRowItem value={nazev}/>
            <TableRowItem value={psc}/>
        </div>
    )
}

export const TableRow = React.memo(TableRowComponent)