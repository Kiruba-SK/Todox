import { atom } from "recoil";

const newUserAtom = atom({
    key: 'newUserAtom', 
    default: false, 
});

export default newUserAtom;