import {kvs} from '@forge/kvs';

export const setSecret = async (key, value) => {
    try {
        validateNonEmptyString('Key', key);
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

export const setProperty = async (key, value) => {
    try {
        validateNonEmptyString('Key', key);
        await kvs.set(key, value);
        return true;
    } catch (err) {
        const errorMessage = `Failed to set property for key "${key}": ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const getProperty = async (key) => {
    try {
        validateNonEmptyString('Key', key);
        const property = await kvs.get(key);
        return property ?? '';
    } catch (err) {
        const errorMessage = `Failed to get property for key "${key}": ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteProperty = async (key) => {
    try {
        validateNonEmptyString('Key', key);
        await kvs.delete(key);
        return true;
    } catch (err) {
        const errorMessage = `Failed to delete property for key "${key}": ${err.message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

const validateNonEmptyString = (itemName, value) => {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Invalid ${itemName} provided. ${itemName} must be a non-empty string.`);
    }
};