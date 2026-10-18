import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Sarees', 'Kurtis', 'Lehengas', 'Jewellery'],
    },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    description: { type: String, default: '' },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    image: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    isNew: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model('Product', productSchema);
