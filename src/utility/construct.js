
const { create, assign } = Object;

export function construct<A, B>(proto: A, base: B): A & B {
    return assign(create(proto), base);
}