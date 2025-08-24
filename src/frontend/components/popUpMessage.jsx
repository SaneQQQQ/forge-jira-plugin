import React from 'react';
import {Box, SectionMessage, Text} from '@forge/react';

const popUpMessageType = {
    ERROR: 'error',
    SAVED: 'saved',
    REMOVED: 'removed'
}

const messages = {
    [popUpMessageType.SAVED]: {
        appearance: 'success',
        text: 'Your token has been successfully saved.',
    },
    [popUpMessageType.REMOVED]: {
        appearance: 'success',
        text: 'Your token has been successfully removed.',
    },
    [popUpMessageType.ERROR]: {
        appearance: 'error',
        text: 'Your token is invalid or expired. Please generate a new one and try again.',
    },
};

const PopUpMessage = ({ type }) => {
    if (!type) {
        return null;
    }

    return (
        <Box paddingBlockEnd="space.200">
            <SectionMessage appearance={messages[type].appearance}>
                <Text>{messages[type].text}</Text>
            </SectionMessage>
        </Box>
    );
}

export { popUpMessageType, PopUpMessage as default };