import {SurveyStatusMessage} from "./components/SurveyStatusMessage";
import React from "react";
import {SurveyStatusType} from "./utils/types";

/**
 * NotFound component displays a 404 page not found message when the user navigates to a non-existent route.
 */
export default function NotFound() {
    return (
        <SurveyStatusMessage
            title="Page Not Found"
            subtitle="Sorry, we couldn't find that page."
            message="The page you are looking for does not exist. You can return to the previous page or check the URL
            for correctness. Click on the button below to go back."
            showStudyTitle={true}
            isNotFound={true}
            type={SurveyStatusType.Error}
        />
    );
}
