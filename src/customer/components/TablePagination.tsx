import React from "react";

import {PAGE_SIZE} from "src/constants/customerConstants";

interface Props {
    totalLength: number
    actualPage: number
    onChangePage: (value: number) => void
}

const TablePaginationComponent: React.FC<Props> = ({totalLength, onChangePage, actualPage}) => {
    const totalPages = Math.ceil(totalLength / PAGE_SIZE);

    const handleClickLeft = ()=>{
        onChangePage(Math.max(actualPage - 1, 1))
    }
    const handleClickRight = ()=>{
        onChangePage(Math.min(actualPage + 1, totalPages))
    }

    return (
        <div className="pagination">
            <button
                onClick={handleClickLeft}
                disabled={actualPage === 1}
            >
                {'<'}
            </button>

            <span className={'pagination-page'}>Strana {actualPage} z {totalPages}</span>

            <button
                onClick={handleClickRight}
                disabled={actualPage === totalPages}
            >
                {'>'}
            </button>
        </div>
    );
}

export const TablePagination = React.memo(TablePaginationComponent)