import { test, expect } from "vitest";
import { validateEmail, validatePassword } from "../../../utils/validators";

test("Validate Email", () => {
    expect(validateEmail("user@gmail.com")).toBe(true);
    expect(validateEmail("abcd@google.com")).toBe(true);
    expect(validateEmail("haha@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("invalid-google.com")).toBe(false);
    expect(validateEmail("invalid@.com")).toBe(false);
    expect(validateEmail("invalid@com")).toBe(false);
    expect(validateEmail("invalid.com")).toBe(false);
    expect(validateEmail("invalid@.com")).toBe(false);
});

test("Validate Passwords", () => {
    expect(validatePassword("Password1@")).toBe(true);
    expect(validatePassword("Password1")).toBe(false);
    expect(validatePassword("password1@")).toBe(false);
    expect(validatePassword("password1")).toBe(false);
    expect(validatePassword("password")).toBe(false);
    expect(validatePassword("password@")).toBe(false);
    expect(validatePassword("password1")).toBe(false);
    expect(validatePassword("Pass1@")).toBe(false);
    expect(validatePassword("passW123")).toBe(false);
    expect(validatePassword("Pass@123")).toBe(true);
});
