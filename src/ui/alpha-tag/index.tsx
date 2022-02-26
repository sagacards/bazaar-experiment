import React from 'react'
import Styles from './styles.module.css'

export function Wrapper (props : { children : React.ReactNode }) {
    return <div className={Styles.root}>{props.children}</div>
}

export default function AlphaTag () {
    return <div className={Styles.tag}>Pre-Alpha</div>
};