const mongoose = require("mongoose");

const TargetSiteSchema = new mongoose.Schema(
  {
    websiteName: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    content: { type: String, required: true },
    metaTitle: String,
    metaDescription: String,
    slug: { type: String, required: true },
    featuredImage: String,
    targetSites: [TargetSiteSchema],
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    author: String,
    publishDate: Date,

    categories: [{ id: Number, name: String, parent: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
