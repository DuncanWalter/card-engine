import { Card as CardObject } from "../../../engine/cards/card"
import { gameState } from "../../../engine/gameState"
import { PlayCard } from "../../../engine/actions/playCard";

const a: any = Object.assign;

type Props = {
    card: CardObject<any>,
    game: typeof gameState,
}

export const Card = ({ game, card }: Props) => {

    const { energy, color, text, title } = card.simulate({
        actor: game.player, 
        subject: game.enemies[0], 
        resolver: game.resolver,
    })

    const clicked = e => {
        // use a dispatch and a display state TODO:
        game.resolver.enqueueActions(
            new PlayCard(
                game.player, 
                card,
                {
                    target: game.enemies[0],
                    success: false,
                }
            )
        )
    }

    return <div style={styles.base} onClick={clicked}>
        <div style={styles.costBack}>{energy}</div>
        <div style={styles.title}>{title}</div>
        <div style={a({ backgroundColor: color }, styles.image)}></div>
        <div style={styles.text}>{text}</div>
    </div>
}


const styles = {
    base: {
        width: '320px',
        height: '470px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#222222',
        position: 'relative',
        borderRadius: '8px',
        padding: '4px',
        cursor: 'pointer',
        color: '#ffeedd',
    },
    title: {
        flex: '1',
        backgroundColor: '#555555',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    image: {
        flex: '5',
        borderRadius: '8px',
        borderBottom: '4px solid #222222',
        borderTop: '4px solid #222222',
    },
    costBack: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '50px',
        height: '50px',
        backgroundColor: '#777777',
        borderRadius: '8px',
        border: '4px solid #222222',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    text: {
        flex: '4',
        backgroundColor: '#333333',
        borderRadius: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        padding: '30px',
    },
};







