import {kvs} from '@forge/kvs';

export const setSecret = async (key, value) => {
    try {
        validateNonEmptyString('Key', key);
        validateNonEmptyString('Value', value);
        await kvs.setSecret(key, value);
        return true;
    } catch (err) {
        const errorMessage = `Failed to set secret for key "${key}": ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getSecret = async (key) => {
    try {
        validateNonEmptyString('Key', key);
        const secret = await kvs.getSecret(key);
        return secret ?? '';
    } catch (err) {
        const errorMessage = `Failed to get secret for key "${key}": ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteSecret = async (key) => {
    try {
        validateNonEmptyString('Key', key);
        await kvs.deleteSecret(key);
        return true;
    } catch (err) {
        const errorMessage = `Failed to delete secret for key "${key}": ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

const validateNonEmptyString = (itemName, value) => {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Invalid ${itemName} provided. ${itemName} must be a non-empty string.`);
    }
};