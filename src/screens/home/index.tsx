import { useControls } from 'leva'
import React from 'react'
import useStore, { Listing } from 'store/index'
import Brand from 'ui/brand'
import Grid from 'ui/grid'
import NFTPreview from 'ui/nft-preview'
import Styles from './styles.module.css'

export default function HomeScreen () {

    // Store
    const { listings, dab } = useStore();

    const allListings = Object.values(listings).flat();
    const priceRange = allListings.reduce((prev, x) => [x.price < prev[0] ? x.price : prev[0], x.price > prev[1] ? x.price : prev[1]], [0, 0])

    // State
    const [count, setCount] = React.useState<number>(document.documentElement.clientWidth >= 1920 ? 24 : 12);
    const [offset, setOffset] = React.useState<number>(0);
    const [price, setPrice] = React.useState<number>(priceRange[1]);
    const visibleListings = allListings.filter(x => x.price <= price).slice(offset, offset + count);

    console.log(visibleListings.length)

    // Display controls
    useControls('Listings', {
        offset: {
            value: offset,
            min: 0,
            max: allListings.length,
            step: 1,
            onChange: val => setOffset(val > allListings.length - count ? allListings.length - count : val),
            // onChange: val => setOffset(val > visibleListings.length - count ? visibleListings.length - count : val),
        },
        count: {
            value: count,
            min: 6,
            max: 24,
            step: 3,
            onChange: setCount,
        },
        priceMax: {
            value: priceRange[1],
            min: priceRange[0],
            max: priceRange[1],
            step: 1,
            onChange: setPrice,
        },
    });

    // Render
    return <div className={Styles.root}>
        <div className={Styles.side}>
            <Brand />
            {dab.map(collection => <div>{collection.name}</div>)}
        </div>
        <div className={Styles.main}>
            <Grid>
                {visibleListings.map(listing => <NFTPreview key={`preview${listing.id}`} listing={listing} />)}
            </Grid>
        </div>
    </div>
};