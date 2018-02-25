
type Props = {
    name: string,
    color: string,
    health: number,
    maxHealth: number,
    block: number,
}

export const Creature = ({ name, color, health, maxHealth, block }: Props) => {
    return <div style={sty.creature}>
        <div style={{ backgroundColor: color, ...sty.img }}/>
        <div style={sty.healthBar}>
            <div style={sty.healthBarFill(health, block, maxHealth)}/>
            <div style={sty.healthBarEmpty(health, block, maxHealth)}/>
            <div style={sty.healthBarBlock(health, block, maxHealth)}/>
        </div>
    </div>
};

const sty = {
    creature: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    img: {
        width: '250px',
        height: '250px',
    },
    healthBar: {
        display: 'flex',
        flexDirection: 'horizontal',
        width: '400px',
        height: '30px',
    },
    healthBarFill(current, block, max){
        return {
            flex: current,
            backgroundColor: '#ff1111',
        }
    },
    healthBarEmpty(current, block, max){
        return {
            flex: max - current,
            backgroundColor: '#441515',
        }
    },
    healthBarBlock(current, block, max){
        return {
            flex: block,
            backgroundColor: '#2266aa',
        }
    },
};