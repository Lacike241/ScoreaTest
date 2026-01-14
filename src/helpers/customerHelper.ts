import type {Customer} from "src/types/customerTypes";

export function getPSCGroupsPrefixes(items: Customer[], filter?: string) {
    if (!items?.length) return [];
    // default PSG length to 10
    const length = 10;
    let group = {};

    for (let prefixLen = 1; prefixLen < length; prefixLen++) {
        const currentGroup: Record<string, number> = {};

        for (const item of items) {
            const psc = item.psc;
            const itemPrefixLen = Math.min(psc.length, prefixLen)
            const prefix = psc.slice(0, itemPrefixLen - 1);
            if(!filter || (filter.length < prefixLen && filter !== prefix)){
                currentGroup[prefix] ??= 0;
                currentGroup[prefix]++;
            }
        }

        group = group ? {...group, ...currentGroup} : currentGroup
    }

    // Sort groups and create array of keys e.g.: ['1', '11', '2']
    return Object.entries<number>(group)
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => key);
}