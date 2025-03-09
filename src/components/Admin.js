// src/components/Admin.js
import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', published: false });

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Fetch posts in real time when user is logged in
  useEffect(() => {
    if (user) {
      const postsRef = collection(firestore, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, snapshot => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth);
  };

  // Handle create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update an existing post
        const postDocRef = doc(firestore, 'posts', editingId);
        await updateDoc(postDocRef, {
          title: form.title,
          content: form.content,
          published: form.published,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        // Create a new post
        await addDoc(collection(firestore, 'posts'), {
          title: form.title,
          content: form.content,
          published: form.published,
          createdAt: serverTimestamp()
        });
      }
      // Reset form
      setForm({ title: '', content: '', published: false });
    } catch (error) {
      alert(error.message);
    }
  };

  // Pre-fill the form for editing
  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, content: post.content, published: post.published });
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const postDocRef = doc(firestore, 'posts', postId);
      await deleteDoc(postDocRef);
    }
  };

  if (!user) {
    return (
      <div>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>{editingId ? 'Edit Post' : 'Create New Post'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>

      <h3>Existing Posts</h3>
      {posts.length === 0 && <p>No posts available.</p>}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <strong>{post.title}</strong> {post.published ? "(Published)" : "(Draft)"}
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
