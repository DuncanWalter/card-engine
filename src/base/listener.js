import { ConsumerArgs } from "../base/actions/action";

export interface Listener<Actor, Subject, Type> {
    id: Symbol,
    header: {
        actors?: Array<Actor>,
        subjects?: Array<Subject>,
        tags?: Array<string>,
        filter?: () => boolean,
    },
    consumer: (ConsumerArgs<Actor, Subject, Type>) => boolean,
    dependencies?: Array<Symbol>,
    dependents?: Array<Symbol>,
}






