import React from 'react'
import { Listing } from 'store/index'
import Spinner from 'ui/spinner';
import Styles from './styles.module.css'

interface Props {
    listing : Listing;
}

export default function NFTPreview (props : Props) {

    const [play, setPlay] = React.useState<boolean>(false);
    const [readyStatic, setReadyStatic] = React.useState<boolean>(false);
    const [animated, setAnimated] = React.useState<string>();
    
    React.useEffect(() => {
        const url = `https://cwu5z-wyaaa-aaaaj-qaoaq-cai.raw.ic0.app/${props.listing.id}.webp`;
        const img = new Image();
        img.onload = () => setReadyStatic(true);
        img.src = url;
    }, []);

    function fetchAnimated () {
        if (animated) return;
        const url = `https://cwu5z-wyaaa-aaaaj-qaoaq-cai.raw.ic0.app/${props.listing.id}.webm`;
        fetch(url).then(r => r.blob().then(b => {
            var reader = new FileReader();
            reader.readAsDataURL(b); 
            reader.onloadend = function() {
                setAnimated(url);
            }
        }));
    }

    return <div className={Styles.root} onMouseEnter={() => { setPlay(true); fetchAnimated(); }} onMouseLeave={() => setPlay(false)}>
        <div className={Styles.stage}>
            {readyStatic && <img className={Styles.static} src={`https://cwu5z-wyaaa-aaaaj-qaoaq-cai.raw.ic0.app/${props.listing.id}.webp`} />}
            {animated && <video className={[Styles.animated, play && animated ? Styles.animatedPlay : ''].join(' ')} loop autoPlay muted>
                <source src={`${animated}`} type="video/webm" />
            </video>}
            <div className={[Styles.loader, readyStatic && play && !animated ? Styles.loaderHover : ''].join(' ')}><Spinner /></div>
        </div>
        <div className={Styles.meta}>
            <div className={Styles.details}>
                <div className={Styles.title}>
                    <div className={Styles.collection}>Legend #1: The Magician</div>
                    <div className={Styles.mint}>#{props.listing.id}</div>
                </div>
                <img className={Styles.ico} src={`https://nges7-giaaa-aaaaj-qaiya-cai.raw.ic0.app/assets/icon.png`} />
            </div>
            <div className={Styles.divider} />
            <div className={Styles.actions}>
                <div className={Styles.price}>
                    <div className={Styles.priceLabel}>Price</div>
                    <div className={Styles.priceAmount}>50 ICP</div>
                </div>
            </div>
        </div>
    </div>
}