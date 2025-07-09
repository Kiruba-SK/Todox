import { atom } from "recoil";

const filterDataAtom = atom({
    key: 'filterDataAtom', 
    default: [], 
});

export default filterDataAtom;