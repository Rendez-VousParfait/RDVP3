import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminCreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour envoyer les données au serveur
    // Par exemple, en utilisant une fonction de votre service API
    // await createBlogPost({ title, content });

    console.log("Post créé:", { title, content });

    // Rediriger vers la liste des blogs après la création
    navigate("/blog");
  };

  return (
    <div className="admin-create-post">
      <button 
        onClick={() => navigate('/blog')} 
        className="custom-button"
      >
        Retour aux Posts
      </button>
      <h2>Créer un nouveau post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Contenu:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Créer le post</button>
      </form>
    </div>
  );
};

export default AdminCreatePost;