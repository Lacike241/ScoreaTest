import type {ChildData, Customer, GroupItem, KeyValueData} from "src/types/customerTypes";

export function getChildForTop(data: KeyValueData[], topData: KeyValueData[]) {
    if (data && topData) {
        const children: ChildData = {}
        let others: KeyValueData[] = []

        data.forEach((item) => {
            if(item.key === ''){
                others = [...others, item]
            }
            else {
                let isChildren = false
                let isTop = false
                topData.forEach((topItem) => {
                    if (topItem.key === item.key) {
                        isTop = true
                    } else if (item.key.startsWith(topItem.key)) {
                        isChildren = true
                        children[topItem.key] ??= [];
                        children[topItem.key] = [...children[topItem.key], item]
                    }
                })
                if ((!isChildren && !isTop)) {
                    others = [...others, item]
                }
            }
        })
        return {
            children,
            others
        }
    } else {
        return {
            children: {},
            others: []
        }
    }
}

function getSortedPrefixes(items: Customer[]): KeyValueData[] {
    let allGroup = {};
    const length = 10;
    for (let prefixLen = 1; prefixLen < length; prefixLen++) {
        const currentGroup: Record<string, number> = {};
        for (const item of items) {
            const psc = item.psc;
            const normalizedPsc = psc.replace(/\s/g, '');
            const itemPrefixLen = Math.min(normalizedPsc.length, prefixLen)
            const prefix = normalizedPsc.slice(0, itemPrefixLen);
            currentGroup[prefix] ??= 0;
            currentGroup[prefix]++;
        }
        allGroup = allGroup ? {...allGroup, ...currentGroup} : currentGroup
    }
    return Object.entries<number>(allGroup)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => ({key, value}));
}

function findLongestPrefixIndex(array: KeyValueData[], key: string) {
    let index = -1;
    let maxLength = -1;
    array.forEach((item, i) => {
        if (key.startsWith(item.key) && item.key.length > maxLength) {
            maxLength = item.key.length;
            index = i;
        }
    });

    return index;
}

export function getDataForRoot(data: KeyValueData[], count: number) {
    let rootData: KeyValueData[] = []
    let i = 1;
    if (data?.length > 0) {
        rootData.push(data[0])

        while (i < data.length) {
            const prefixIndex = findLongestPrefixIndex(rootData, data[i].key);
            const value = data[i].value
            if (prefixIndex >= 0 && rootData[prefixIndex].value - value < value) {
                rootData = [
                    ...rootData.slice(0, prefixIndex),
                    data[i],
                    ...rootData.slice(prefixIndex + 1)
                ]
            } else {
                if (rootData.length < count - 1) {
                    rootData = [...rootData, data[i]]
                }
            }
            i++;
        }
    }

    const sortedRootData = rootData
        .sort((a, b) => b.value - a.value)

    return {rootData: sortedRootData, othersData: data}
}

export function getCalcGroups(items: Customer[]) {
    const sortedArray = getSortedPrefixes(items)
    const {rootData, othersData} = getDataForRoot(sortedArray, 5)
    const {children, others} = getChildForTop(othersData, rootData)
    return {
        top: rootData,
        others: others,
        child: children
    }
}

export function sumUniqueValuesByPrefix(data: KeyValueData[], topData: KeyValueData[], allCustomerCount?: number) {
    let sum =  allCustomerCount ?? 0;
    const prefixes: string[] = []

    // calculate for root
    if(allCustomerCount){
        for (const { key, value } of topData) {
            if (!prefixes.some(p => key.startsWith(p))) {
                sum -= value;
                prefixes.push(key);
            }
        }
    } else {
        for (const { key, value } of data) {
            if (!prefixes.some(p => key.startsWith(p))) {
                sum += value;
                prefixes.push(key);
            }
        }
        for (const { key, value } of topData) {
            if (prefixes.some(p => key.startsWith(p))) {
                sum -= value;
            }
        }
    }

    return sum;
}

export const getFilterUrlFromTopData = (data?: GroupItem['top'], beginsItem?: string) => {
    let resultUrl = beginsItem ? `(psc%20begins%20'${beginsItem}'` : '('
    if (data) {
        data.forEach((item, idx) => {
            resultUrl += `${!beginsItem && idx === 0 ? '' : '%20and%20'}(%20not%20psc%20begins%20'${item.key}'`
            if (item.key.length > 3) {
                resultUrl += `%20and%20not%20psc%20begins%20'${item.key.slice(0, 3)}%20${item.key.slice(3)}'%20)`
            } else {
                resultUrl += `%20)`
            }
        })
    }
    resultUrl += ')'

    return resultUrl
}