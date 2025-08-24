import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
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
import PopUpMessage, { popUpMessageType } from "./components/popUpMessage"
import LoadingContent from "./components/loadingContent";

const App = () => {
    const {handleSubmit, register, getFieldId,
        formState: {
            errors,
            touchedFields}} = useForm();

    const [token, setToken] = useState(null);
    const [popUpType, setPopUpMessageType] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    const isValidToken = async (token) => {
        return await invoke('isValidToken', {token: token});
    };

    const saveToken = async (token) => {
        return await invoke('saveToken', {token: token});
    };

    const getToken = async () => {
        return await invoke('getToken');
    };

    const deleteToken = async () => {
        return await invoke('deleteToken');
    };

    const submitToken = async (data) => {
        setIsLoadingButton(true);
        setPopUpMessageType(null);

        if (!await isValidToken(data.token)) {
            setPopUpMessageType(popUpMessageType.ERROR);
            setIsLoadingButton(false);
            return;
        }

        if (await saveToken(data.token)) {
            setEditMode(false);
            setToken(data.token);
            setIsSaved(true);
            setPopUpMessageType(popUpMessageType.SAVED);
        }

        setIsLoadingButton(false);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleRemove = async () => {
        setIsLoadingButton(true);
        await deleteToken();
        setToken(null);
        setIsSaved(false);
        setEditMode(false);
        setPopUpMessageType(popUpMessageType.REMOVED);
        setIsLoadingButton(false);
    };

    useEffect(() => {
        const populateToken = async () => {
            const saved = await getToken();
            if (saved) {
                setToken(saved);
                setIsSaved(true);
            }
            setIsLoadingContent(false);
        };
        populateToken();
    }, []);

    return (
        <>
            <LoadingContent isLoading={isLoadingContent}></LoadingContent>
            {!isLoadingContent && (
                <Form onSubmit={handleSubmit(submitToken)}>
                    <FormHeader title="GitHub Personal Access Token">
                        <Text>
                            Enter your GitHub Personal Access Token (PAT) to continue. Learn how to create one:{' '}
                            <Link href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank">
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
                                    <Textfield defaultValue={token} placeholder="Place your token here" {...register("token", {
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
                                    <Textfield value={token} isDisabled />
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
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);