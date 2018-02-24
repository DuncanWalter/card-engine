
type LLNode<E> = [E | null, LLNode<E> | false]

export class LL<E>{

    list: LLNode<E>
    last: LLNode<E>

    constructor(...elements: Array<E>){
        this.list = [null, false];
        this.last = this.list;
    }
    
    next(): E | null {
        const [v, l] = this.list;
        if (l) this.list = l;
        return v;
    }

    push(v: E){
        this.list[1] = [this.list[0], this.list[1]];
        this.list[0] = v;
        if (this.list == this.last && this.list[1]) this.last = this.list[1];
    }

    unshift(v: E){
        this.list = [v, this.list];
    }

    pop(): E | null {
        const [v, l] = this.list;
        if(l){
            this.list[0] = l[0];
            this.list[1] = l[1];
        } else {
            throw new Error('popped from an empty list');
        }
        return v;
    }

    append(v: E){
        this.last[0] = v;
        this.last[1] = [null, false];
        this.last = this.last[1] ? this.last[1] : [null, false];
    }

    view(): LL<E> {
        let l = new LL();
        l.list = this.list;
        l.last = this.last;
        return l;
    }

    // // $FlowFixMe
    // [Symbol.iterator]: function*(){
    //     let l = this.list;
    //     while(this.list[1]){
    //         yield this.list[0];
    //         l = this.list[1];
    //     }
    // }
};
