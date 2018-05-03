import type { Component } from './component'
import styled from "styled-components";

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: '100%';
    min-height: '100%';
    flex: 1;
`

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: '100%';
    flex: 1;
`

export const Frame = styled.div`
    padding: 4.5px;
`

export const Block = styled.div`
    position: relative;
    display: inline-block;
    background-color: #262422;
    border-radius: 4.5px;
    margin: 4.5px;
    border: solid #a89888 2px;
    text-align: center;
    padding: 4.5px;
`

export const ModalWrapper = styled.div`
    position: absolute;
    left: 50%;
    right: 50%;
    top: 50%;
    bottom: 50%;
    max-width 0;
    max-height: 0;
    display: flex;
    padding: -1000px;
    align-items: center;
    justify-content: center;
`

export const Modal: Component<> = props => <ModalWrapper>
    <Block {...props}>
        { props.children }
    </Block>    
</ModalWrapper>

export const Button: Component<> = props => <Block { ...props } style={{ cursor: 'pointer' }}>{props.children}</Block>

    
