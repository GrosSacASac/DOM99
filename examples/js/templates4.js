import {d, plugin, options, createElement2} from "../../source/dom99.js";
window.d = d;
const update = function (commentObject, position) {
    // updates the dataStore for comments commentsData
    commentsData[position] = commentObject;
    // could sort the comments with .sort(customFunction) too
    // pushes the update to the UI
    d.feed(`comments`, commentsData);
};

const fetchData = function (urlOrWhat) {
    // fetch like simulation
    return new Promise(function (resolve, reject) {
        const fakeData = {
            text: `This is a comment that could come from the server about bla bla hard coded but could come from the server`,
            date: `just now`
        };

        window.setTimeout(function () {
            resolve(fakeData);
        }, 2000);
    });
};

d.functions.showNextComment = function (event) {

    // in the meantime already display an empty comment for instant feedback

    // remember the position to be updated later
    const position = commentsData.length;
    commentsData.push(undefined);
    // undefined has no effect on all data-variable
    // so that will effectively uses the default textContent in the HTML
    d.feed(`comments`, commentsData);
    // force UI update
    fetchData(`comment?id=42`).then( function (data) {
		update(data, position);
    });

};

d.functions.delete = function (event) {
	console.log(d.contextFromEvent(event));
	const specificPosition = 0;
	commentsData.splice(specificPosition, 1);
    
    d.feed(`comments`, commentsData);
};

// comments are now stored inside an array
// you can try to convert an Object to an Array using
// Object.values(my_object);

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

d.feed(`comments`, commentsData);
d.activate();
