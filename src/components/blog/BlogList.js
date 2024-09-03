import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import styles from "./BlogList.module.css";
import BlogForm from "./BlogForm";
import { getBlogPosts, deleteBlogPost } from "../services/blogService";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getBlogPosts();
      setPosts(shuffleArray([...fetchedPosts]));
    } catch (error) {
      console.error("Erreur lors de la récupération des posts:", error);
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const handlePostCreated = (newPost) => {
    setPosts(shuffleArray([newPost, ...posts]));
    setShowForm(false);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await deleteBlogPost(postId);
        setPosts(shuffleArray(posts.filter((post) => post.id !== postId)));
      } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
      }
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles["blog-list"]}>
      <div className={styles["action-buttons"]}>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles["custom-button"]}
        >
          {showForm ? "Annuler" : "Créer un Post"}
        </button>
        <button
          onClick={toggleEditing}
          className={`${styles["custom-button"]} ${isEditing ? styles["active"] : ""}`}
        >
          Modifier
        </button>
      </div>
      {showForm && <BlogForm onPostCreated={handlePostCreated} />}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles["my-masonry-grid"]}
        columnClassName={styles["my-masonry-grid_column"]}
      >
        {posts.map((post) => (
          <div key={post.id} className={styles["blog-post-preview"]}>
            <Link to={`/blog/${post.id}`} className={styles["blog-post-link"]}>
              <div className={styles["blog-post-image-container"]}>
                <div
                  className={styles["blog-post-image"]}
                  style={{
                    backgroundImage: `url(${post.imageUrl})`,
                    paddingBottom: `${Math.floor(Math.random() * (100 - 50 + 1)) + 50}%`,
                  }}
                />
                <div className={styles["blog-post-content"]}>
                  <h3>{post.title}</h3>
                  <p className={styles["blog-post-author"]}>
                    {post.author || "Auteur inconnu"}
                  </p>
                </div>
                <div className={styles["blog-post-tag"]}>
                  {post.tag || "Tag par défaut"}
                </div>
              </div>
            </Link>
            {isEditing && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className={styles["delete-button"]}
                aria-label="Supprimer l'article"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default BlogList;
