// TODO: use styled component

const sty = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '-1500px',
    width: 0,
    height: 0,
    position: 'relative',
}

export const CenterPoint = ({ content }: any) => 
    <div style={sty}>{ content }</div>