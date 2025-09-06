import React from "react";
import {Lozenge} from "@forge/react";

const stateAppearanceMap = {
    open: "inprogress",
    approved: "success",
    closed: "new"
};

const PrStateLozenge = ({state}) => {
    return (
        <Lozenge appearance={stateAppearanceMap[state]}>{state}</Lozenge>
    );
};

export default PrStateLozenge;