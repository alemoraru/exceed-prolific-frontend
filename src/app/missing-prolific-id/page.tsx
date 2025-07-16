import {SurveyStatusMessage} from "../components/SurveyStatusMessage";
import React from "react";
import {SurveyStatusType} from "@/app/utils/types";

/**
 * This component displays a message when the user tries to access the study without a Prolific ID.
 * It's a simple page at (/missing-prolific-id) that is used as a redirect target when no Prolific ID is found in the URL.
 */
export default function MissingProlificId() {
    return (
        <SurveyStatusMessage
            title="Access Denied"
            subtitle="Missing Prolific ID"
            message="You must access this study using your personalized Prolific link. Please return to Prolific and use the provided link to participate."
            showStudyTitle={true}
            isNotFound={true}
            type={SurveyStatusType.Error}
        />
    );
}
