import React from 'react'
import useStore from 'store/index'
import { useControls } from 'leva'
import Brand from 'ui/brand'
import Grid from 'ui/grid'
import NFTPreview from 'ui/nft-preview'
import scroll from 'util/scroll'
import Styles from './styles.module.css'

export default function HomeScreen () {

    // DOM refs
    const main = React.useRef<HTMLDivElement>(null);

    // Store
    const { listings, dab } = useStore();

    const allListings = React.useMemo(() => Object.values(listings).flat(), [listings]);
    const priceRange = React.useMemo(() => allListings.reduce((prev, x) => [x.price < prev[0] ? x.price : prev[0], x.price > prev[1] ? x.price : prev[1]], [0, 0]), [allListings])

    // State
    const [count, setCount] = React.useState<number>(document.documentElement.clientWidth >= 1920 ? 24 : 12);
    const [offset, setOffset] = React.useState<number>(0);
    const [price, setPrice] = React.useState<number>(priceRange[1]);
    const [sort, setSort] = React.useState<string>('price');
    const [asc, setAsc] = React.useState<boolean>(true);
    const [collections, setCollections] = React.useState<{ [key : string]: boolean}>({});

    // Load collections filters
    React.useEffect(() => setCollections(Object.values(dab).reduce((agg, x) => ({ ...agg, [x.principal_id.toText()] : true }), {})), [dab])

    // Filter listings to the visible set.
    const visibleListings = React.useMemo(() => {
        return allListings
            .filter(x => x.price <= price && Object.keys(collections).filter(y => collections[y], []).includes(x.canister))
            .sort(
                sort === 'price'
                ? (a, b) => asc ? a.price - b.price : b.price - a.price
                : (a, b) => asc ? a.id - b.id : b.id - a.id
            )
            .slice(offset, offset + count)
    }, [offset, count, price, sort, asc, collections]);

    // Scroll to top when offset changes
    React.useEffect(() => void (main.current != null && scroll(main.current)), [offset]);

    // Display controls
    useControls('Listings', {
        offset: {
            value: offset,
            min: 0,
            max: allListings.length,
            step: 3,
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
            onChange: val => { setPrice(val); setOffset(0) },
        },
        sort: {
            options: ['price', 'id'],
            onChange: setSort,
        },
        asc: {
            value: asc,
            onChange: setAsc,
        },
        ...dab.reduce((agg, x) => ({
            ...agg,
            [x.principal_id.toText()]: {
                value: true,
                label: x.name,
                onChange: (val : boolean) => setCollections(y => ({ ...y, [x.principal_id.toText()] : val}))
            },
        }), {})
    });

    // Render
    return <div className={Styles.root}>
        <div className={Styles.side}>
            <Brand />
        </div>
        <div className={Styles.main} ref={main}>
            <Grid
                children={
                    visibleListings.length
                    ? visibleListings.map(listing => <NFTPreview key={`preview${listing.id}`} listing={listing} />)
                    : undefined
                }
            />
        </div>
    </div>
};