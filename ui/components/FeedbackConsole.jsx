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
    xcss
} from "@forge/react";

const FeedbackConsole = ({}) => {
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
        {label: "Ask a question", value: "ask"},
        {label: "Leave a comment", value: "comment"},
        {label: "Report a bug", value: "bug"},
        {label: "Suggest an improvement", value: "suggestion"},
    ];

    const getTextAreaLabel = () => {
        switch (selectedOption.value) {
            case "ask":
                return "What would you like to know?";
            case "comment":
                return "Let us know what's on your mind";
            case "bug":
                return "Describe the bug or issue";
            case "suggestion":
                return "Let us know what you'd like to improve";
            default:
                return "Your feedback";
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
            <Box alignInline='center' padding='space.250'>
                <Stack>
                    <Text align='center' color='color.text.subtlest'>
                        Any issues with your GitHub Integration?
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
                                <Box paddingBlockStart='space.025'>
                                    <Text align='center' color='color.text.subtle' weight='medium'>
                                        Give feedback
                                    </Text>
                                </Box>
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
                                Share your thoughts
                            </ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <Label labelFor='select'>
                                Select Feedback
                                <RequiredAsterisk />
                            </Label>
                            <Select
                                id='select'
                                placeholder='Select...'
                                options={feedbackOptions}
                                onChange={(value) => setSelectedOption(value)}
                            />
                            <HelperMessage>
                                Choose a type of your feedback
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
                                            placeholder='Type here...'
                                            spellCheck
                                        />
                                        <Box>
                                            <Stack space='space.050'>
                                                <Checkbox
                                                    value='research'
                                                    label="I'd like to participate in product research."
                                                    isChecked={researchParticipation}
                                                    onChange={() => setResearchParticipation(!researchParticipation)}>
                                                </Checkbox>
                                                <Checkbox
                                                    value='policy'
                                                    label='Yes, Atlassian teams can contact me to learn about my experiences to improve Atlassian products and services.'
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
                                Cancel
                            </Button>
                            <LoadingButton
                                isLoading={isLoading}
                                appearance='primary'
                                onClick={handleSendFeedback}
                                isDisabled={!selectedOption || feedbackText.trim() === ''}
                            >
                                Send Feedback
                            </LoadingButton>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        </>
    );
};

export default FeedbackConsole;