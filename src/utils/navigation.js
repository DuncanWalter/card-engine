

// TODO: find clean way to get rid of this
let hist: any = undefined

export function useHistory(history: any){
    hist = history
}

export function navigateTo(path: string){
    hist.push(path)
}