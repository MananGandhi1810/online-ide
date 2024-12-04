import { randomInt } from "node:crypto";

const randomNum = async (numLen = 6) => {
    return randomInt(Math.pow(10, numLen - 1), Math.pow(10, numLen));
};

export { randomNum };
