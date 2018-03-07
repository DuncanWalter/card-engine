



declare module 'external' {
    declare module.exports: any;
}

declare module 'tap' {
    declare module.exports: any;
}

declare var inferno: any;
declare var React: any;

// CustomActionTemplate
declare export class CA<Data=any, Subject=any, Actor=any> extends Action<Data, Subject, Actor> {
    constructor(actor: Actor, subject: Subject, data: Data, ...tags: Symbol[]): CA<Data, Subject, Actor>
}