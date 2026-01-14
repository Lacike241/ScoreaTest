import React from "react";

import {CUSTOMER_TABLE_HEADER_NAMES} from "src/constants/customerConstants";
import {TableHeaderItem} from "./TableHeaderItem";

const TableHeaderComponent = () => {
    return (
        <div className="row header">
            {CUSTOMER_TABLE_HEADER_NAMES.map((name) => (
                <TableHeaderItem value={name} key={name}/>
            ))}
        </div>
    );
}

export const TableHeader = React.memo(TableHeaderComponent)