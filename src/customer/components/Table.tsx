import React from "react";

import type {Customer} from "src/types/customerTypes";
import {TableHeader} from "./TableHeader";
import {TablePagination} from "./TablePagination";
import {TableRow} from "./TableRow";

interface Props {
    data: Customer[]
    totalLength: number
    actualPage: number
    onChangePage: (value: number)=> void
}

export const Table: React.FC<Props> = ({data, totalLength, onChangePage, actualPage}) => {

    return (
        <div className="container">
            <TableHeader />
            {data.map((item) => (
                <TableRow psc={item.psc} id={item.id} nazev={item.nazev} key={item.id} />
            ))}
            <TablePagination totalLength={totalLength} actualPage={actualPage} onChangePage={onChangePage} />
        </div>
    );
}