import {
    isObjectOrArray
} from "../../../source/isObjectOrArray.js"

describe("is Object or Array", function () {
    it("should return true for arrays", function () {
        const array = ["1,2,3"];
        expect(isObjectOrArray(array)).toBeTruthy();
    });

    it("should return true for an object", function () {
        const object = { "key": "value" };
        expect(isObjectOrArray(object)).toBeTruthy();
    });

    it("should return false for string", function () {
        const string = "1,2,3";
        expect(isObjectOrArray(string)).toBeFalsy();
    });

    it("should return false for undefined", function () {
        expect(isObjectOrArray(undefined)).toBeFalsy();
    });

    it("should return false for null", function () {
        expect(isObjectOrArray(null)).toBeFalsy();
    });

    it("should return false for number", function () {
        expect(isObjectOrArray(0)).toBeFalsy();
        expect(isObjectOrArray(10)).toBeFalsy();
    });
})