import type {CalculatedGroups, Customer} from "src/types/customerTypes";
import {getTopData} from "src/helpers/customerHelper.ts";

export function getRootCalculatedGroups(items: Customer[]): CalculatedGroups['root'] {
    if (!items?.length) return {
        child: {},
        top: [],
        others: []
    };
    // default PSG length to 10
    const length = 10;
    let allGroup = {};
    for (let prefixLen = 1; prefixLen < length; prefixLen++) {
        const currentGroup: Record<string, number> = {};
        for (const item of items) {
            const psc = item.psc;
            const itemPrefixLen = Math.min(psc.length, prefixLen)
            const prefix = psc.slice(0, itemPrefixLen - 1);
            currentGroup[prefix] ??= 0;
            currentGroup[prefix]++;
        }
        allGroup = allGroup ? {...allGroup, ...currentGroup} : currentGroup
    }

    const sortedArray = Object.entries<number>(allGroup)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => ({key, value}));

    return getTopData(sortedArray, 5)
}

export function getPaginatedData(data: Customer[], pageSize: number, currentPage: number) {
    const start = pageSize * (currentPage - 1)
    const end = (pageSize * currentPage) - 1
    return data.slice(start, end)
}
export function startsWithButNot(value: string, requiredPrefix: string, forbiddenPrefixes: string[] = []) {
    const str = value;

    return (
        str.startsWith(requiredPrefix) &&
        !forbiddenPrefixes.some(p =>
            str.startsWith(p)
        )
    );
}

export function getOthersDataByFilter(data: Customer[],calculatedGroups: CalculatedGroups, filter: string) {
    let result: Customer[] = []
    const filterValues = filter.split('/')
    if (filterValues.length >= 2) {
        const fV = filterValues[filterValues.length - 2]
        if (calculatedGroups[fV]) {
            const notStartWith = calculatedGroups[fV]?.top.map((item) => item.key)
            result = data.filter((item) => startsWithButNot(item.psc, fV, notStartWith))
        }
    } else {
        const notStartWith = calculatedGroups.root?.top.map((item) => item.key)
        result = data.filter((item) => startsWithButNot(item.psc, '', notStartWith))
    }
    return result
}
