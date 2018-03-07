function any(any: any): any { return any }


const GeneratorFunction = (function * gen(){ return }).constructor


function next<R, B>(gen: Generator<Promise<B>, R, B>, resolve: (v: R) => void, prev?: B): void {
    const { value, done } = gen.next(prev)

    if (done) return resolve(any(value))

    if(value instanceof Promise){
        let isSynced = true
        value.then((value: B) => { // TODO:check if resolved. if not, setImediate
            if(isSynced){
                next(gen, resolve, value)
            } else {
                setImmediate(() => next(gen, resolve, value))
            }
        })
        isSynced = false
    } else {
        console.log(`Yielded a non-promise in async function ${any(value)}`)
    }
}

type Synchronize = ((any[]) => Generator<any, any, any>) => (any[]) => Promise<any>


type Fn<A, R> = ((a: A) => Promise<R>) | ((a: A) => Generator<Promise<any>, R, any>)



// TODO: is there a way to make this express the stuff fully?
export function synchronize<A, R>(fun: Fn<A, R>): (a: A) => Promise<R> {
    return (args: A) => new Promise(resolve => {
        if(fun instanceof GeneratorFunction){
            next(fun(args), resolve)
        } else {
            resolve(any(fun(args)))
        }
    })
}