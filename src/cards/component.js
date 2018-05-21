import type { Rarity } from './cardSet';
import type { Card as CardObject } from './card'
import type { State } from '../state';
import type { Game } from '../game/battle/battleState'
import { resolver } from '../events/eventResolver'
import { PlayCard } from '../events/playCard'
import { renderEffect as EffectComponent } from '../effects/renderEffect'
import { withState } from '../state';
import { CardLibrary } from './cardLibrary';
import styled from 'styled-components';

interface Props {
    card: CardObject<>,
    state: State,
    glow: boolean,
    sets?: string[],
}

// TODO: concider bringing back rarity indicating glow
const CardBack = styled.div`
    min-width: 272px;
    min-height: 432px;
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

export const Card = withState(({ card, state, glow, sets }) => {

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


    // TODO: play costs need to be re-added
    return <CardBack membership={membership} glow={glow}>
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