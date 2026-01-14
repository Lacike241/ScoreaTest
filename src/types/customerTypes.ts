export interface Customer {
    id: number
    kod: string
    nazev: string
    psc: string
}

export interface Data {
    winstrom: {
        adresar: Customer[],
        '@rowCount'?: string
    }
}
