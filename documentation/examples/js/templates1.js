import * as d from "../../deps/dom99.es.js";

d.functions.showNextComment = function () {
    //todo
};

const commentsData = {
    comment1: {
        text: `I am the first to comment, well written! Bravo!`,
        date: `In the year 2016`,
    },
    comment2: {
        text: `I really appreciate your work`,
        date: `just now`,
    },
};

// we could also manually assign every property in a complicated for loop
d.feed(commentsData);

d.start();

