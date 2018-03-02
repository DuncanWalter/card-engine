
export type Component<Props: Object={}> = (props: Props) => Element

export type Element = {} | Element[] | string