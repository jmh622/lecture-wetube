import User from '../models/User';
import Video from '../models/Video';
import Comment from '../models/Comment';

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: 'desc' }).populate('owner');
  return res.render('home', { pageTitle: 'Home', videos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate('owner').populate('comments');
  // populate를 안쓰면 아래 코드처럼 따로 유저를 찾아와야 한다.
  // const owner = await User.findById(video.owner);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video is not found' });
  }
  return res.render('watch', { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video is not found' });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash('error', 'Not authorized');
    return res.status(403).redirect('/');
  }
  return res.render('edit', { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video is not found' });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash('error', 'You are not the the owner of the video.');
    return res.status(403).redirect('/');
  }
  const { title, description, hashtags } = req.body;
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash('success', 'Changes saved.');
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => res.render('upload', { pageTitle: 'Upload Video' });
export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    file,
    session: {
      user: { _id },
    },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: res.locals.isHeroku ? file.location : `/${file.path}`,
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo);
    await user.save();
    return res.redirect('/');
  } catch (error) {
    return res.status(400).render('upload', { pageTitle: 'Upload Video', errorMessage: error._message });
  }
};
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video is not found' });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect('/');
  }
  await Video.findByIdAndDelete(id);
  return res.redirect('/');
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    }).populate('owner');
  }
  return res.render('search', { pageTitle: 'Search', keyword, videos });
};
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const removeComment = async (req, res) => {
  const {
    session: { user },
    params: { id },
  } = req;
  const comment = await Comment.findById(id);
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(comment.owner._id) !== String(user._id)) {
    return res.sendStatus(400);
  }
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(204);
};
