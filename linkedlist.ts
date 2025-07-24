type List<T> = { data: T, next: List<T> } | null;

function get<T>(xs: List<T>, index: number): T | null {
    if (xs === null || index < 0) return null;
    if (index === 0) return xs.data;
    return get(xs.next, index - 1);
}

function isEmpty<T>(xs: List<T>): boolean {
    return xs === null;
}

function len<T>(xs: List<T>): number {
    if (xs === null) return 0;
    return 1 + len(xs.next);
}

function prepend<T>(xs: List<T>, x: T): List<T> {
    return { data: x, next: xs };
}

function reverse<T>(xs: List<T>): List<T> {
    function aux(xs: List<T>, acc: List<T>): List<T> {
        if (xs === null) return acc;
        return aux(xs.next, prepend(acc, xs.data));
    }
    return aux(xs, null);
}

function map<T, U>(xs: List<T>, f: (x: T) => U): List<U> {
    if (xs === null) return null;
    return { data: f(xs.data), next: map(xs.next, f) };
}

function filter<T>(xs: List<T>, predicate: (x: T) => boolean): List<T> {
    if (xs === null) return null;
    if (predicate(xs.data)) return { data: xs.data, next: filter(xs.next, predicate) };
    return filter(xs.next, predicate);
}

function reduce<T, U>(xs: List<T>, f: (acc: U, x: T) => U, initial: U): U {
    if (xs === null) return initial;
    return reduce(xs.next, f, f(initial, xs.data));
}

function take<T>(xs: List<T>, n: number): List<T> {
    if (xs === null || n <= 0) return null;
    return { data: xs.data, next: take(xs.next, n - 1) };
}

function drop<T>(xs: List<T>, n: number): List<T> {
    if (xs === null || n <= 0) return xs;
    return drop(xs.next, n - 1);
}

function takeWhile<T>(xs: List<T>, predicate: (x: T) => boolean): List<T> {
    if (xs === null || !predicate(xs.data)) return null;
    return { data: xs.data, next: takeWhile(xs.next, predicate) };
}

function dropWhile<T>(xs: List<T>, predicate: (x: T) => boolean): List<T> {
    if (xs === null || !predicate(xs.data)) return xs;
    return dropWhile(xs.next, predicate);
}

function span<T>(xs: List<T>, predicate: (x: T) => boolean): [List<T>, List<T>] {
    return [takeWhile(xs, predicate), dropWhile(xs, predicate)];
}

function toArray<T>(xs: List<T>): T[] {
    if (xs === null) return [];
    return [xs.data, ...toArray<T>(xs.next)];
}

function toList<T>(arr: T[]): List<T> {
    let lst: List<T> = null;
    arr.forEach(elem => {
        lst = prepend(lst, elem);
    });
    return reverse(lst);
}
