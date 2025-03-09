// src/components/PostList.js
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { firestore } from '../firebase';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Create a reference to the "posts" collection using the modular syntax.
    const postsRef = collection(firestore, 'posts');
    // Build a query to get only published posts, ordered by creation date descending.
    const q = query(postsRef, where('published', '==', true), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.length === 0 ? <p>No posts yet.</p> : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>
                {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : ''}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;
