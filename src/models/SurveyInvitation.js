import mongoose from "mongoose";

const surveyInvitationSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'opened', 'completed'],
        default: 'sent'
    },
    uniqueLink: {
        type: String,
        required: true,
        unique: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

const SurveyInvitation = mongoose.model('SurveyInvitation', surveyInvitationSchema);
export default SurveyInvitation;