import create from 'zustand'

interface Store {
    listings            : Listing[];
    setListings         : (l : Listing[]) => void;
};

export interface Listing {
    id : number;
}

const listings : Listing[] = [];
for (let id = 150; id >= 0; id--) {
    listings.push({ id });
}

const useStore = create<Store>((set, get) => ({

    listings,
    setListings (listings) {
        set(state => ({ listings }))
    },

}));

export default useStore;
