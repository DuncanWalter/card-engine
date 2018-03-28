import { Component as PreactComponent } from 'preact'

export type Component<Props: Object={}> = (props: Props) => Element | PreactComponent

export type Element = {} | Element[] | string