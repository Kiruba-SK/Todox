import { atom } from "recoil";

const searchTextAtom = atom({
    key: 'searchTextAtom', 
    default: "", 
});

export default searchTextAtom;