import {
    idGenerator,
} from "../../../source/idGenerator.js";

describe(`id Generator`, function () {
    it(`should be generated with given prefix`, function() {
       expect(idGenerator(`Prefix`).startsWith(`Prefix`)).toBeTruthy();
    });
    
    it(`should be different each time`, function() {
        const set = new Set();
        set.add(idGenerator());
        set.add(idGenerator());
        set.add(idGenerator());
       expect(set.size).toEqual(3);
    });
});