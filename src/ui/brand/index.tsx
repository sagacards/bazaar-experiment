import React from 'react'
import Styles from './styles.module.css'

import AlphaTag, { Wrapper as AlphaWrap } from 'ui/alpha-tag'
import Heading from 'ui/heading'

export default function Brand () {
    return <div className={Styles.root}>
        <AlphaWrap>
            <Heading>Bazaar</Heading>
            <AlphaTag />
        </AlphaWrap>
        <div className={Styles.message}>The digital tarot market</div>
    </div>
};