import { atom } from "recoil";

const todoDataAtom = atom({
    key: 'todoDataAtom', 
    default: null, 
});

export default todoDataAtom;