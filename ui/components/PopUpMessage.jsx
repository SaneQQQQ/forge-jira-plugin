import React from 'react';
import {Box, SectionMessage} from '@forge/react';

const POPUP_MESSAGE_TYPE = Object.freeze({
    ERROR: 'error',
    SAVED: 'saved',
    REMOVED: 'removed',
});

const MESSAGES = Object.freeze({
    [POPUP_MESSAGE_TYPE.SAVED]: {
        appearance: 'success',
        text: 'Your token has been successfully saved.',
    },
    [POPUP_MESSAGE_TYPE.REMOVED]: {
        appearance: 'success',
        text: 'Your token has been successfully removed.',
    },
    [POPUP_MESSAGE_TYPE.ERROR]: {
        appearance: 'error',
        text: 'Your token is invalid or expired. Please generate a new one and try again.',
    },
});

const PopUpMessage = ({type}) => {
    const message = MESSAGES[type];

    if (!message) {
        return null;
    }

    return (
        <Box paddingBlockEnd="space.200">
            <SectionMessage appearance={message.appearance}>
                {message.text}
            </SectionMessage>
        </Box>
    );
};

export {POPUP_MESSAGE_TYPE, PopUpMessage as default};