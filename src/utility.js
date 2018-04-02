import type { Component } from './component'
import './utility.styl'

export const Col: Component<> = props => <div class='col' style={props}>{props.children}</div>
export const Row: Component<> = props => <div class='row' style={props}>{props.children}</div>
export const Block: Component<> = props => <div class='block' style={props}>{props.children}</div>
export const Frame: Component<> = props => <div class='frame' style={props}>{props.children}</div>

export const Modal: Component<> = props => {
    return <div class='modal'>
        <div class='block frame'>{
            props.children
        }</div>
    </div>
}

export const Button: Component<{ children: any, onClick: Function }> = props => {
    return <div class='button block frame' onClick={props.onClick}>{
            props.children
    }</div>
}

export const Shim: Component<{ size: number }> = ({ size }) => {
    <div style={{ flex: size || 1 }}/>
}