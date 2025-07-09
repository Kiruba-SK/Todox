import { atom } from "recoil";

const addTaskAtom = atom({
    key: 'addTaskAtom', 
    default: false, 
});

export default addTaskAtom;