import { test, expect } from "vitest";
import { hash, compare } from "../../../utils/hashing";

test("Hash and compare passwords", async () => {
    expect(await compare("Password1@", await hash("Password1@"))).toBe(true);
    expect(await compare("Password1@", await hash("Password1"))).toBe(false);
    expect(await compare("Password1@", await hash("password1@"))).toBe(false);
    expect(await compare("Password1@", await hash("password1"))).toBe(false);
    expect(await compare("Password1234@.", await hash("Password1234@."))).toBe(
        true,
    );
});
