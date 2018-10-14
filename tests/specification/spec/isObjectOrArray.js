import {
    isObjectOrArray
} from "../../../source/isObjectOrArray.js"

describe("is Object or Array", function () {
    it("Check if it is an Array - True", function() {
        let array = ["1,2,3"]
        expect(isObjectOrArray(array)).toBeTruthy();
    });

    it("Check if it is an Array - False", function() {
        let array = "1,2,3"
        expect(isObjectOrArray(array)).toBeFalsy();
    });

    it("Check if it is an Object - True", function() {
        let object = {"key" : "value"}
        expect(isObjectOrArray(object)).toBeTruthy();
    });

    it("Check if it is an Array - False", function() {
        let object = "1,2,3"
        expect(isObjectOrArray(object)).toBeFalsy();
    });
})