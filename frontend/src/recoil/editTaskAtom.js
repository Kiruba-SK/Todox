import { atom } from "recoil";

const editTaskAtom = atom({
    key: 'editTaskAtom', 
    default: false,
});

export default editTaskAtom; 