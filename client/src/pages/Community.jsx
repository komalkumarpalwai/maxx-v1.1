import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getPosts, createPost, toggleUpvote, addComment } from '../services/community';
import { useAuth } from '../context/AuthContext';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const Community = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', imageFile: null });
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState({});

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPosts(token);
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
    }
    setLoading(false);
  }, [token]);


  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content && !newPost.imageFile) {
      setError('Please provide a caption or an image.');
      return;
    }
    const formData = new FormData();
    formData.append('content', newPost.content);
    if (newPost.imageFile) {
      formData.append('imageFile', newPost.imageFile);
    }
    try {
      await createPost(formData, token, true);
      setNewPost({ content: '', imageFile: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchPosts();
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await toggleUpvote(postId, token);
      fetchPosts();
    } catch (err) {}
  };

  const handleAddComment = async (postId, text) => {
    if (!text) return;
    try {
      await addComment(postId, text, token);
      fetchPosts();
    } catch (err) {}
  };


  // Image preview
  const imagePreview = newPost.imageFile ? URL.createObjectURL(newPost.imageFile) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-6 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-2 text-blue-700">Share something with the community</h2>
          <form onSubmit={handleCreatePost} className="flex flex-col gap-2" encType="multipart/form-data">
            <textarea
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[60px]"
              placeholder="What's on your mind? (caption or image)"
              value={newPost.content}
              onChange={e => setNewPost({ ...newPost, content: e.target.value })}
              maxLength={300}
            />
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={e => setNewPost({ ...newPost, imageFile: e.target.files[0] })}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-14 w-14 object-cover rounded-lg border" />
              )}
              <button type="submit" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-all">Post</button>
            </div>
          </form>
          {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10"><span className="text-blue-600 font-semibold">Loading...</span></div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(post.user?.name)}`}>
                    {post.user?.name ? post.user.name[0].toUpperCase() : '?'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{post.user?.name || 'Unknown'}</span>
                    <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                  <button onClick={() => handleUpvote(post._id)} className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 10-6 0v4M5 12h14l-1.38 8.276A2 2 0 0115.64 22H8.36a2 2 0 01-1.98-1.724L5 12z" /></svg>
                    {post.upvotes.length}
                  </button>
                </div>
                {post.image && (
                  <div className="w-full flex justify-center my-2">
                    <img
                      src={post.image.startsWith('http') ? post.image : `http://localhost:5000/uploads/${post.image}`}
                      alt="Post"
                      className="rounded-lg max-h-80 object-contain border"
                      crossOrigin="anonymous"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/logo.png';
                      }}
                    />
                  </div>
                )}
                {post.content && <div className="text-lg text-gray-700 mb-2 whitespace-pre-line">{post.content}</div>}
                <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none" onClick={() => setShowComments(sc => ({...sc, [post._id]: !sc[post._id]}))}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75v-1.5A2.25 2.25 0 0015 3h-6a2.25 2.25 0 00-2.25 2.25v1.5m12 0A2.25 2.25 0 0119.5 9v6a2.25 2.25 0 01-2.25 2.25m0-10.5v10.5m0 0A2.25 2.25 0 0115 21h-6a2.25 2.25 0 01-2.25-2.25m12-3.75H6.75" /></svg>
                  <span>{post.comments.length} Comments</span>
                </div>
                {showComments[post._id] && (
                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <div className="flex flex-col gap-2">
                      {post.comments.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(c.user?.name)}`}>{c.user?.name ? c.user.name[0].toUpperCase() : '?'}</div>
                          <span className="font-semibold">{c.user?.name || 'User'}:</span>
                          <span>{c.text}</span>
                        </div>
                      ))}
                      <AddComment postId={post._id} onAdd={handleAddComment} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};


const AddComment = ({ postId, onAdd }) => {
  const [text, setText] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onAdd(postId, text); setText(''); }} className="flex gap-2 mt-2">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Comment</button>
    </form>
  );
};

export default Community;
