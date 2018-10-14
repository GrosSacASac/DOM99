import {
    idGenerator
} from "../../../source/idGenerator.js"

describe("id Generator", function () {
    it("Check if Id is generated with given Prefix", function() {
       expect(idGenerator("Prefix").startsWith("Prefix")).toBeTruthy();
    });
})