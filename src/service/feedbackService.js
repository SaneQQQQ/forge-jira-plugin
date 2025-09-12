import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import {fetchCurrentUserDetails} from "./userService";
import path from "path";
import fs from "fs";

/*
    forge variables set --encrypt AWS_ACCESS_KEY_ID [yourAccessKey]
    forge variables set --encrypt AWS_SECRET_ACCESS_KEY [yourSecretKey]
    forge variables set --encrypt AWS_REGION [yourRegion]
    forge variables set --encrypt AWS_VERIFIED_SOURCE_EMAIL [your-verified-email@example.com]
    forge variables set --encrypt AWS_DESTINATION_FEEDBACK_EMAIL [your-destination-email@example.com]
 */

export const sendFeedback = async ({payload, context}) => {
    const feedback = payload?.feedback;
    if (!feedback) {
        const errMessage = "Error sending feedback. No feedback provided";
        console.error(errMessage);
        throw new Error(errMessage);
    }

    const user = await fetchCurrentUserDetails(context);
    const {emailBody, emailHtml} = buildEmailTemplates(feedback, user);
    const client = new SESClient({region: process.env.AWS_REGION});
    const params = {
        Source: process.env.AWS_VERIFIED_SOURCE_EMAIL,
        Destination: {
            ToAddresses: [process.env.AWS_DESTINATION_FEEDBACK_EMAIL],
        },
        Message: {
            Subject: {Data: `New Feedback: ${feedback.feedbackType}`},
            Body: {
                Text: {Data: emailBody},
                Html: {Data: emailHtml},
            },
        },
    };

    try {
        const data = await client.send(new SendEmailCommand(params));
        console.log("Email sent:", data.MessageId);
    } catch (err) {
        console.error("Error sending email:", err);
    }
}

const buildEmailTemplates = (feedback, user) => {
    const htmlTemplatePath = path.resolve(__dirname, "../../static/templates/feedback-email.html");
    const textTemplatePath = path.resolve(__dirname, "../../static/templates/feedback-email.txt");

    const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
    const textTemplate = fs.readFileSync(textTemplatePath, "utf-8");

    const { feedbackType, feedbackText, canContact, researchParticipation } = feedback;

    const emailBody = textTemplate
        .replaceAll("{{feedbackType}}", feedbackType)
        .replaceAll("{{feedbackText}}", feedbackText)
        .replaceAll("{{canContact}}", canContact ? "Yes" : "No")
        .replaceAll("{{researchParticipation}}", researchParticipation ? "Yes" : "No")
        .replaceAll("{{userName}}", user.name)
        .replaceAll("{{userEmail}}", user.email);

    const emailHtml = htmlTemplate
        .replaceAll("{{feedbackType}}", feedbackType)
        .replaceAll("{{feedbackText}}", feedbackText)
        .replaceAll("{{canContact}}", canContact ? "✅ Yes" : "❌ No")
        .replaceAll("{{researchParticipation}}", researchParticipation ? "✅ Yes" : "❌ No")
        .replaceAll("{{userName}}", user.name)
        .replaceAll("{{userEmail}}", user.email)
        .replaceAll("{{userAvatar}}", user.avatar);

    return {emailBody, emailHtml};
};