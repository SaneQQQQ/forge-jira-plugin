import React from 'react';
import {SectionMessage, Text, useTranslation} from '@forge/react';

const POPUP_MESSAGE_TYPE = Object.freeze({
    ERROR: 'error',
    SAVED: 'saved',
    REMOVED: 'removed',
});

const PopUpMessage = ({type}) => {
    const {t} = useTranslation();

    const MESSAGES = Object.freeze({
        [POPUP_MESSAGE_TYPE.SAVED]: {
            appearance: 'success',
            text: t('ui.popUpMessage.success'),
        },
        [POPUP_MESSAGE_TYPE.REMOVED]: {
            appearance: 'warning',
            text: t('ui.popUpMessage.warning'),
        },
        [POPUP_MESSAGE_TYPE.ERROR]: {
            appearance: 'error',
            text: t('ui.popUpMessage.error'),
        },
    });

    const message = MESSAGES[type];

    if (!message) {
        return null;
    }

    return (
        <SectionMessage appearance={message.appearance}>
            <Text>
                {message.text}
            </Text>
        </SectionMessage>
    );
};

export {POPUP_MESSAGE_TYPE, PopUpMessage as default};