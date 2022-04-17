const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const addComment = (text, id) => {
  const videoComments = document.querySelector('.video__comments ul');
  const newComment = document.createElement('li');
  newComment.dataset.id = id;
  newComment.className = 'video__comment';
  const icon = document.createElement('i');
  icon.className = 'fas fa-comment';
  const span = document.createElement('span');
  span.innerText = ` ${text}`;
  const span2 = document.createElement('span');
  span2.className = 'remove-comments';
  span2.innerText = '❌';
  span2.addEventListener('click', handleRemoveComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector('textarea');
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;

  if (!text) {
    return;
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = '';
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener('submit', handleSubmit);
}

const handleRemoveComment = async (evt) => {
  const {
    target: { parentNode },
  } = evt;

  const response = await fetch(`/api/videos/${parentNode.dataset.id}/comment`, {
    method: 'DELETE',
  });

  if (response.status === 204) {
    parentNode.remove();
  }
};

document.querySelectorAll('.remove-comments').forEach((el) => {
  el.addEventListener('click', handleRemoveComment);
});
