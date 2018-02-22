import { parents, children, compare } from './../utility/topologicalSort'
import { topologicalSort } from './../utility/topologicalSort'

const { create, assign } = Object;
const modules = new Map();

export type Global = {
    initialize: () => void,
    render: (props: any) => any,

    // properties are added by mods
    // may need to be of type any to get this all working
};

export type Context = {
    global: Global,
    next: () => void,

}

export type Consumer = (ctx: Context) => void;

type ModuleT = {
    id: string,
    consumer: Consumer,
    dependencies?: Array<string>,
    dependents?: Array<string>,
}



const modulePrototype = assign(create(null), {
    initialize(){
        this[parents] = new Set((this.dependencies||[]).map(k => modules.get(k)));
        this[children] = new Set((this.dependents||[]).map(k => modules.get(k)));
    },
    // $FlowFixMe: NYI on their part
    [compare](that){
        return this.id > that.id ? 1 : -1;
    },
});

type OrderModules = (modules: Array<Module>) => Array<Module>;
const orderModules: OrderModules = mods => {
    mods.forEach(m => m.initialize());
    return topologicalSort(mods);
}

type LoadModules = (Array<Module>) => Global;
export const loadModules: LoadModules = modules => {
    const loadQueue = orderModules(modules);
    const global = { 
        initialize: () => undefined,
        render: h => <p>Hello World!</p>,
    };
    let index = -1;
    const next = () => {
        while(++index < loadQueue.length){
            loadQueue[index].consumer({ global, next });
        }
    };
    
    next();

    global.initialize();

    return global;

}


export function Module(id: string, consumer: Consumer, dependencies: Array<string>, dependents: Array<string>): ModuleT {
    if(modules.has(id)){
        throw new Error(`Duplicate module id ${id} detected.`);
    } else {
        let module = assign(create(modulePrototype), {
            dependencies,
            dependents,
            id,
            consumer,
        });
        modules.set(id, module);
        return module;
    }
}





