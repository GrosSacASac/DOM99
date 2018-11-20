import * as d  from "../../source/dom99.js";
window.d = d;
const networkDelay = 1000;
// comments are now stored inside an array
let commentsData = [
    {
        text: `I am the first to comment, well written! Bravo!`,
        date: `In the year 2016`
    },
    {
        text: `I really appreciate your work`,
        date: `yesterday`
    }
];
let internalId = 0;
let commentsLoaded = 2;

const lastPart = function (string) {
    const split = string.split(">")
    return split[split.length - 1];
};


const update = function (commentObject, id) {
    // updates the dataStore for comments commentsData
    const position = commentsData.findIndex(function (comment) {
        return comment.internalId === id;
    });
    if (position === -1) {
        console.log("the comment loading placeholder was deleted");
        return;
    }
    commentsData[position] = commentObject;
    // could sort the comments with .sort(customFunction) too
    // pushes the update to the UI
    d.feed(`comments`, commentsData);
};


const fetchData = function (url) {
    // fetch like simulation
    commentsLoaded += 1;
    return new Promise(function (resolve, reject) {
        const fakeData = {
            text: `This is a comment # ${commentsLoaded}`,
            date: `${(new Date()).toLocaleString()}`
        };

        setTimeout(function () {
            resolve(fakeData);
        }, networkDelay);
    });
};


d.functions.showNextComment = function (event) {
    // remember the position to be updated later
    const id = internalId;
    internalId += 1;
    // in the meantime already display an empty comment for instant feedback
    // without explicit text and date, it does not change them (in the DOM)
    // because DOM nodes are reused, this can make result look inconsistent
    commentsData.push({
        internalId: id,
        text: `textLoading text ... (fake response takes ${Math.floor(networkDelay/1000)}sec)`,
        date: `Loading date ...`
    });
    // force UI update
    d.feed(`comments`, commentsData);
    // fetch and provide internal id to replace at correct position
    fetchData(`comment?id=42`).then(function (data) {
		update(data, id);
    });

};

d.functions.delete = function (event) {
    const context = d.scopeFromEvent(event);
    const index = Number(lastPart(context));
    commentsData.splice(index, 1);
    d.feed(`comments`, commentsData);
};

d.feed(`comments`, commentsData);
d.start();
