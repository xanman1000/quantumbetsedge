import mongoose, { Document, Schema } from 'mongoose';

// Delivery status enum
export enum DeliveryStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  OPENED = 'opened',
  CLICKED = 'clicked'
}

// Delivery channel enum
export enum DeliveryChannel {
  EMAIL = 'email',
  SMS = 'sms'
}

// Delivery interface
export interface IDelivery extends Document {
  subscriberId: Schema.Types.ObjectId;
  contentId: Schema.Types.ObjectId;
  channel: DeliveryChannel;
  status: DeliveryStatus;
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  failureReason?: string;
  retryCount: number;
  trackingId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Create delivery schema
const deliverySchema = new Schema<IDelivery>({
  subscriberId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscriber',
    required: true,
  },
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
  channel: {
    type: String,
    enum: Object.values(DeliveryChannel),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(DeliveryStatus),
    default: DeliveryStatus.PENDING,
  },
  sentAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  openedAt: {
    type: Date,
  },
  clickedAt: {
    type: Date,
  },
  failureReason: {
    type: String,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  trackingId: {
    type: String,
    required: true,
    unique: true,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Create indexes for querying
deliverySchema.index({ subscriberId: 1, contentId: 1, channel: 1 }, { unique: true });
deliverySchema.index({ status: 1 });
deliverySchema.index({ sentAt: 1 });
deliverySchema.index({ trackingId: 1 }, { unique: true });

// Create model
const Delivery = mongoose.model<IDelivery>('Delivery', deliverySchema);

export default Delivery; 