import React from "react";
import {Lozenge, useTranslation} from "@forge/react";

const stateAppearanceMap = {
    open: "inprogress",
    approved: "success",
    closed: "new"
};

const PrStateLozenge = ({state}) => {
    const {t} = useTranslation();

    return (
        <Lozenge appearance={stateAppearanceMap[state]}>{t(`ui.pullRequestTable.pullRequest.state.${state}`)}</Lozenge>
    );
};

export default PrStateLozenge;