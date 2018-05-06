import type { Component } from './component'
import styled from "styled-components";

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: '100%';
    min-height: '100%';
    ${ props => 
        props.shim? 'flex: 1': ''
    };
`

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    ${ props => 
        props.shim? 'flex: 1': ''
    };
`

export const Frame = styled.div`
    padding: 4.5px;
`

export const Block = styled.div`
    position: relative;
    background-color: ${ props => 
        props.fill ? '#44444f' : '#22222b'
    };
    margin: 4px;
    border: solid #44444f 2px;
    text-align: center;
    padding: 4px;
    ${ props => 
        props.shim? `
            flex: 1;
            display: flex;
            align-items: stretch;
        `: ''
    };
`

export const ModalWrapper = styled.div`
    position: absolute;
    left: 50%;
    right: 50%;
    top: 50%;
    bottom: 50%;
    max-width: 0;
    max-height: 0;
    display: flex;
    padding: -1000px;
    align-items: center;
    justify-content: center;
`

const ModalBlock = Block.extend`
    min-width: 84vw;
    min-height: 72vh;
    display: flex;
    align-items: stretch;
    flex-direction: column;
`

export const Modal: Component<> = props => <ModalWrapper>
    <ModalBlock {...props}>
        { props.children }
    </ModalBlock>    
</ModalWrapper>


export const Button = styled.div`
    cursor: pointer;
    background-color: ${ props => 
        props.primary ? '#44444f' : '#22222b'
    };
    &:hover {
        background-color: ${ props => 
            props.primary ? '#22222b' : '#44444f'
        };
    };
    margin: 4px;
    border: solid #44444f 2px;
    text-align: center;
    padding: 8px 12px 8px;
`

    
export const Shim = styled.div`
    flex: 1;
`