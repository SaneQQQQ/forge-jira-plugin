import React from 'react';
import ForgeReconciler, { Text } from '@forge/react'

const App = () => {
    return (
        <>
            <Text>Hello world!</Text>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);



