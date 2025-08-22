import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import ForgeReconciler, {
    Box,
    ErrorMessage,
    Form,
    FormFooter,
    FormHeader,
    FormSection,
    HelperMessage,
    Label,
    Link,
    LoadingButton,
    RequiredAsterisk,
    SectionMessage,
    Stack,
    Text,
    Textfield,
    useForm,
    ValidMessage
} from '@forge/react';

const App = () => {
    const {handleSubmit, register, getFieldId, formState} = useForm();
    const {errors, touchedFields} = formState;
    const [isLoginError, setIsLoginError] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);

    const isValidToken = async (token) => {
        return await invoke('isValidToken', {token: token});
    };

    const saveToken = async (token) => {
        return await invoke('saveToken', {token: token});
    }

    const getToken = async () => {
        return await invoke('getToken');
    }

    const deleteToken = async () => {
        return await invoke('deleteToken');
    }

    const submitToken = async (data) => {
        setIsLoading(true);
        setIsLoginError(false);
        setIsSaved(false);

        if (!await isValidToken(data.token)) {
            setIsLoginError(true);
            setIsLoading(false);
            return;
        }

        if (await saveToken(data.token)) {
            setIsSaved(true);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        const populateToken = async () => {
            const token = await getToken();
            setToken(token);
        }

        populateToken();
    }, [getToken, setToken]);

    return (
        <>
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
                    {isSaved && !isLoginError && (
                        <SectionMessage appearance="success">
                            <Text>
                                Your token has been successfully saved.
                            </Text>
                        </SectionMessage>
                    )}
                    {isLoginError && (
                        <SectionMessage appearance="error">
                            <Text>
                                Your token is invalid or expired. Please generate a new one and try again.
                            </Text>
                        </SectionMessage>
                    )}
                    <Stack space="space.100">
                        {!isSaved && (
                            <Box>
                                <Label labelFor={getFieldId("token")}>
                                    Personal Access Token
                                    <RequiredAsterisk />
                                </Label>
                                <Textfield placeholder="Place your token here" {...register("token", {
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
                    </Stack>
                </FormSection>
                {!isSaved && (
                    <FormFooter>
                        <LoadingButton isLoading={isLoading} appearance="primary" type="submit">
                            Save Token
                        </LoadingButton>
                    </FormFooter>
                )}
            </Form>
        </>
    );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
