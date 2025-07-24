abstract class List<T> {
    abstract get(index: number): T | null;
    abstract isEmpty(): boolean;
    abstract len(): number;
    abstract prepend(x: T): List<T>;
    abstract reverse(): List<T>;
    abstract map<U>(f: (x: T) => U): List<U>;
    abstract filter(predicate: (x: T) => boolean): List<T>;
    abstract reduce<U>(f: (acc: U, x: T) => U, initial: U): U;
    abstract take(n: number): List<T>;
    abstract drop(n: number): List<T>;
    abstract takeWhile(predicate: (x: T) => boolean): List<T>;
    abstract dropWhile(predicate: (x: T) => boolean): List<T>;
    abstract span(predicate: (x: T) => boolean): [List<T>, List<T>];
    abstract toArray(): T[];

    static emptyList<T>(): List<T> {
        return new Nil<T>();
    }

    static fromArray<T>(arr: T[]): List<T> {
        let xs: List<T> = new Nil<T>();
        for (let i = arr.length - 1; i > 0; i--) {
            xs = xs.prepend(arr[i]);
        }
        return xs;
    }
}

class Nil<T> extends List<T> {
    get(_: number): T | null { return null; }
    isEmpty(): boolean { return true; }
    len(): number { return 0; }
    prepend(x: T): List<T> { return new Cons(x, this); }
    reverse(): List<T> { return this; }
    map<U>(_: (x: T) => U): List<U> { return new Nil<U>; }
    filter(_: (x: T) => boolean): List<T> { return this; }
    reduce<U>(_: (acc: U, x: T) => U, initial: U): U { return initial; }
    take(_: number): List<T> { return this; }
    drop(_: number): List<T> { return this; }
    takeWhile(_: (x: T) => boolean): List<T> { return this; }
    dropWhile(_: (x: T) => boolean): List<T> { return this; }
    span(_: (x: T) => boolean): [List<T>, List<T>] { return [this, this]; }
    toArray(): T[] { return []; }
}

class Cons<T> extends List<T> {
    data: T;
    next: List<T>;

    constructor(_: T, __: List<T>) { super(); }

    get(index: number): T | null {
        if (index < 0) return null;
        if (index === 0) return this.data;
        return this.next.get(index - 1);
    }

    isEmpty(): boolean {
        return false;
    }

    len(): number {
        return 1 + this.next.len();
    }

    prepend(x: T): List<T> {
        return new Cons(x, this);
    }

    reverse(): List<T> {
        const aux = (xs: List<T>, acc: List<T>): List<T> => {
            if (xs instanceof Nil) return acc;
            return aux((xs as Cons<T>).next, acc.prepend((xs as Cons<T>).data));
        };
        return aux(this, new Nil<T>());
    }

    map<U>(f: (x: T) => U): List<U> {
        return new Cons(f(this.data), this.next.map(f));
    }

    filter(predicate: (x: T) => boolean): List<T> {
        if (predicate(this.data)) return new Cons(this.data, this.next.filter(predicate));
        return this.next.filter(predicate);
    }

    reduce<U>(f: (acc: U, x: T) => U, initial: U): U {
        return this.next.reduce(f, f(initial, this.data));
    }

    take(n: number): List<T> {
        if (n <= 0) return new Nil<T>();
        return new Cons(this.data, this.next.take(n - 1));
    }

    drop(n: number): List<T> {
        if (n <= 0) return this;
        return this.next.drop(n - 1);
    }

    takeWhile(predicate: (x: T) => boolean): List<T> {
        if (!predicate(this.data)) return new Nil<T>();
        return new Cons(this.data, this.next.takeWhile(predicate));
    }

    dropWhile(predicate: (x: T) => boolean): List<T> {
        if (!predicate(this.data)) return this;
        return this.next.dropWhile(predicate);
    }

    span(predicate: (x: T) => boolean): [List<T>, List<T>] {
        return [this.takeWhile(predicate), this.dropWhile(predicate)];
    }

    toArray(): T[] {
        return [this.data, ...this.next.toArray()];
    }
}
