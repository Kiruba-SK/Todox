import { atom } from "recoil";

const userInfoAtom = atom({
  key: "userInfoAtom", // unique ID for this atom
  default: false,      // default value (e.g. logged out)
});

export default userInfoAtom;