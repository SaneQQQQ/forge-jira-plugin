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
    FormFooter,
    FormHeader,
    FormSection,
    HelperMessage,
    Inline,
    Label,
    Link,
    LoadingButton,
    RequiredAsterisk,
    Stack,
    Text,
    Textfield,
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
                {!isLoadingContent && (
                    <Form onSubmit={handleSubmit(submitToken)}>
                        <FormHeader title="GitHub Personal Access Token">
                            <Text>
                                Enter your GitHub Personal Access Token (PAT) to continue. Learn how to create one:{' '}
                                <Link openNewTab={true} href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank">
                                    Managing your personal access tokens.
                                </Link>
                            </Text>
                        </FormHeader>
                        <FormSection>
                            <PopUpMessage type={popUpType}></PopUpMessage>
                            <Stack space="space.200">
                                {(editMode || !isSaved) && (
                                    <Box>
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
                                )}
                                {!editMode && isSaved && (
                                    <Box>
                                        <Label labelFor="savedToken">
                                            Personal Access Token
                                        </Label>
                                        <Textfield value={token} type='password' isDisabled />
                                    </Box>
                                )}
                            </Stack>
                        </FormSection>
                        {(editMode || !isSaved) && (
                            <FormFooter>
                                <LoadingButton isLoading={isLoadingButton} appearance="primary" type="submit">
                                    Save Token
                                </LoadingButton>
                            </FormFooter>
                        )}
                        {!editMode && isSaved && (
                            <FormFooter>
                                <Inline space="space.150">
                                    <Box>
                                        <Button shouldFitContainer onClick={handleEdit}>
                                            Edit
                                        </Button>
                                    </Box>
                                    <Box>
                                        <LoadingButton isLoading={isLoadingButton} shouldFitContainer onClick={handleRemove} appearance="danger">
                                            Remove
                                        </LoadingButton>
                                    </Box>
                                </Inline>
                            </FormFooter>
                        )}
                    </Form>
                )}
                <FeedbackConsole/>
            </LoadingSpinner>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <AdminPage />
    </React.StrictMode>
);