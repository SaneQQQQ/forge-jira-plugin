import fs from "fs";
import path from "path";
import {fetch} from "@forge/api";

export const sendFeedback = async ({payload}) => {
    const feedback = payload?.feedback;
    if (!feedback) {
        const errMessage = "Error sending feedback. No feedback provided";
        console.error(errMessage);
        throw new Error(errMessage);
    }
    const {feedbackType,
        feedbackText,
        canContact,
        researchParticipation} = feedback;
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const url = `https://api.mailgun.net/v3/${domain}/messages`;

    const htmlTemplatePath = path.resolve(__dirname, "../../static/templates/feedback-email.html");
    const textTemplatePath = path.resolve(__dirname, "../../static/templates/feedback-email.txt");

    const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
    const textTemplate = fs.readFileSync(textTemplatePath, "utf-8");

    const emailBody = textTemplate
        .replace("{{feedbackType}}", feedbackType)
        .replace("{{feedbackText}}", feedbackText)
        .replace("{{canContact}}", canContact ? "Yes" : "No")
        .replace("{{researchParticipation}}", researchParticipation ? "Yes" : "No");

    const emailHtml = htmlTemplate
        .replace("{{feedbackType}}", feedbackType)
        .replace("{{feedbackText}}", feedbackText)
        .replace("{{canContact}}", canContact ? "✅ Yes" : "❌ No")
        .replace("{{researchParticipation}}", researchParticipation ? "✅ Yes" : "❌ No");

    const formData = new URLSearchParams();
    formData.append("from", `Feedback Bot <me@${domain}>`);
    formData.append("to", process.env.FEEDBACK_EMAIL);
    formData.append("subject", `New Feedback: ${feedbackType}`);
    formData.append("text", emailBody.trim());
    formData.append("html", emailHtml);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Mailgun error:", errorText);
        throw new Error(`Failed to send email: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email sent:", result);
}