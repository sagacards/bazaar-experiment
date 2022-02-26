import { useControls } from 'leva'
import React from 'react'
import useStore, { Listing } from 'store/index'
import Brand from 'ui/brand'
import Grid from 'ui/grid'
import NFTPreview from 'ui/nft-preview'
import Styles from './styles.module.css'

export default function HomeScreen () {

    // Store
    const { listings, setListings } = useStore();

    // State
    const [count, setCount] = React.useState<number>(12);
    const [offset, setOffset] = React.useState<number>(0);

    // Display controls
    useControls('Listings', {
        offset: {
            value: offset,
            min: 0,
            max: listings.length,
            step: 1,
            onChange: val => {
                if (val > listings.length - count) {
                    setOffset(listings.length - count);
                } else {
                    setOffset(val)
                }
            },
        },
        count: {
            value: count,
            min: 6,
            max: 24,
            step: 3,
            onChange: setCount,
        },
    });

    // Pagination
    const items = listings.slice(offset, offset + count);

    // Render
    return <div className={Styles.root}>
        <div className={Styles.side}>
            <Brand />
        </div>
        <div className={Styles.main}>
            <Grid>
                {items.map(listing => <NFTPreview key={`preview${listing.id}`} listing={listing} />)}
            </Grid>
        </div>
    </div>
};