import React, {useEffect, useState} from 'react';
import PopUpMessage, {POPUP_MESSAGE_TYPE} from '../components/PopUpMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import FeedbackConsole from "../components/FeedbackConsole";
import {invoke} from '@forge/bridge';
import ForgeReconciler, {
    Box,
    Button,
    ErrorMessage,
    Form,
    FormHeader,
    FormSection,
    Heading,
    HelperMessage,
    Image,
    Inline,
    Label,
    Link,
    LoadingButton,
    RequiredAsterisk,
    Stack,
    Text,
    Textfield,
    Toggle,
    useForm,
    ValidMessage
} from '@forge/react';

const AdminPage = () => {
    const {handleSubmit,
        register,
        getFieldId,
        formState: {
            errors,
            touchedFields}} = useForm();
    const [token, setToken] = useState(null);
    const [popUpType, setPopUpMessageType] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    const validateToken = async (token) => {
        return await invoke('validateToken', {token: token});
    };

    const saveToken = async (token) => {
        return await invoke('saveToken', {token: token});
    };

    const loadToken = async () => {
        return await invoke('loadToken');
    };

    const removeToken = async () => {
        return await invoke('removeToken');
    };

    const submitToken = async (data) => {
        setIsLoadingButton(true);
        setPopUpMessageType(null);

        if (!await validateToken(data.token)) {
            setPopUpMessageType(POPUP_MESSAGE_TYPE.ERROR);
            setIsLoadingButton(false);
            return;
        }

        if (await saveToken(data.token)) {
            setEditMode(false);
            setToken(data.token);
            setIsSaved(true);
            setPopUpMessageType(POPUP_MESSAGE_TYPE.SAVED);
        }

        setIsLoadingButton(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleRemove = async () => {
        setIsLoadingButton(true);
        await removeToken();
        setToken(null);
        setIsSaved(false);
        setEditMode(false);
        setPopUpMessageType(POPUP_MESSAGE_TYPE.REMOVED);
        setIsLoadingButton(false);
    };

    useEffect(() => {
        const populateToken = async () => {
            const saved = await loadToken();
            if (saved) {
                setToken(saved);
                setIsSaved(true);
            }
        };
        populateToken().then(() => setIsLoadingContent(false));
    }, []);

    return (
        <>
            <LoadingSpinner isLoading={isLoadingContent}>
                <Box paddingInline='space.600'>
                    <Form onSubmit={handleSubmit(submitToken)}>
                        <FormHeader>
                            <Stack alignInline='center' space='space.150'>
                                <Box>
                                    <Heading size='large'>
                                        GitHub Personal Access Token
                                    </Heading>
                                </Box>
                                <Box>
                                    <Text>
                                        Enter your GitHub Personal Access Token (PAT) to continue. Learn how to create one:{' '}
                                        <Link openNewTab={true} href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank">
                                            Managing your personal access tokens.
                                        </Link>
                                    </Text>
                                </Box>
                                <Box>
                                    <Image src='https://octodex.github.com/images/steroidtocat.png' size='small'/>
                                </Box>
                            </Stack>
                        </FormHeader>
                        <FormSection>
                            <Stack grow="fill" space='space.150'>
                                <Inline alignInline='center'>
                                    <Box paddingInline='space.1000'>
                                        <PopUpMessage type={popUpType}></PopUpMessage>
                                    </Box>
                                </Inline>
                                {(editMode || !isSaved) && (
                                    <Box paddingInline='space.1000'>
                                        <Box paddingInline='space.1000'>
                                            <Box paddingInline='space.1000'>
                                            <Label labelFor={getFieldId("token")}>
                                                Personal Access Token
                                                <RequiredAsterisk />
                                            </Label>
                                            <Textfield defaultValue={token} type='password' placeholder="Place your token here" {...register("token", {
                                                required: true,
                                                pattern: /^(gh[ps]_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})$/ })} />
                                            {errors["token"] && (
                                                <ErrorMessage>
                                                    Invalid token format. Please check and try again.
                                                </ErrorMessage>
                                            )}
                                            {!touchedFields["token"] && !errors["token"] && (
                                                <HelperMessage>
                                                    Use a fine-grained or classic PAT generated in your GitHub account settings.
                                                </HelperMessage>
                                            )}
                                            {touchedFields["token"] && !errors["token"] && (
                                                <ValidMessage>
                                                    Looks good! Valid token format.
                                                </ValidMessage>
                                            )}
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                                {!editMode && isSaved && (
                                    <Box paddingInline='space.1000'>
                                        <Box paddingInline='space.1000'>
                                            <Box paddingInline='space.1000'>
                                                <Label labelFor="savedToken">
                                                    Personal Access Token
                                                </Label>
                                                <Textfield value={token} type='password' isDisabled/>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </FormSection>
                        {(editMode || !isSaved) && (
                            <Box paddingBlockStart='space.250'>
                                <Inline alignInline='center'>
                                    <LoadingButton isLoading={isLoadingButton} appearance="primary" type="submit">
                                        <Box paddingInline='space.1000'>
                                            Save Token
                                        </Box>
                                    </LoadingButton>
                                </Inline>
                            </Box>
                        )}
                        {!editMode && isSaved && (
                            <Box paddingBlockStart='space.400'>
                                <Inline alignInline='center' space='space.300'>
                                    <Button onClick={handleEdit}>
                                        <Box paddingInline='space.1000'>
                                            Edit
                                        </Box>
                                    </Button>
                                    <LoadingButton isLoading={isLoadingButton} onClick={handleRemove} appearance="danger">
                                        <Box paddingInline='space.1000'>
                                            Remove
                                        </Box>
                                    </LoadingButton>
                                </Inline>
                            </Box>
                        )}
                        {/* TODO: implement repository fetching based on this property */}
                        <Box paddingBlockStart='space.250'>
                            <Inline alignInline='center' alignBlock='center'>
                                <Toggle id='toggle'></Toggle>
                                <Box>
                                    <Label labelFor='toggle'>Show private repositories</Label>
                                </Box>
                            </Inline>
                        </Box>
                        {/* TODO: implement repository fetching based on this property */}
                    </Form>
                    <FeedbackConsole/>
                </Box>
            </LoadingSpinner>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <AdminPage />
    </React.StrictMode>
);