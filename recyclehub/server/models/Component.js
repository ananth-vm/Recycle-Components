const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema(
  {
    // Donor information
    donorName: { type: String, required: true, trim: true },
    donorEmail: { type: String, required: true, trim: true },
    donorPhone: { type: String, required: true },
    donorFirebaseUID: { type: String, required: true }, // Links to Firebase Auth user

    // Component details
    category: {
      type: String,
      required: true,
      enum: [
        'CPU / Processor',
        'RAM / Memory',
        'Motherboard',
        'GPU / Graphics Card',
        'Hard Drive / SSD',
        'Power Supply',
        'Monitor / Display',
        'Battery',
        'Circuit Board',
        'Cable / Connector',
        'Cooling Fan',
        'Keyboard / Input Device',
        'Other',
      ],
    },
    description: { type: String, required: true },
    condition: {
      type: String,
      enum: ['Working', 'Partially Working', 'Unknown'],
      default: 'Unknown',
    },

    // Photos uploaded to Cloudinary (array of URLs)
    photos: [{ type: String }],

    // Pickup location
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // Admin workflow status
    status: {
      type: String,
      enum: [
        'Pending',         
        'Verified',        
        'Testing',         
        'Approved',        
        'Rejected',        
        'PickupAssigned',  
        'Delivered',      
      ],
      default: 'Pending',
    },

    // Admin fields
    adminNotes: { type: String, default: '' },     
    testReport: { type: String, default: '' },     
    rejectionReason: { type: String, default: '' },
    assignedWarehouse: {
      name: { type: String, default: '' },
      contact: { type: String, default: '' },
      address: { type: String, default: '' },
    },

    // Timestamps for status milestones
    verifiedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Component', componentSchema);
