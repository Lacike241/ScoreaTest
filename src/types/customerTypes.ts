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

export interface KeyValueData {
    key: string
    value: number
}

export type ChildData = Record<string, KeyValueData[]>

export interface GroupItem {
    child: ChildData
    others: KeyValueData[]
    top: KeyValueData[]
}

export type CalculatedGroups = Record<string, GroupItem>