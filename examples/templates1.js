"use strict";
const D = dom99;

D.fx.showNextComment = function(event) {
    ;//todo
};

let commentsData = {
    comment1: {
        text: "I am the first to comment, well written! Bravo!",
        date: "In the year 2016"
    },
    comment2: {
        text: "I really appreciate your work",
        date: "just now" 
    }
};

// we could also manually assign every property in a complicated for loop
Object.assign(D.vr, commentsData);

D.linkJsAndDom();

