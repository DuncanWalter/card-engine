import type { Rarity } from '../character';
import type { Card as CardObject } from './card'
import type { State } from '../state';
import type { Game } from '../game/battle/battleState'
import { resolver } from '../events/eventResolver'
import { PlayCard } from '../events/playCard'
import { renderEffect as EffectComponent } from '../effects/renderEffect'
import { withState } from '../state';
import { CardLibrary } from './cardLibrary';
import styled from 'styled-components';
import { ToolTips } from '../components/toolTips';
import { Effect } from '../effects/effect'

import mask from '../../static/images/316151-200.png'
import { Material, Col } from '../utility';

interface Props {
    card: CardObject<>,
    state: State,
    glow: boolean,
    sets?: string[],
}





// TODO: consider bringing back rarity indicating glow
const CardBack = Material.extend`
    min-width: 280px;
    min-height: 440px;
    max-width: 280px;
    max-height: 440px;
    position: relative;
    cursor: pointer;
`

const CardDivider = styled.div`
    width: 100%;
    height: 8px;
    background-color: #1a1a1a;
`

// TODO: border radius troubles
const CardTitle = styled.div`
    height: 40px;
    background-color: ${ props => 
        props.membership.color
    };
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    font-style: bold;
    z-index: 1;
`

// TODO: border radius troubles
const CardText = styled.div`
    height: 190px;
    background-color: #1a1a1a;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 5px 23px 5px;
    text-align: center;
    font-size: 1.3rem;
`

const CardVignette = styled.div`
    flex: 1;
    width: 100%;
    height: 100%;
    mask: url(${window.location + '/../' + mask}) center center no-repeat;
    background-color: ${ props => 
        props.color 
    };
`

const CardImage = styled.div`
    flex: 1;
    background-color: #ccc9bf;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 200px;
`

const CardEffects = styled.div`
    position: absolute;
    top: 48px;
    left: -20px;
    display: flex;
    flex-direction: column;
`

const CardCost = styled.div`
    position: absolute;
    ${ props => 
        props.playable ? `
            left: -8px;
            top: -8px;
            width: 56px;
            height: 56px;
            border-radius: 28px;
        ` : `
            left: 0;
            top: 0;
            width: 40px;
            height: 40px;
            border-radius: 0;
        `
    }
    transition: 0.7s;
    background-color: ${ props => 
        props.energy === undefined ? '#1a1a1a' : '#eeeeee'
    };
    justify-content: center;
    align-items: center;
    display: flex;
    font-size: 2.0rem;
    box-shadow: ${ props => 
        props.playable ? `
            0 4px 12px rgba(0, 0, 0, 0.25),
            0 2px 8px rgba(0, 0, 0, 0.25),
            0 0 4px rgba(0, 0, 0, 0.50)
        ` : 'none'
    };
    color: ${ props =>
        props.membership.color
    };
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

const CardEffectWrapper = styled.div`
    max-width: 16px;
    height: 40px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    transition: 0.4s;
    border-radius: 20px;
    margin-bottom: 4px;
    background-color: #000000;
    overflow: hidden;
    padding: 0 12px 0;
    & p {
        color: transparent
    }
    &:hover {
        max-width: 280px;
        p {
            color: inherit
        }
    }
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25),
                0 2px 8px rgba(0, 0, 0, 0.25),
                0 0 4px rgba(0, 0, 0, 0.50);
`

const CardEffect = ({effect}) => effect.appearance ? <CardEffectWrapper>
    { effect.stacks + ' - '+effect.appearance.name }
</CardEffectWrapper> : null

export const Card = withState(({ card, state, glow, sets, playEnergy }) => {

    const game: Game = resolver.state.getGame()
 
    const actors = new Set()
    actors.add(game.player)
    actors.add(card)

    // TODO: need to rework the energy part to check for price and playability 
    let { energy, color, text, title } = card.simulate({
        actors,
        subject: card,
        resolver,
        data: card.data,
        game,
    })

    // TODO: get the color fade for multiple ownerships
    let membership = CardLibrary.getCardMembership(sets || [], card)

    return <CardBack membership={membership} glow={glow}><Col>
        {/* <CardBase membership={membership} > */}
        <CardTitle membership={membership}>
            {title}
            <CardCost membership={membership} energy={energy} playable={ playEnergy >= energy }>
                <b>{energy}</b>
            </CardCost>
        </CardTitle>
        {/* <CardAccent membership={membership}/> */}
        {/* <CardDivider/> */}
        <CardImage color={color}>
            <CardVignette color={color}/>
        </CardImage>
        {/* <CardAccent membership={membership}/> */}
        {/* <CardDivider/> */}
        <CardText membership={membership}>{text}</CardText>
        {/* <CardAccent membership={membership}/> */}
        {/* </CardBase> */}
        {/* <CardCost membership={membership}>
            <b>{energy}</b>
        </CardCost> */}
        {/* <CardRarity membership={membership}/> */}
        
        </Col>
        <ToolTips effects={ card.effects }/>
        <CardEffects>
            {[...card.effects].map(effect => <CardEffect effect={effect}/>)}
        </CardEffects>
    </CardBack>
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





// import type { Rarity } from '../character';
// import type { Card as CardObject } from './card'
// import type { State } from '../state';
// import type { Game } from '../game/battle/battleState'
// import { resolver } from '../events/eventResolver'
// import { PlayCard } from '../events/playCard'
// import { renderEffect as EffectComponent } from '../effects/renderEffect'
// import { withState } from '../state';
// import { CardLibrary } from './cardLibrary';
// import styled from 'styled-components';
// import { ToolTips } from '../components/toolTips';

// interface Props {
//     card: CardObject<>,
//     state: State,
//     glow: boolean,
//     sets?: string[],
// }

// // TODO: consider bringing back rarity indicating glow
// const CardBack = styled.div`
//     min-width: 272px;
//     min-height: 432px;
//     max-width: 272px;
//     max-height: 432px;
//     padding: 4px;
//     position: relative;
//     border-radius: 12px;
//     cursor: pointer;
//     box-shadow: ${ props => {
//         if(props.glow){
//             let color = colorRarity(props.membership.rarity)
//             return `0px 0px 20px #ffffff`
//         } else {
//             return '0px 0px 0px #000000'
//         }
//     }};
//     background-color: ${ props =>
//         props.glow? '#ffffff': '#22222b'
//     };
// `












// const CardBase = styled.div`
//     height: 416px;
//     display: flex;
//     flex-direction: column;
//     border-radius: 8px;
//     padding: 8px;
//     color: #ffeedd;
//     background-color: ${ props => 
//         props.membership.color
//     };
// `

// const CardDivider = styled.div`
//     width: 100%;
//     height: 8px;
// `

// const CardAccent = styled.div`
//     width: 100%;
//     height: 4px;
//     background-color: ${ props => 
//         colorRarity(props.membership.rarity) 
//     };
// `

// const CardTitle = styled.div`
//     height: 50px;
//     background: radial-gradient(circle, rgba(22, 22, 22, 0.35) 50%, rgba(22, 22, 22, 0.65));
//     justify-content: center;
//     align-items: center;
//     display: flex;
//     flex-direction: row;
//     border-radius: 8px;
// `

// const CardText = styled.div`
//     height: 170px;
//     background: radial-gradient(circle, rgba(22, 22, 22, 0.35) 50%, rgba(22, 22, 22, 0.65));
//     justify-content: center;
//     align-items: center;
//     display: flex;
//     flex-direction: row;
//     padding: 5px 23px 5px;
//     text-align: center;
//     border-radius: 8px;
// `

// const CardVignette = styled.div`
//     width: 100%;
//     height: 100%;
//     border-radius: 8px;
//     background: radial-gradient(circle, rgba(22, 22, 22, 0) 55%, rgba(22, 22, 22, 0.35));
// `

// const CardImage = styled.div`
//     flex: 1;
//     background-color: ${ props =>
//         props.color
//     };
//     border-radius: 8px;
// `

// const CardEffects = styled.div`
//     position: absolute;
//     top: 57px;
//     left: 3px;
// `

// const CardCost = styled.div`
//     position: absolute;
//     left: -15px;
//     top: -15px;
//     width: 44px;
//     height: 44px;
//     background-color: #ffffff;
//     /* background: ${ props => 
//         `radial-gradient(${props.membership.color}, #ffffff)`
//     }; */
//     border-radius: 22px;
//     justify-content: center;
//     align-items: center;
//     display: flex;
//     font-size: 2.0rem;
//     font-style: bold;
//     box-shadow: 0px 0px 22px #ffffff;
//     color: ${ props =>
//         props.membership.color
//     };
// `

// const CardRarity = styled.div`
//     position: absolute;
//     right: -3px;
//     bottom: 186px;
//     width: 20px;
//     height: 20px;
//     background-color: ${ props => 
//         colorRarity(props.membership.rarity)
//     };
//     box-shadow: ${ props => 
//         `
//         0px 3px 0px rgba(0, 0, 0, 0.35),
//         0px 0px 12px ${colorRarity(props.membership.rarity)};
//         `
//     };

//     border-radius: 10px;
// `

// export const Card = withState(({ card, state, glow, sets }) => {

//     const game: Game = resolver.state.getGame()
 
//     const actors = new Set()
//     actors.add(game.player)
//     actors.add(card)

//     // TODO: need to rework the energy part to check for price and playability 
//     let { energy, color, text, title } = card.simulate({
//         actors,
//         subject: card,
//         resolver,
//         data: card.data,
//         game,
//     })

//     // TODO: get the color fade for multiple ownerships
//     let membership = CardLibrary.getCardMembership(sets || [], card)

//     return <CardBack membership={membership} glow={glow}>
//         <CardBase membership={membership} >
//             <CardTitle membership={membership}>{title}</CardTitle>
//             {/* <CardAccent membership={membership}/> */}
//             <CardDivider/>
//             <CardImage color={color}>
//                 <CardVignette/>
//             </CardImage>
//             {/* <CardAccent membership={membership}/> */}
//             <CardDivider/>
//             <CardText membership={membership}>{text}</CardText>
//             {/* <CardAccent membership={membership}/> */}
//         </CardBase>
//         <CardCost membership={membership}>
//             <b>{energy}</b>
//         </CardCost>
//         <CardRarity membership={membership}/>
//         <ToolTips effects={ card.effects }/>
//     </CardBack>
// })

// function colorRarity(rarity: Rarity){
//     switch(rarity){
//         case 'A': return "#ffa305"
//         case 'B': return "#ce54ff"
//         case 'C': return "#54a9ff"
//         case 'D': return "#59ff54"
//         case 'F': return "#46464f"
//         default : return "#ffffff"
//     }
// }