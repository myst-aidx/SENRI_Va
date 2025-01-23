export function classNames(...classes) {
    return classes
        .filter((cls) => Boolean(cls))
        .map(cls => {
        if (typeof cls === 'string')
            return cls;
        return Object.entries(cls)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(' ');
    })
        .join(' ');
}
