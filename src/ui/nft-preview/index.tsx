import React from 'react'
import useStore, { Listing } from 'store/index'
import Spinner from 'ui/spinner';
import Styles from './styles.module.css'

interface Props {
    listing : Listing;
}

export default function NFTPreview (props : Props) {

    // App store.
    const { dab, icpToUSD } = useStore();

    // Component state
    const [play, setPlay] = React.useState<boolean>(false);
    const [readyStatic, setReadyStatic] = React.useState<boolean>(false);
    const [animated, setAnimated] = React.useState<string>();
    
    // Lazy load static thumbnails.
    React.useEffect(() => {
        const url = `https://${props.listing.canister}.raw.ic0.app/${props.listing.id}.webp`;
        const img = new Image();
        img.onload = () => setReadyStatic(true);
        img.src = url;
    }, []);

    // Prefetch animated previews.
    function fetchAnimated () {
        if (animated) return;
        const url = `https://${props.listing.canister}.raw.ic0.app/${props.listing.id}.webm`;
        fetch(url).then(r => r.blob().then(b => {
            var reader = new FileReader();
            reader.readAsDataURL(b); 
            reader.onloadend = function() {
                setAnimated(url);
            }
        }));
    }

    const collection = dab.find(x => x.principal_id.toText() === props.listing.canister);

    return <div className={Styles.root} onMouseEnter={() => { setPlay(true); fetchAnimated(); }} onMouseLeave={() => setPlay(false)}>
        <div className={Styles.stage}>
            {readyStatic && <img className={Styles.static} src={`https://${props.listing.canister}.raw.ic0.app/${props.listing.id}.webp`} />}
            {animated && <video className={[Styles.animated, play && animated ? Styles.animatedPlay : ''].join(' ')} loop autoPlay muted>
                <source src={`${animated}`} type="video/webm" />
            </video>}
            <div className={[Styles.loader, readyStatic && play && !animated ? Styles.loaderHover : ''].join(' ')}><Spinner /></div>
        </div>
        <div className={Styles.meta}>
            <div className={Styles.details}>
                <div className={Styles.title}>
                    <div className={Styles.collection}>{collection?.name}</div>
                    <div className={Styles.mint}>#{props.listing.id}</div>
                </div>
                <img className={Styles.ico} src={collection?.icon} />
            </div>
            <div className={Styles.divider} />
            <div className={Styles.actions}>
                {icpToUSD && <div className={Styles.usd}>${(props.listing.price * icpToUSD).toFixed(2)} USD</div>}
                <div className={Styles.price}>
                    <div className={Styles.priceLabel}>Price</div>
                    <div className={Styles.priceAmount}>{props.listing.price.toFixed(2)} ICP</div>
                </div>
            </div>
        </div>
    </div>
}