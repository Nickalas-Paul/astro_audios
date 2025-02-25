import React from 'react';

function AudioPlayer({ trackUrl }) {
    return (
        <div>
            {trackUrl && (
                <audio controls src={trackUrl}>
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
}

export default AudioPlayer;
