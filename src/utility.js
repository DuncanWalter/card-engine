import styled from "styled-components";
import * as React from 'react'

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    ${ props => 
        props.shim? 'flex: 1' : ''
    };
`

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    ${ props => 
        props.shim? 'flex: 1' : ''
    };
`

export const Material = styled.div`
    text-align: center;
    border-radius: 4px;
    transition: 0.25s;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35),
                0 0 8px rgba(0, 0, 0, 0.35);

    & > ${Col} > *:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    & > ${Col} > *:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    & > ${Row} > *:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    & > ${Row} > *:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
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

const ModalBlock = Material.extend`
    min-width: 84vw;
    min-height: 72vh;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    background-color: #262432;
    padding: 16px;
`

export const Modal = (props: any) => <ModalWrapper>
    <ModalBlock {...props}>
        { props.children }
    </ModalBlock>    
</ModalWrapper>


export const Button = Material.extend`
    cursor: pointer;
    background-color: ${ props => {
        switch(true){
            case props.danger:{
                return '#cc2222'
            }
            case props.primary:{
                return '#22cc22'
            }
            default:{
                return '#22222b'
            }
        }
    }};
    &:hover {
        background-color: rgba(240, 240, 240, 0.95);
        color: ${ props => {
            switch(true){
                case props.danger:{
                    return '#cc2222'
                }
                case props.primary:{
                    return '#22cc22'
                }
                default:{
                    return '#22222b'
                }
            }
        }};
    };
    margin: 8px;
    /* border: solid #44444f 2px; */
    text-align: center;
    padding: 8px 16px 8px;
`

export const Shim = styled.div`
    flex: 1;
`