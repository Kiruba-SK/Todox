import { atom } from "recoil";

const closeTaskAtom = atom({
    key: 'closeTaskAtom', 
    default: false, 
});

export default closeTaskAtom;