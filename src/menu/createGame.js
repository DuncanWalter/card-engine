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


// TODO: add a clear button to the character panels?

const CharacterPanel = ({ index, character }) => {
    
    const set = cardSets.get(character[index])

    return <Button onClick={ click => 
        beginSelectingCharacter(dispatch, index)
    }>
        <div style={{ 
            width: '220px', 
            height: '220px', 
            cursor: 'pointer', 
            backgroundColor: set? set.color: '#333333',
            margin: '15px', 
        }}>
            { set? set.name: '' }
        </div>
    </Button>
    
}





export const CreateGame: Component<> = withState(({ state }) => {

    let { isSelecting, selectingIndex, previewing, character, detailPanel } = state.menu

    return <div>
        <Modal>
            <Block>
                <Col center style={{ width: '1200px', height: '800px' }}>
                    <h1>New Game</h1>
                    <h1>Character Selection</h1>
                    <Row>
                        <Shim/>
                        <CharacterPanel index='0' character={character}/>
                        <CharacterPanel index='1' character={character}/>
                        <CharacterPanel index='2' character={character}/>
                        <Shim/>
                    </Row>
                    <h2>Seeding</h2>
                    <input type="text"/>
                    <Route render={({ history }) => 
                        <Button onClick={click => {
                            resolver.processAction(new StartGame({}, {}, {
                                seed: 100345,
                                character,
                            }))
                            history.push('/game/pathSelection')
                        }}>Begin</Button>
                    }/>
                </Col>
            </Block>
        </Modal>

        {
            isSelecting? <Modal>
                <Col style={{ width: '1200px', height: '800px' }}>
                    <Row>
                        <Block>
                            <h2>Card Sets</h2>
                            <Col>
                                {selectingIndex!=0? <Button onClick={ click => 
                                    previewCharacter(dispatch, '')
                                }>
                                    <h3>Empty</h3>
                                </Button>: null}
                                {[...cardSets.values()].filter(set => set.playable && !character.includes(set.name)).map(set =>
                                    <Button onClick={ click => 
                                        previewCharacter(dispatch, set.name)
                                    }>
                                        <h3 style={{ color: set.color }}>{set.name == previewing?'!!'+set.name+'!!':set.name}</h3>
                                    </Button>
                                )}
                            </Col>
                        </Block>
                        <Block flex='1'>
                            <Col>
                                <h1>{previewing}</h1>
                                <Row>
                                    <Button onClick={ dispatch(viewDetailPanel('summary')) }>Summary</Button>
                                    <Button onClick={ dispatch(viewDetailPanel('cards')) }>Cards</Button>
                                </Row>
                                {detailPanel == 'cards'?
                                    <CardPanel cards={cardSets.get(previewing)? [...cardSets.get(previewing).cards()].map(C => new C()): []}/>:
                                    <h1> {cardSets.get(previewing)? cardSets.get(previewing).description: 'Empty'} </h1>
                                }

                            </Col>
                        </Block>
                    </Row>
                    <Row>
                        <Button onClick={ click => 
                            // TODO: need a way to cancel
                            dispatch(cancelCharacterSelection())
                        }>Cancel</Button>
                        <Button onClick={ click => 
                            selectCharacter(dispatch)
                        }>Confirm</Button>
                    </Row>
                </Col>
            </Modal>: null
        }

    </div>
})