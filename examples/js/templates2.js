import * as d from "../../source/dom99.js";

const networkDelay = 1000;
const commentPrefix = `comment`;

let currentCommentNumber = 2;

const update = function (commentKey, commentObject) {
    d.feed(commentKey, commentObject);
};

const fetchData = function (/*urlOrWhat*/) {
    // fetch like simulation
    return new Promise(function (resolve, /*reject*/) {
        const fakeData = {
            text: `This is a comment that could come from the server about bla bla hard coded but could come from the server`,
            date: `just now`,
        };

        window.setTimeout(function () {
            resolve(fakeData);
        }, networkDelay);
    });
};

d.functions.showNextComment = function () {
    currentCommentNumber += 1;
    const key = `${commentPrefix}${currentCommentNumber}`;

    const customElementDescription = {
        tagName: `d-comment`,
        "data-scope": key,
    };
    const customElement = d.createElement2(customElementDescription);

    d.start({
        startElement: customElement,
    });
    d.elements.commentSection.appendChild(customElement);
    fetchData(`comment?id=42`).then( //get data
        function (data) {
            update(key, data);
        });
};

const commentsData = { //initial
    comment1: {
        text: `I am the first to comment, well written! Bravo!`,
        date: `In the year 2016`,
    },
    comment2: {
        text: `I really appreciate your work`,
        date: `yesterday`,
    },
};

d.feed(commentsData);
d.start();
