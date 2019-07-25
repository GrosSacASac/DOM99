import * as d from "../deps/dom99ES.min.js";


const mediaRecorderSupport = `MediaRecorder` in window;
const missingSupportMessage = `browser does not support MediaRecorder`;
const missingPermissionMessage = `permission denied, cannot access`;
const WEBM_MIME = `audio/webm`;

let recording = false;
let recorder;

d.functions.record = async () => {
    if (!mediaRecorderSupport) {
        d.feed(`alert`, missingSupportMessage);
        return;
    }
    if (recording) {
        stopRecording(recorder);
        d.feed(`nextAction`, `Record`);
        d.feed(`alert`, `Ready`);
        return;
    }
    const error = await startRecording();
    if (error) {
        d.feed(`alert`, error);
        return;
    }
    d.feed(`nextAction`, `Stop`);
    d.feed(`alert`, `Recording`);
};

const handleRecording = (blob) => {
    const blobUrl = URL.createObjectURL(blob);
    d.elements.download.setAttribute(`href`, blobUrl);
    d.elements.download.hidden = false;
    d.elements.audio.setAttribute(`src`, blobUrl);
}

const startRecording = async () => {
    let stream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
    } catch (permissionError) {
        return missingPermissionMessage;
    }

    const parts = [];
    recorder = new MediaRecorder(stream, { type: WEBM_MIME });

    recorder.addEventListener(`dataavailable`, event => {
        if (!event.data || event.data.size === 0) {
            return;
        }
        parts.push(event.data);
    });

    recorder.addEventListener(`stop`, () => {
        const recording = new Blob(parts, {
            type: WEBM_MIME
        });
        handleRecording(recording);
    });
    recorder.start();
    recording = true;
};

const stopRecording = (recorder) => {
    recorder.stop();
    //todo how to stop the stream
    recording = false;
};

d.start();

