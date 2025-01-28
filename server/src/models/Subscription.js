import mongoose from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        default: 'free',
    },
    active: {
        type: Boolean,
        default: true,
    },
    startDate: {
        type: Date,
        default: new Date(),
    },
    endDate: {
        type: Date,
        required: false,
    },
});
export const Subscription = mongoose.model('Subscription', subscriptionSchema);
