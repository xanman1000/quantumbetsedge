import mongoose, { Schema, Document } from 'mongoose';

// Define analytics interface
export interface IAnalytics {
  views: number;
  clicks: number;
  emailsSent: number;
  emailsOpened: number;
  smsSent: number;
  conversionRate?: number;
}

// Define Content interface
export interface IContent extends Document {
  title: string;
  body: string;
  type: string;
  status: 'draft' | 'published' | 'archived';
  author: mongoose.Types.ObjectId;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  analytics: IAnalytics;
}

// Define the Mongoose schema
const ContentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    body: {
      type: String,
      required: [true, 'Content body is required']
    },
    type: {
      type: String,
      required: [true, 'Content type is required'],
      enum: ['blog', 'newsletter', 'announcement', 'page']
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required']
    },
    tags: {
      type: [String],
      default: []
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    publishedAt: {
      type: Date
    },
    analytics: {
      views: {
        type: Number,
        default: 0
      },
      clicks: {
        type: Number,
        default: 0
      },
      emailsSent: {
        type: Number,
        default: 0
      },
      emailsOpened: {
        type: Number,
        default: 0
      },
      smsSent: {
        type: Number,
        default: 0
      },
      conversionRate: {
        type: Number
      }
    }
  },
  {
    timestamps: true
  }
);

// Add text index for search functionality
ContentSchema.index({ title: 'text', body: 'text', tags: 'text' });

// Create and export the model
export const Content = mongoose.model<IContent>('Content', ContentSchema); 