import { LL } from './linkedList'

export const parents = Symbol('parents');
export const children = Symbol('children');
export const compare = Symbol('compare');

type Elem = any /*{
    [children]: Set<Elem>,
    [parents]: Set<Elem>,
    [compare]: (Elem) => -1 | 0 | 1,
}*/

function insert(e, l){
    let v = l.view();
    while(v.list[0] && e[compare](v.list[0]) < 0){
        v.shift();
    }
    v.push(e);
}

export function topologicalSort(elements: Array<Elem>): Array<Elem> {

    elements.forEach(e => {
        e[children].forEach(c => {
            c[parents].add(e);
        });
        e[parents].forEach(p => {
            p[children].add(e);
        });
    });
    
    let available = elements
        .filter(e => e[parents].size == 0)
        .sort((a, b) => a[compare](b))
        .reduce((a, m) => {
            console.log(...a);
            return a.append(m);
        }, new LL());

    let retVal = [];

    while(available.list[1]){
        let m = available.pop();
        m[children].forEach(c => {
            c[parents].delete(m);
            if(!c[parents].size){
                insert(c, available);
            }
        });
        retVal.push(m);
    }
    return retVal;
}