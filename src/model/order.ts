import { model, Schema, Document } from 'mongoose';

interface OrderItem extends Document {
  productId: Schema.Types.ObjectId;
  payablePrice: number;
  purchasedQty: number;
}

interface OrderStatus extends Document {
  type: 'ordered' | 'packed' | 'shipped' | 'delivered';
  date?: Date;
  isCompleted: boolean;
}

interface Order extends Document {
  user: Schema.Types.ObjectId;
  addressId: Schema.Types.ObjectId;
  totalAmount: number;
  items: OrderItem[];
  paymentStatus: 'pending' | 'completed' | 'cancelled' | 'refund';
  paymentType: 'cod' | 'card';
  orderStatus: OrderStatus[];
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: 'UserAddress',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refund'],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['cod', 'card'],
      required: true,
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ['ordered', 'packed', 'shipped', 'delivered'],
          default: 'ordered',
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default model<Order>('Order', orderSchema);
