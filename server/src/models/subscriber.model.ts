import mongoose, { Document, Schema } from 'mongoose';

// Define subscription tiers enum
export enum SubscriptionTier {
  FREE = 'FREE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

// Define preferences interface
export interface IPreferences {
  receiveSMS: boolean;
  receiveEmail: boolean;
  categories: string[]; // Sports categories
}

// Define payment details interface
export interface IPaymentDetails {
  lastPaymentId?: string;
  lastPaymentDate?: Date;
  subscriptionId?: string;
  nextBillingDate?: Date;
}

// Define subscriber interface
export interface ISubscriber extends Document {
  email: string;
  name: string;
  phone?: string;
  subscriptionTier: SubscriptionTier;
  isActive: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  unsubscribeToken?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: IPreferences;
  paymentDetails: IPaymentDetails;
}

// Define the Mongoose schema
const subscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  subscriptionTier: {
    type: String,
    enum: Object.values(SubscriptionTier),
    default: SubscriptionTier.FREE,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  unsubscribeToken: {
    type: String
  },
  preferences: {
    receiveSMS: {
      type: Boolean,
      default: false
    },
    receiveEmail: {
      type: Boolean,
      default: true
    },
    categories: {
      type: [String],
      default: []
    }
  },
  paymentDetails: {
    lastPaymentId: String,
    lastPaymentDate: Date,
    subscriptionId: String,
    nextBillingDate: Date
  }
}, {
  timestamps: true
});

// Create and export the model
const Subscriber = mongoose.model<ISubscriber>('Subscriber', subscriberSchema);

export default Subscriber; 