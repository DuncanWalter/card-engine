import styled from 'styled-components';
import React from 'react'


export const Transform = (props: any) => <div
    style={{
        ...props.style, 
        position: 'relative', 
        transform: `translate(${props.x}px, ${props.y}px) rotate(${ props.a }deg)`,
    }}
>
    { props.children }
</div>    
    