import React, {useState} from "react";
import {invoke} from "@forge/bridge";
import {
    Box,
    Button,
    CheckboxGroup,
    HelperMessage,
    Icon,
    Inline,
    Label,
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
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");
    const [checkedValues, setCheckedValues] = useState([]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setSelectedOption(null);
        setFeedbackText("");
        setCheckedValues([]);
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

    const checkboxOptions = [
        {label: 'Yes, Atlassian teams can contact me to learn about my experiences to improve Atlassian products and services.'
            , value: "policy"},
        {label: "I'd like to participate in product research", value: "research"},
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
            feedbackOption: selectedOption.value,
            feedbackText: feedbackText,
            checkedValues: checkedValues,
        }
        await invoke('sendFeedback', {feedback});
    };

    return (
        <>
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
                                        />
                                        <CheckboxGroup
                                            name=''
                                            options={checkboxOptions}
                                            value={checkedValues}
                                            onChange={(values) => setCheckedValues(values)}
                                        />
                                    </Stack>
                                </Box>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button appearance='subtle' onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                appearance='primary'
                                onClick={async () => {
                                    await sendFeedbackAction();
                                    closeModal();
                                }}
                                isDisabled={!selectedOption || feedbackText.trim() === ''}
                            >
                                Send Feedback
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}
            </ModalTransition>
        </>
    );
};

export default FeedbackConsole;