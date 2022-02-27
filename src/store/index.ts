import create from 'zustand'
import { getAllNFTS, DABCollection, getNFTActor } from '@psychedelic/dab-js'
import { Actor, HttpAgent } from '@dfinity/agent';
import NFT from '@psychedelic/dab-js/dist/standard_wrappers/nft_standards/default';
// @ts-ignore
import CyclesDID from 'did/cycles.did.js';

// We have our own list of canisters for this marketplace!
// TODO: This should be a DAO maintained directory of Tarot NFTs.
const SagaCanisters = [
    "nges7-giaaa-aaaaj-qaiya-cai",
    "6e6eb-piaaa-aaaaj-qal6a-cai",
    "cwu5z-wyaaa-aaaaj-qaoaq-cai",
];

// Create some fake listings.
export interface Listing { id : number; canister : string; price : number; }
const listings : { [key : string] : Listing[]} = {};
let id = 0;
for (const canister of SagaCanisters) {
    let l = [];
    for (let i = 50; i >= 0; i--) {
        l.push({ id, canister, price: Math.random() * 100 });
        id++
    };
    listings[canister] = l;
};

// Interface for our application's data store.
interface Store {

    init: () => void;
    status: 'uninitialized' | 'initializing' | 'initialized';

    defaultAgent?: HttpAgent;
    icpToUSD?: number;

    dab : DABCollection[];
    dabActors : { [key : string] : NFT };

    listings: { [key : string]: Listing[] };
};

// Create the app's data store!
const useStore = create<Store>((set, get) => ({

    // Store initialization.
    
    status: 'uninitialized',
    async init () {
        // Ensure single init
        if (get().status !== 'uninitialized') return;
        set({ status: 'initializing' });

        // Create a default agent
        const defaultAgent = new HttpAgent({ host: 'https://boundary.ic0.app/' });

        // Get ICP to USD exchange rate
        const cycles : any = await Actor.createActor(CyclesDID, {
            agent: defaultAgent,
            canisterId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
        }).get_icp_xdr_conversion_rate();
        const xdr = await fetch("https://free.currconv.com/api/v7/convert?q=XDR_USD&compact=ultra&apiKey=df6440fc0578491bb13eb2088c4f60c7").then(r => r.json());

        const icpToUSD = Number(cycles.data.xdr_permyriad_per_icp) / 10000 * (xdr.hasOwnProperty("XDR_USD") ? xdr.XDR_USD : 1.4023);

        // Get NFT canisters
        const dab = (await getAllNFTS()).filter(x => SagaCanisters.includes(x.principal_id.toText()));
        // @ts-ignore: dfinity package mismatch :(
        const dabActors = dab.reduce((agg, x) => ({ ...agg, [x.principal_id.toText()] : getNFTActor({ canisterId: x.principal_id.toText(), standard: x.standard, agent: defaultAgent }) }), {});
        set({
            dab,
            dabActors,
            defaultAgent,
            icpToUSD,
            status: 'initialized',
        });
    },

    // Known canisters.
    // NOTE: DAB exposes an incredibly minimal interface for NFT canisters. It doesn't have all of the methods we would need to power a marketplace. 🤔

    dab: [],
    dabActors: {},

    // NFT marketplace listings.

    listings,

}));

export default useStore;
