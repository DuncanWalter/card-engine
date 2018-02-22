const { create, assign } = Object;

const llProto = {
    /* list */
    [Symbol.iterator]: function*(){
        let list = this.list;
        while(list[1]){
            yield list[0];
            list = list[1];
        }
    },
    shift(v){
        this.list = this.list[1];
        return this;
    },
    push(v){
        this.list[1] = [this.list[0], this.list[1]];
        this.list[0] = v;
        return this;
    },
    unshift(v){
        this.list = [v, this.list];
        return this;
    },
    pop(){
        const [v, list] = this.list;
        this.list = list;
        return v;
    },
    append(v){
        this.last[0] = v;
        this.last[1] = [undefined, null];
        this.last = this.last[1];
        return this;
    },
    view(){
        return assign(create(llProto), { 
            list: this.list, 
            last: this.last,
        });
    },
}

export function LL(){
    let l = [undefined, null];
    return assign(create(llProto), { 
        list: l, 
        last: l, 
    });
};
