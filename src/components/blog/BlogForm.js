import React, { useState } from "react";
import { addBlogPost } from "../services/blogService";
import styles from "./BlogForm.module.css";

function BlogForm({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tag, setTag] = useState(""); // Ajout de l'état pour le tag

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPostId = await addBlogPost({
        title,
        content,
        imageUrl,
        tag, // Ajout du tag
        createdAt: new Date(),
        categories: [],
      });
      onPostCreated({
        id: newPostId,
        title,
        content,
        imageUrl,
        tag,
        createdAt: new Date(),
      });
      setTitle("");
      setContent("");
      setImageUrl("");
      setTag(""); // Réinitialisation du tag
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles["blog-form"]}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du post"
        required
        className={styles["form-input"]}
      />
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL de l'image"
        required
        className={styles["form-input"]}
      />
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag du post"
        className={styles["form-input"]}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenu du post"
        required
        className={styles["form-textarea"]}
      />
      <button type="submit" className={styles["form-submit"]}>
        Créer le post
      </button>
    </form>
  );
}

export default BlogForm;
