import { Schema, model } from 'mongoose';

const surveyInvitationSchema = new Schema({
    surveyId: {
        type: Schema.Types.ObjectId,
        ref: 'Survey',
        required: true
    },
    recipientId: {
        type: Schema.Types.ObjectId,
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

const SurveyInvitation = model('SurveyInvitation', surveyInvitationSchema);
export default SurveyInvitation;