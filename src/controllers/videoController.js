export const trending = (req, res) => res.send('Trending Videos');
export const see = (req, res) => {
  console.log(req.params);
  return res.send('Watch');
};
export const edit = (req, res) => {
  console.log(req.params);
  return res.send('Edit');
};
export const upload = (req, res) => res.send('Upload');
export const deleteVideo = (req, res) => {
  console.log(req.params);
  return res.send('Remove');
};
export const search = (req, res) => res.send('Search');