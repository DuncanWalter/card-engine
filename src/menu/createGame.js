import { Link, Route } from 'react-router-dom'
import {
  Button,
  Block,
  Frame,
  Modal,
  Col,
  Row,
  Shim,
  Material,
} from '../utility'
import { resolver } from '../events/eventResolver'
import { StartGame } from '../events/startGame'
import { withState, dispatch } from '../state'
import { setCharacter } from './menuState'
import { characters, type CharacterName } from '../character'
import { CardPanel } from '../game/cardPanel'
import { Entity, toExtractor } from '../utils/entity'
import { registerOverlay, OverlayContext } from '../game/overlay'
import styled from 'styled-components'
import React from 'react'

const Display = Material.extend`
  min-width: 240px;
  min-height: ${(props) => (props.flat ? '0' : '240px')};
  max-width: 240px;
  max-height: ${(props) => (props.flat ? '0' : '240px')};
  margin: 12px;
  flex: 0 0 33%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.available !== false ? props.color : '#1a1a24'};
  cursor: ${(props) => (props.available !== false ? 'pointer' : 'inherit')};
`

const previewCharacter = registerOverlay(({ resolve, character }) => {
  return (
    <Col shim>
      <h1>{character.name}</h1>
      <p>{character.description}</p>
      <CardPanel
        sets={[character.name]}
        cards={[...character.cards()].map((Card) => new Card())}
      />
      <Row>
        <Button danger onClick={(click) => resolve(undefined)}>
          Back
        </Button>
        <Button primary onClick={(click) => resolve(character)}>
          Confirm
        </Button>
      </Row>
    </Col>
  )
})

const selectCharacter = registerOverlay(({ resolve, character, index }) => {
  return (
    <Col shim style={{ alignItems: 'center' }}>
      <h1>Select Character</h1>
      <Row style={{ flexWrap: 'wrap', maxWidth: '800px' }}>
        {[...characters.values()]
          .filter(
            (set) =>
              set.playable &&
              (!character.includes(set.name) || character[index] == set.name)
          )
          .map((character) => (
            <Display
              available={true}
              color={character.color}
              onClick={(click) =>
                previewCharacter({ character }).then((confirmed) => {
                  if (confirmed) {
                    resolve(character.name)
                  }
                })
              }
            >
              <h3>{character.name}</h3>
            </Display>
          ))}
        {/* TODO: Add The Random Option and confirmation */}
        <Display available={true} color={'#33333d'}>
          <h3>Random</h3>
        </Display>
        <Display flat />
        <Display flat />
      </Row>
      <Row>
        <Button danger onClick={(click) => resolve(undefined)}>
          Back
        </Button>
      </Row>
    </Col>
  )
})

const CharacterSlot = ({ index, character }) => {
  const available = isAvailable(index, character)
  const set = characters.get(character[index])
  return (
    <Display
      available={available}
      color={set ? set.color : '#777777'}
      onClick={(click) => {
        if (available) {
          selectCharacter({ index, character }).then((selection) => {
            if (selection) {
              dispatch(setCharacter(selection, index))
            }
          })
        }
      }}
    >
      <h3>{available ? character[index] || 'Empty' : ''}</h3>
    </Display>
  )
}

// TODO: modals should only display top child
export const CreateGame = withState(({ state, match, history }) => {
  console.log('stuff', match, history)
  const menu = state.menu
  return (
    <Modal>
      <OverlayContext match={match}>
        <Col shim>
          <h1>Create Game</h1>
          <Shim />
          <Row>
            <CharacterSlot index={0} character={menu.character} />
            <CharacterSlot index={1} character={menu.character} />
            <CharacterSlot index={2} character={menu.character} />
          </Row>
          <Shim />
          <Row>
            <Button
              danger
              onClick={(click) => {
                history.goBack()
              }}
            >
              Back
            </Button>
            <Button
              primary
              onClick={(click) => {
                // TODO: Delete the blank
                const blank = new Entity({}, toExtractor({}))
                resolver
                  .processEvent(
                    StartGame(blank, blank, {
                      seed: 100345,
                      character: [...menu.character],
                    })
                  )
                  .then((val) => {
                    history.push('/game/pathSelection')
                  })
              }}
            >
              Begin
            </Button>
          </Row>
        </Col>
      </OverlayContext>
    </Modal>
  )
})

function isAvailable(index: number, character: CharacterName[]): boolean {
  return index == 0 || character[index - 1] !== ''
}

// export const CreateGame = withState(({ state }) => {
//     let { isSelecting, selectingIndex, previewing, character, detailPanel } = state.menu
//     return isSelecting? <Modal>
//         <Col shim>
//             <Row shim>
//                 <Block>
//                     <h2>Card Sets</h2>
//                     <Col>
//                         {selectingIndex!=0? <Button onClick={ click =>
//                             previewCharacter(dispatch, undefined)
//                         }>
//                             <h3>Empty</h3>
//                         </Button>: null}
//                         {[...characters.values()].filter(set => set.playable && (!character.includes(set.name) || character[selectingIndex] == set.name)).map(set =>
//                             <Button onClick={ click =>
//                                 previewCharacter(dispatch, set.name)
//                             }>
//                                 <h3>{set.name == previewing? set.name: set.name}</h3>
//                             </Button>
//                         )}
//                     </Col>
//                 </Block>
//                 <Block shim>
//                     <Col shim>
//                         <h1>{previewing}</h1>
//                         <Row>
//                             <Button onClick={ () => dispatch(viewDetailPanel('summary')) }>Summary</Button>
//                             <Button onClick={ () => dispatch(viewDetailPanel('cards')) }>Cards</Button>
//                         </Row>
//                         {detailPanel == 'cards'?
//                             <CardPanel
//                                 sets={[previewing]}
//                                 // TODO: catch gracefully
//                                 cards={[...(characters.get(previewing)||{cards(){return[]}}).cards()].map(C => new C())}
//                             />:
//                             // $FlowFixMe
//                             <h3> {characters.get(previewing)? characters.get(previewing).description: 'Empty'} </h3>
//                         }
//                     </Col>
//                 </Block>
//             </Row>
//             <Block>
//                 <Row>
//                     <Shim/>
//                     <Button onClick={ click =>
//                         dispatch(cancelCharacterSelection())
//                     }>Cancel</Button>
//                     <Button onClick={ click =>
//                         selectCharacter(dispatch)
//                     }>Confirm</Button>
//                 </Row>
//             </Block>
//         </Col>
//     </Modal>:
//     <Modal>
//         <Col shim>
//             <Block fill><h1>New Game</h1></Block>
//             <Shim/>
//             <Row>
//                 <Shim/>
//                 <CharacterPanel index='0' character={character}/>
//                 <CharacterPanel index='1' character={character}/>
//                 <CharacterPanel index='2' character={character}/>
//                 <Shim/>
//             </Row>
//             <Shim/>
//             <Row>
//                 <Shim/>
//
//             </Row>
//         </Col>
//     </Modal>
// })
