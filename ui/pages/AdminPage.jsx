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
    I18nProvider,
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
    useTranslation,
    ValidMessage
} from '@forge/react';

const AdminPage = () => {
    const {t} = useTranslation();
    const {
        handleSubmit,
        register,
        getFieldId,
        formState: {errors, touchedFields}} = useForm();
    const [token, setToken] = useState(null);
    const [privateRepoVisibility, setPrivateRepoVisibility] = useState(false);
    const [popUpType, setPopUpMessageType] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    const validateToken = async (value) => await invoke('validateToken', {token: value});
    const saveToken = async (value) => await invoke('saveToken', {token: value});
    const loadToken = async () => await invoke('loadToken');
    const removeToken = async () => await invoke('removeToken');
    const savePrivateRepoVisibility = async (value) => await invoke('setPrivateRepoVisibility', {privateRepoVisibility: value});
    const loadPrivateRepoVisibility = async () => await invoke('getPrivateRepoVisibility');

    const submitToken = async (data) => {
        setIsLoadingButton(true);
        setPopUpMessageType(null);

        if (!await validateToken(data.token)) {
            setPopUpMessageType(POPUP_MESSAGE_TYPE.ERROR);
            setIsLoadingButton(false);
            return;
        }

        if (await saveToken(data.token)) {
            setToken(data.token);
            setIsSaved(true);
            setEditMode(false);
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
        await savePrivateRepoVisibility(false);

        setToken(null);
        setIsSaved(false);
        setEditMode(false);
        setPrivateRepoVisibility(false);
        setPopUpMessageType(POPUP_MESSAGE_TYPE.REMOVED);
        setIsLoadingButton(false);
    };

    const handleToggleChange = async () => {
        const newValue = !privateRepoVisibility;
        setPrivateRepoVisibility(newValue);
        await savePrivateRepoVisibility(newValue);
    };

    useEffect(() => {
        const initialize = async () => {
            const savedToken = await loadToken();
            if (savedToken) {
                setToken(savedToken);
                setIsSaved(true);
            }

            const savedVisibility = await loadPrivateRepoVisibility();
            setPrivateRepoVisibility(savedVisibility ?? false);

            setIsLoadingContent(false);
        };
        initialize();
    }, []);

    return (
        <>
            <LoadingSpinner isLoading={isLoadingContent} height={600} size='xlarge'>
                <Box>
                    <Form onSubmit={handleSubmit(submitToken)}>
                        <FormHeader>
                            <Stack alignInline='center' space='space.150'>
                                <Box>
                                    <Heading size='large'>
                                        {t('ui.adminPage.header')}
                                    </Heading>
                                </Box>
                                <Box>
                                    <Text align='center'>
                                        {t('ui.adminPage.instruction.text')}
                                        <Link openNewTab={true} href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank">
                                            {t('ui.adminPage.instruction.link')}
                                        </Link>
                                    </Text>
                                </Box>
                                <Box>
                                    <Image src='https://octodex.github.com/images/steroidtocat.png' size='small'/>
                                </Box>
                            </Stack>
                        </FormHeader>
                        <FormSection>
                            <Inline alignInline='center'>
                                <Box xcss={{
                                    minWidth: '400px',
                                    width: '100%',
                                }}>
                                    <Inline alignInline='center'>
                                        <Box paddingBlockEnd='space.200'>
                                            <PopUpMessage type={popUpType}></PopUpMessage>
                                        </Box>
                                    </Inline>
                                    {(editMode || !isSaved) && (
                                        <Inline alignInline='center'>
                                            <Box xcss={{
                                                minWidth: '400px',
                                                width: '830px',
                                            }}>
                                                <Label labelFor={getFieldId("token")}>
                                                    {t('ui.adminPage.tokenInput.label')}
                                                    <RequiredAsterisk />
                                                </Label>
                                                <Textfield defaultValue={token} type='password' placeholder={t('ui.adminPage.tokenInput.placeholder')} {...register("token", {
                                                    required: true,
                                                    pattern: /^(gh[ps]_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})$/ })} />
                                                {errors["token"] && (
                                                    <ErrorMessage>
                                                        {t('ui.adminPage.tokenInput.errorMessage')}
                                                    </ErrorMessage>
                                                )}
                                                {!touchedFields["token"] && !errors["token"] && (
                                                    <HelperMessage>
                                                        {t('ui.adminPage.tokenInput.helperMessage')}
                                                    </HelperMessage>
                                                )}
                                                {touchedFields["token"] && !errors["token"] && (
                                                    <ValidMessage>
                                                        {t('ui.adminPage.tokenInput.validMessage')}
                                                    </ValidMessage>
                                                )}
                                            </Box>
                                        </Inline>
                                    )}
                                    {!editMode && isSaved && (
                                        <Inline alignInline='center'>
                                            <Box xcss={{
                                                minWidth: '400px',
                                                width: '830px',
                                            }}>
                                                <Label labelFor="savedToken">
                                                    {t('ui.adminPage.tokenInput.label')}
                                                </Label>
                                                <Textfield value={token} type='password' isDisabled/>
                                            </Box>
                                        </Inline>
                                    )}
                                </Box>
                            </Inline>
                        </FormSection>
                        {(editMode || !isSaved) && (
                            <Box paddingBlockStart='space.250'>
                                <Inline alignInline='center'>
                                    <LoadingButton isLoading={isLoadingButton} appearance="primary" type="submit">
                                        <Box paddingInline='space.800'>
                                            {t('ui.button.submit.token')}
                                        </Box>
                                    </LoadingButton>
                                </Inline>
                            </Box>
                        )}
                        {!editMode && isSaved && (
                            <Box paddingBlockStart='space.400'>
                                <Inline alignInline='center' space='space.300'>
                                    <Button onClick={handleEdit}>
                                        <Box paddingInline='space.800'>
                                            {t('ui.button.edit')}
                                        </Box>
                                    </Button>
                                    <LoadingButton isLoading={isLoadingButton} onClick={handleRemove} appearance="danger">
                                        <Box paddingInline='space.800'>
                                            {t('ui.button.remove')}
                                        </Box>
                                    </LoadingButton>
                                </Inline>
                            </Box>
                        )}
                        <Box paddingBlockStart='space.250'>
                            <Inline alignInline='center' alignBlock='center'>
                                <Toggle id='toggle'
                                        isChecked={privateRepoVisibility}
                                        onChange={handleToggleChange}>
                                </Toggle>
                                <Box>
                                    <Label labelFor='toggle'>{t('ui.adminPage.showPrivateRepo')}</Label>
                                </Box>
                            </Inline>
                        </Box>
                    </Form>
                    <Box padding='space.250'>
                        <FeedbackConsole/>
                    </Box>
                </Box>
            </LoadingSpinner>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <I18nProvider>
            <AdminPage/>
        </I18nProvider>
    </React.StrictMode>
);