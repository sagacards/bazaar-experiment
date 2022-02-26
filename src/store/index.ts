import create from 'zustand'

interface Store {
    listings            : Listing[];
    setListings         : (l : Listing[]) => void;
};

export interface Listing {
    id : number;
}

const useStore = create<Store>((set, get) => ({

    listings : [],
    setListings (listings) {
        set(state => ({ listings }))
    },


}));

export default useStore;
