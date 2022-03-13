const videos = [
  {
    id: 1,
    title: 'First video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 1,
  },
  {
    id: 2,
    title: 'Second video',
    rating: 5,
    comments: 4,
    createdAt: '3 minutes ago',
    views: 11,
  },
  {
    id: 3,
    title: 'Third video',
    rating: 3,
    comments: 2,
    createdAt: '12 minutes ago',
    views: 519,
  },
];
export const trending = (req, res) => res.render('home', { pageTitle: 'Home', videos });
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render('watch', { pageTitle: `Watch ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render('edit', { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => res.render('upload', { pageTitle: 'Upload Video' });
export const postUpload = (req, res) => {
  const { title } = req.body;
  videos.push({
    id: videos.length + 1,
    title,
    rating: 0,
    comments: 0,
    createdAt: 'just now',
    views: 0,
  });
  return res.redirect('/');
};
export const deleteVideo = (req, res) => res.send('Remove');
export const search = (req, res) => res.send('Search');
