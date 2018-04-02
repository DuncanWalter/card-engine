import { Component as PreactComponent } from 'preact'

export type Component<Props: Object={ children: Component<> }> = (props: Props) => Element | PreactComponent

export type Element = {} | Element[] | string