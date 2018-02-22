

const a: any = Object.assign;

type Props = {
    text: string,
    title: string,
    energy: string,
    color: string,
}

export const Card = ({ text, title, energy, color }: Props) => (
    // use props, of course...
    <div style={styles.base}>
        <div style={styles.costBack}>{energy}</div>
        <div style={styles.title}>{title}</div>
        <div style={a({ backgroundColor: color }, styles.image)}></div>
        <div style={styles.text}>{text}</div>
    </div>
);


const styles = {
    base: {
        width: '320px',
        height: '490px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#222222',
        position: 'relative',
        borderRadius: '8px',
        padding: '4px',
        cursor: 'pointer',
    },
    title: {
        flex: '1',
        backgroundColor: '#555555',
        borderRadius: '8px',
        textAlign: 'center',

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
        textAlign: 'center',

    },
    text: {
        flex: '6',
        backgroundColor: '#555555',
        borderRadius: '8px',
        textAlign: 'center',
    },

};







