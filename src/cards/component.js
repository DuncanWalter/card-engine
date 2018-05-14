// import type { Component } from '../component'
// import type { Rarity } from './cardSet';
// import type { Card as CardObject } from './card'
// import type { State } from '../state';
// import { Entity } from '../components/entity'
// import { resolver } from '../actions/actionResolver'
// import { PlayCard } from '../actions/playCard'
// import { renderEffect as EffectComponent } from '../effects/renderEffect'
// import { withState } from '../state';
// import { CardLibrary } from './cardLibrary';
// import styled from 'styled-components';

// interface Props {
//     card: CardObject<>,
//     state: State,
// }

// const CardBack = styled.div`
//     min-width: 280px;
//     min-height: 440px;
//     padding: 4px;
//     position: relative;
//     border-radius: 16px;
//     cursor: pointer;
//     background-color: #22222b;
//     display: flex;
//     flex-direction: column;
//     color: #ffeedd;
// `

// const CardText = styled.div`
//     height: 170px;
//     background-color: ${props => props.membership.color};
//     justify-content: center;
//     align-items: center;
//     display: flex;
//     flex-direction: row;
//     padding: 5px 23px 5px;
//     text-size: 0.8em;
//     border-bottom-left-radius: 12px;
//     border-bottom-right-radius: 12px;
// `

// const CardDivider = styled.div`
//     width: 100%;
//     height: 8px;
// `

// // const CardAccent = styled.div`
// //     width: 100%;
// //     height: 4px;
// //     background-color: ${ props => 
// //         colorRarity(props.membership.rarity) 
// //     };
// // `

// const CardTitle = styled.div`
//     height: 50px;
//     background: linear-gradient(rgba(34, 34, 44, 00), #22222b);
//     justify-content: center;
//     align-items: center;
//     display: flex;
//     flex-direction: row;
// `

// const CardImageFade = styled.div`
//     width: 100%;
//     height: 50px;
//     background: ${ props => 
//         `linear-gradient(rgba(0, 0, 0, 0), ${props.membership.color})`
//     }
// `

// const CardImage = styled.div`
//     flex: 1;
//     background-color: ${ props =>
//         props.color
//     };
//     display: flex;
//     flex-direction: column;
//     border-top-left-radius: 12px;
//     border-top-right-radius: 12px;
// `

// // const CardEffects = styled.div`
// //     position: absolute;
// //     top: 57px;
// //     left: 3px;
// // `

// const CardCost = styled.div`
//     position: absolute;
//     left: -17px;
//     top: -17px;
//     width: 50px;
//     height: 50px;
//     background-color: #777777;
//     border-radius: 25px;
//     border: 4px solid #222222;
//     justify-content: center;
//     align-items: center;
//     display: flex;
// `

// export const Card: Component<Props> = withState(({ card, state, bloom }) => {

//     const actors = new Set()
//     actors.add(state.battle.player)
//     actors.add(card)

//     // TODO: need to rework the energy part to check for price and playability 
//     let { energy, color, text, title } = card.simulate({
//         actors,
//         subject: card,
//         target: state.battle.dummy, 
//         resolver: resolver,
//         data: card.data,
//         game: state.battle,
//     })

//     // TODO: get the color fade for multiple ownerships
//     let cardMembership = CardLibrary.getCardMembership(state.battle.player, card)
//     let membership = cardMembership || { rarity: 'F', color: '#353542' }

//     const clicked = e => {
//         // use a dispatch and a display state TODO:
//         resolver.enqueueActions(
//             new PlayCard(
//                 state.battle.player, 
//                 card,
//                 {
//                     from: state.battle.hand,
//                 }
//             )
//         )
//     }

//     return <Entity entity={card}>
//         <CardBack onClick={clicked}>
//             {/* <CardTitle membership={membership}>{title}</CardTitle> */}
//             <CardImage color={color}>
//                 <div style={{ flex: 1 }}/>
//                 <CardImageFade membership={membership}/>
//             </CardImage>
//             <CardText membership={membership}>{text}</CardText>
//             <CardCost>{energy}</CardCost>
//         </CardBack>
//     </Entity>
// })

// function colorRarity(rarity: Rarity){
//     switch(rarity){
//         case 'A': return "#ffa305"
//         case 'B': return "#ce54ff"
//         case 'C': return "#54a9ff"
//         case 'D': return "#59ff54"
//         case 'F': return "#22222b"
//     }
// }

import type { Component } from '../component'
import type { Rarity } from './cardSet';
import type { Card as CardObject } from './card'
import type { State } from '../state';
import type { Game } from '../game/battle/battleState'
import { Entity } from '../components/entity'
import { resolver } from '../actions/actionResolver'
import { PlayCard } from '../actions/playCard'
import { renderEffect as EffectComponent } from '../effects/renderEffect'
import { withState } from '../state';
import { CardLibrary } from './cardLibrary';
import styled from 'styled-components';

interface Props {
    card: CardObject<>,
    state: State,
    glow: boolean,
}

// TODO: concider bringing back rarity indicating glow
const CardBack = styled.div`
    width: 280px;
    height: 440px;
    max-width: 272px;
    max-height: 432px;
    padding: 4px;
    position: relative;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: ${ props => {
        if(props.glow){
            let color = colorRarity(props.membership.rarity)
            return `0px 0px 20px #ffffff`
        } else {
            return '0px 0px 0px #000000'
        }
    }};
    background-color: ${ props =>
        props.glow? '#ffffff': '#22222b'
    };
`

const CardBase = styled.div`
    height: 416px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    padding: 8px;
    color: #ffeedd;
    background-color: ${ props => 
        props.membership.color
    };
`

const CardDivider = styled.div`
    width: 100%;
    height: 8px;
`

const CardAccent = styled.div`
    width: 100%;
    height: 4px;
    background-color: ${ props => 
        colorRarity(props.membership.rarity) 
    };
`

const CardTitle = styled.div`
    height: 50px;
    background: radial-gradient(circle, rgba(22, 22, 22, 0.35) 50%, rgba(22, 22, 22, 0.65));
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    border-radius: 8px;
`

const CardText = styled.div`
    height: 170px;
    background: radial-gradient(circle, rgba(22, 22, 22, 0.35) 50%, rgba(22, 22, 22, 0.65));
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 5px 23px 5px;
    text-align: center;
    border-radius: 8px;
`

const CardVignette = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: radial-gradient(circle, rgba(22, 22, 22, 0) 55%, rgba(22, 22, 22, 0.35));
`

const CardImage = styled.div`
    flex: 1;
    background-color: ${ props =>
        props.color
    };
    border-radius: 8px;
`

const CardEffects = styled.div`
    position: absolute;
    top: 57px;
    left: 3px;
`

const CardCost = styled.div`
    position: absolute;
    left: -15px;
    top: -15px;
    width: 44px;
    height: 44px;
    background-color: #ffffff;
    /* background: ${ props => 
        `radial-gradient(${props.membership.color}, #ffffff)`
    }; */
    border-radius: 22px;
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: 2.0rem;
    box-shadow: 0px 0px 22px #ffffff;
    /* color: ${ props =>
        props.membership.color
    }; */
`

const CardRarity = styled.div`
    position: absolute;
    right: -3px;
    bottom: 186px;
    width: 20px;
    height: 20px;
    background-color: ${ props => 
        colorRarity(props.membership.rarity)
    };
    box-shadow: ${ props => 
        `
        0px 3px 0px rgba(0, 0, 0, 0.35),
        0px 0px 12px ${colorRarity(props.membership.rarity)};
        `
    };

    border-radius: 10px;
`

export const Card: Component<Props> = withState(({ card, state, glow }) => {

    const game: Game = resolver.state.getGame()
 
    const actors = new Set()
    actors.add(game.player)
    actors.add(card)

    // TODO: need to rework the energy part to check for price and playability 
    let { energy, color, text, title } = card.simulate({
        actors,
        subject: card,
        target: game.dummy, 
        resolver,
        data: card.data,
        game,
    })

    // TODO: get the color fade for multiple ownerships
    let cardMembership = undefined // CardLibrary.getCardMembership(game.player, card)
    let membership = cardMembership || { rarity: 'F', color: '#353542' }

    const clicked = e => {
        // use a dispatch and a display state TODO:
        resolver.enqueueActions(
            new PlayCard(
                game.player, 
                card,
                {
                    from: game.hand,
                }
            )
        )
    }

    // TODO: play costs need to be re-added
    return <Entity entity={card}>
        <CardBack membership={membership} glow={glow} onClick={clicked}>
            <CardBase membership={membership} >
                <CardTitle membership={membership}>{title}</CardTitle>
                {/* <CardAccent membership={membership}/> */}
                <CardDivider/>
                <CardImage color={color}>
                    <CardVignette/>
                </CardImage>
                {/* <CardAccent membership={membership}/> */}
                <CardDivider/>
                <CardText membership={membership}>{text}</CardText>
                {/* <CardAccent membership={membership}/> */}
            </CardBase>
            <CardCost membership={membership}>
                <b>{energy}</b>
            </CardCost>
            <CardRarity membership={membership}/>
        </CardBack>
    </Entity>
})

function colorRarity(rarity: Rarity){
    switch(rarity){
        case 'A': return "#ffa305"
        case 'B': return "#ce54ff"
        case 'C': return "#54a9ff"
        case 'D': return "#59ff54"
        case 'F': return "#46464f"
        default : return "#ffffff"
    }
}