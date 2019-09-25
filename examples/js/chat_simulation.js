
// fake messages can be replaced by listening to sockets or equivalent
export {fakeSisterSpeak, fakeBossSpeak};

const fakeMessagesFromSister = [
    `Hey brother, what is up ?`,
    `Long time not seen`,
    `you should visit my new home`,
    `remember the skateboard races we had when we were kids ?`,
    `Hey answer please :)`,
];
const fakeMessagesFromBoss = [
    `Nice work kids`,
    `I am going on a trip next week to meet new buisness partners`,
    `Can you finish the project ?`,
];


const fakeSpeakGenerator = function(array, authorName, authorFoto) {
    let currentIndex = 0;
    return function () {
        const message = {
            authorName,
            authorFoto,
            messageText: array[currentIndex % array.length],
        };
        currentIndex += 1;
        return message;
    };
};

const fakeSisterSpeak = fakeSpeakGenerator(fakeMessagesFromSister, `Sister`, `../documentation/images/sister.jpg`);
const fakeBossSpeak = fakeSpeakGenerator(fakeMessagesFromBoss, `Boss`, `../documentation/images/boss.jpg`);
