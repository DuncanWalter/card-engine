import type { Component } from '../component'
import { Link, Route } from 'react-router-dom'
import { Button, Block, Frame, Modal, Col, Row, Shim } from "../utility"
import { resolver } from '../actions/actionResolver'
import { StartGame } from '../actions/startGame'
import styled from 'styled-components'
import { withState, dispatch } from '../state'
import { beginSelectingCharacter, previewCharacter, selectCharacter, cancelCharacterSelection, viewDetailPanel } from './menuState';
import { cardSets } from '../cards/cardSet';
import { CardPanel } from '../game/cardPanel';

const Panel = styled.div`
    width: 240px;
    height: 240px;
    margin: 20px;
    background-color: ${ props =>
        props.color
    };
`

// TODO: add a clear button to the character panels?
const CharacterPanel = ({ index, character }) => {
    
    const set = cardSets.get(character[index])

    return <Panel color={ set? set.color: '#333333' } onClick={ click => 
        beginSelectingCharacter(dispatch, index)
    }>
        { set? set.name: 'Empty' }
    </Panel>
    
}

export const CreateGame: Component<> = withState(({ state }) => {
    let { isSelecting, selectingIndex, previewing, character, detailPanel } = state.menu
    return isSelecting? <Modal>
        <Col shim>
            <Row shim>
                <Block>
                    <h2>Card Sets</h2>
                    <Col>
                        {selectingIndex!=0? <Button onClick={ click => 
                            previewCharacter(dispatch, '')
                        }>
                            <h3>Empty</h3>
                        </Button>: null}
                        {[...cardSets.values()].filter(set => set.playable && (!character.includes(set.name) || character[selectingIndex] == set.name)).map(set =>
                            <Button onClick={ click => 
                                previewCharacter(dispatch, set.name)
                            }>
                                <h3>{set.name == previewing? set.name: set.name}</h3>
                            </Button>
                        )}
                    </Col>
                </Block>
                <Block shim>
                    <Col shim>
                        <h1>{previewing}</h1>
                        <Row>
                            <Button onClick={ () => dispatch(viewDetailPanel('summary')) }>Summary</Button>
                            <Button onClick={ () => dispatch(viewDetailPanel('cards')) }>Cards</Button>
                        </Row>
                        {detailPanel == 'cards'?
                            // $FlowFixMe
                            <CardPanel cards={cardSets.get(previewing)? [...cardSets.get(previewing).cards()].map(C => new C()): []}/>:
                            // $FlowFixMe
                            <h3> {cardSets.get(previewing)? cardSets.get(previewing).description: 'Empty'} </h3>
                        }
                    </Col>
                </Block>
            </Row>
            <Block>
                <Row>
                    <Shim/>
                    <Button onClick={ click => 
                        dispatch(cancelCharacterSelection())
                    }>Cancel</Button>
                    <Button onClick={ click => 
                        selectCharacter(dispatch)
                    }>Confirm</Button>
                </Row>
            </Block>
        </Col>
    </Modal>:
    <Modal>
        <Col shim>
            <Block fill><h1>New Game</h1></Block>
            <Shim/>
            <Row>
                <Shim/>
                <CharacterPanel index='0' character={character}/>
                <CharacterPanel index='1' character={character}/>
                <CharacterPanel index='2' character={character}/>
                <Shim/>
            </Row>
            <Shim/>
            <Row>
                <Shim/>
                <Route render={({ history }) => 
                    <Button primary onClick={click => {
                        history.push('/menu/main')
                    }}>Back</Button>
                }/>
                <Route render={({ history }) => 
                    <Button primary onClick={click => {
                        resolver.processAction(new StartGame({}, {}, {
                            seed: 100345,
                            character,
                        }))
                        history.push('/game/pathSelection')
                    }}>Begin</Button>
                }/>
            </Row>
        </Col>
    </Modal>
})