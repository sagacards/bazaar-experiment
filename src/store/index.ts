import create from 'zustand'
import { getAllNFTS, DABCollection, getNFTActor } from '@psychedelic/dab-js'
import { HttpAgent } from '@dfinity/agent';
import NFT from '@psychedelic/dab-js/dist/standard_wrappers/nft_standards/default';

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
        const defaultAgent = new HttpAgent();

        // Get NFT canisters
        const dab = (await getAllNFTS()).filter(x => SagaCanisters.includes(x.principal_id.toText()));
        // @ts-ignore: dfinity package mismatch :(
        const dabActors = dab.reduce((agg, x) => ({ ...agg, [x.principal_id.toText()] : getNFTActor({ canisterId: x.principal_id.toText(), standard: x.standard, agent: defaultAgent }) }), {});
        set({ dab, status: 'initialized', defaultAgent, dabActors });
    },

    // Known canisters.
    // NOTE: DAB exposes an incredibly minimal interface for NFT canisters. It doesn't have all of the methods we would need to power a marketplace. 🤔

    dab: [],
    dabActors: {},

    // NFT marketplace listings.

    listings,

}));

export default useStore;
