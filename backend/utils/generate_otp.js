import { randomInt } from "node:crypto";

const generateOtp = async () => {
    return randomInt(100000, 999999);
};

export { generateOtp };
