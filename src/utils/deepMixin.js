export function deepMixin(a: mixed, b: mixed){
    switch(true){
        case Array.isArray(a) && Array.isArray(b):{
            return [...new Set(...a, ...b)]
        }
        case a instanceof Object && b instanceof Object:{
            return Object.keys(b).reduce((acc, key) => {
                acc[key] = deepMixin(acc[key], b[key])
                return acc
            }, b)
        }
        default:{
            return b
        }
    }
}