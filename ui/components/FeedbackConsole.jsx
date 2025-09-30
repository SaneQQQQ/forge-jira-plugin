import React, {useState} from "react";
import {invoke} from "@forge/bridge";
import {
    Box,
    Button,
    Checkbox,
    HelperMessage,
    Icon,
    Inline,
    Label,
    LoadingButton,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    ModalTransition,
    Pressable,
    RequiredAsterisk,
    Select,
    Stack,
    Text,
    TextArea,
    useTranslation,
    xcss
} from "@forge/react";

const FeedbackConsole = ({smallConsoleSize = false}) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [canContact, setCanContact] = useState(false);
    const [researchParticipation, setResearchParticipation] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setIsLoading(false);
        setSelectedOption(null);
        setFeedbackText("");
        setCanContact(false);
        setResearchParticipation(false);
    };

    const pressableStyles = xcss({
        color: "color.text.subtle",
        fontWeight: "font.weight.bold",
        borderRadius: "border.radius",

        ":hover": {
            backgroundColor: "color.background.neutral.subtle.hovered",
            color: "color.text",
        },
    });

    const feedbackOptions = [
        {label: t('ui.feedback.feedbackOptions.ask'), value: "ask"},
        {label: t('ui.feedback.feedbackOptions.comment'), value: "comment"},
        {label: t('ui.feedback.feedbackOptions.bug'), value: "bug"},
        {label: t('ui.feedback.feedbackOptions.suggestion'), value: "suggestion"},
    ];

    const getTextAreaLabel = () => {
        switch (selectedOption.value) {
            case "ask":
                return t('ui.feedback.feedbackQuestions.ask');
            case "comment":
                return t('ui.feedback.feedbackQuestions.comment')
            case "bug":
                return t('ui.feedback.feedbackQuestions.bug');
            case "suggestion":
                return t('ui.feedback.feedbackQuestions.suggestion');
            default:
                return t('ui.feedback.feedbackQuestions.default');
        }
    };

    const sendFeedbackAction = async () => {
        const feedback = {
            feedbackType: selectedOption.value,
            feedbackText: feedbackText,
            canContact: canContact,
            researchParticipation: researchParticipation,
        }
        await invoke('sendFeedback', {feedback});
    };

    const handleSendFeedback = async () => {
        setIsLoading(true);
        await sendFeedbackAction();
        setIsLoading(false);
        closeModal();
    };

    return (
        <>
            <Box alignInline='center'>
                <Stack>
                    <Text size={smallConsoleSize ? 'small' : 'medium'} align='center' color='color.text.subtlest'>
                        {t('ui.feedback.feedbackConsole.question')}
                    </Text>
                    <Inline alignInline='center'>
                        <Pressable
                            paddingInline='space.150'
                            paddingBlock='space.050'
                            onClick={openModal}
                            backgroundColor="color.background.neutral.subtle"
                            xcss={pressableStyles}
                        >
                            <Inline alignInline='center'>
                                <Icon label='feedback' glyph='feedback'/>
                                    {smallConsoleSize ? (
                                        <Box paddingBlockStart='space.050'>
                                            <Text size='small' align='center' color='color.text.subtle' weight='medium'>
                                                {t('ui.button.feedback')}
                                            </Text>
                                        </Box>
                                    ) : (
                                        <Box paddingBlockStart='space.025'>
                                            <Text size='medium' align='center' color='color.text.subtle' weight='medium'>
                                                {t('ui.button.feedback')}
                                            </Text>
                                        </Box>
                                    )}
                            </Inline>
                        </Pressable>
                    </Inline>
                </Stack>
            </Box>

            <ModalTransition>
                {isOpen && (
                    <Modal onClose={closeModal}>
                        <ModalHeader>
                            <ModalTitle>
                                {t('ui.feedback.feedbackModal.header')}
                            </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <Label labelFor='select'>
                                {t('ui.feedback.feedbackModal.selectLabel')}
                                <RequiredAsterisk />
                            </Label>
                            <Select
                                id='select'
                                placeholder={t('ui.feedback.feedbackModal.selectPlaceholder')}
                                options={feedbackOptions}
                                onChange={(value) => setSelectedOption(value)}
                            />
                            <HelperMessage>
                                {t('ui.feedback.feedbackModal.selectHelperMessage')}
                            </HelperMessage>
                            {selectedOption && (
                                <Box paddingBlockStart='space.200'>
                                    <Label labelFor='feedbackText'>
                                        {getTextAreaLabel(selectedOption)}
                                        <RequiredAsterisk />
                                    </Label>
                                    <Stack space='space.200'>
                                        <TextArea
                                            id='feedbackText'
                                            value={feedbackText}
                                            onChange={(e) => setFeedbackText(e.target.value)}
                                            placeholder={t('ui.feedback.feedbackModal.feedbackPlaceholder')}
                                            spellCheck
                                        />
                                        <Box>
                                            <Stack space='space.050'>
                                                <Checkbox
                                                    value='research'
                                                    label={t('ui.feedback.feedbackModal.checkbox.research')}
                                                    isChecked={researchParticipation}
                                                    onChange={() => setResearchParticipation(!researchParticipation)}>
                                                </Checkbox>
                                                <Checkbox
                                                    value='policy'
                                                    label={t('ui.feedback.feedbackModal.checkbox.policy')}
                                                    isChecked={canContact}
                                                    onChange={() => setCanContact(!canContact)}>
                                                </Checkbox>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button appearance='subtle' onClick={closeModal}>
                                {t('ui.button.cancel')}
                            </Button>
                            <LoadingButton
                                isLoading={isLoading}
                                appearance='primary'
                                onClick={handleSendFeedback}
                                isDisabled={!selectedOption || feedbackText.trim() === ''}
                            >
                                {t('ui.button.submit.feedback')}
                            </LoadingButton>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        </>
    );
};

export default FeedbackConsole;