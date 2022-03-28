import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, minlength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  fileUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

videoSchema.static('formatHashtags', (hashtags) => hashtags.split(',').map((hashtag) => (hashtag.startsWith('#') ? hashtag : `#${hashtag}`)));

const Video = mongoose.model('Video', videoSchema);

export default Video;
