import type {CalculatedGroups, ChildData, Customer, GroupItem, KeyValueData} from "src/types/customerTypes";

export function getTopData(data: KeyValueData[], count: number) {
    if (data) {
        const top = data.slice(0, count - 1)
        const child: ChildData = {}
        let others: KeyValueData[] = []

        const noTop = data.slice(count - 1)
        noTop.forEach((item) => {
            let isChild = false
            top.forEach((topItem) => {
                if (item.key.startsWith(topItem.key)) {
                    isChild = true
                    child[topItem.key] ??= [];
                    child[topItem.key] = [...child[topItem.key], item]
                }
            })
            if (!isChild) {
                others = [...others, item]
            }

        })
        return {
            top,
            others,
            child
        }
    } else {
        return {
            top: [],
            others: [],
            child: {}
        }
    }
}

export function getCalculatedGroups(items: Customer[], filter: string | null): CalculatedGroups {
    if (!items?.length) return {};
    // default PSG length to 10
    const length = 10;
    let allGroup = {};
    for (let prefixLen = 1; prefixLen < length; prefixLen++) {
        const currentGroup: Record<string, number> = {};
        for (const item of items) {
            const psc = item.psc;
            const normalizedPsc = psc.replace(/\s/g, '');
            const itemPrefixLen = Math.min(normalizedPsc.length, prefixLen)
            const prefix = normalizedPsc.slice(0, itemPrefixLen - 1);
            // filter
            // if (!filter || (filter.length < prefixLen && filter !== prefix)) {
            //     currentGroup[prefix] ??= 0;
            //     currentGroup[prefix]++;
            // }
            currentGroup[prefix] ??= 0;
            currentGroup[prefix]++;

        }
        allGroup = allGroup ? {...allGroup, ...currentGroup} : currentGroup
    }
    const filterValues = filter?.split('/')
    const sortedArray = Object.entries<number>(allGroup)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => ({key, value}));

    const rootResult = getTopData(sortedArray, 5)
    let nestedResult: CalculatedGroups = {}

    filterValues?.forEach((fItem, idx) => {
        let isFilterInTop = false
        let topData = rootResult
        const prevFilterValue = filterValues[idx - 1]

        if (prevFilterValue && nestedResult && nestedResult[prevFilterValue] && idx > 0) {
            topData = nestedResult[prevFilterValue]
        }

        if (fItem) {
            const findIndex = topData.top.findIndex((item) => item.key === fItem)
            if (findIndex >= 0) {
                isFilterInTop = true
            }
        }
        if (isFilterInTop) {
            nestedResult = {
                ...nestedResult,
                [fItem]: getTopData(topData.child[fItem], 5)
            }
        } else {
            // čo ak sa nenachádza v TOP?
            // nestedResult = {
            //     ...nestedResult,
            //     // [fItem]: getTopData(rootResult.others, 5)
            // }
        }
    })

    return {
        root: rootResult,
        ...nestedResult
    }
}

export const getLastFilterValue = (filter: string | null) => {
    const filterValues = filter?.split('/')
    let result = ''
    if (filterValues) {
        result = filterValues[filterValues.length - 1]
    }
    return result
}

export const getFilterUrlFromTopData = (data?: GroupItem['top'], beginsItem?: string)=>{
    let resultUrl = beginsItem ? `(psc%20begins%20'${beginsItem}'` : '('
    if (data) {
        data.forEach((item, idx) => {
            resultUrl += `${!beginsItem && idx === 0 ? '' : '%20and%20'}not%20psc%20begins%20'${item.key}'`
        })
    }
    resultUrl += ')'

    return resultUrl
}