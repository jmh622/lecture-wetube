const fakeUser = {
  username: 'muho',
  loggedIn: false,
};

export const trending = (req, res) => {
  const videos = [
    {
      id: 1,
      title: 'First video',
      rating: 5,
      comments: 2,
      createdAt: '2 minutes ago',
      vies: 59,
    },
    {
      id: 2,
      title: 'Second video',
      rating: 5,
      comments: 4,
      createdAt: '3 minutes ago',
      vies: 11,
    },
    {
      id: 3,
      title: 'Third video',
      rating: 3,
      comments: 2,
      createdAt: '12 minutes ago',
      vies: 519,
    },
  ];
  return res.render('home', { pageTitle: 'Home', videos });
};
export const see = (req, res) => res.render('watch');
export const edit = (req, res) => res.render('edit');
export const upload = (req, res) => res.send('Upload');
export const deleteVideo = (req, res) => {
  console.log(req.params);
  return res.send('Remove');
};
export const search = (req, res) => res.send('Search');
