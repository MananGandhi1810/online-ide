import argon2 from "argon2";

const hash = async (str) => {
    const hashedStr = await argon2.hash(str);
    return hashedStr;
};

const compare = async (actualStr, expectedStr) => {
    const result = await argon2.verify(expectedStr, actualStr);
    return result;
};

export { hash, compare };
