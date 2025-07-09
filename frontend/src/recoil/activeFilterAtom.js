import { atom } from "recoil";

const activeFilterAtom = atom({
    key: 'activeFilterAtom', 
    default: 'All', 
});

export default activeFilterAtom; 