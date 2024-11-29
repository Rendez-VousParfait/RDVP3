import React, { useState } from "react";
import { Box, Typography, Button, TextField, Grid, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./AdminPanel.css";
import { useAuth } from "../hooks/useAuth";

const AdminPanel = () => {
  const { user } = useAuth();
  // const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    type: "",
    name: "",
    description: "",
    price: "",
    address: "",
    city: "",
    country: "",
    rating: "",
    image1: "",
    image2: "",
    // Champs communs
    accessibility: "",
    public_cible: "",
    // Champs spécifiques pour les hôtels
    standing: "",
    environment: "",
    accomodation_type: "",
    style: "",
    equipments1: "",
    equipments2: "",
    equipments3: "",
    // Champs spécifiques pour les activités
    activity_type: "",
    duration: "",
    cadre: "",
    ambiance: "",
    // Champs spécifiques pour les restaurants
    cuisine_origine: "",
    cuisinetype: "",
    ambiances: "",
    services1: "",
    services2: "",
  });
  // const [revenue, setRevenue] = useState(0);
  // const [orderCount, setOrderCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const offerData = {
        ...newOffer,
        userId: user.uid,
        createdAt: new Date()
      };

      // Supprimer les champs vides ou non pertinents selon le type d'offre
      Object.keys(offerData).forEach(key => {
        if (offerData[key] === "" || 
           (offerData.type !== "hotel" && ["standing", "environment", "accomodation_type", "style", "equipments1", "equipments2", "equipments3"].includes(key)) ||
           (offerData.type !== "activity" && ["activity_type", "duration", "cadre", "ambiance"].includes(key)) ||
           (offerData.type !== "restaurant" && ["cuisine_origine", "cuisinetype", "ambiances", "services1", "services2"].includes(key))) {
          delete offerData[key];
        }
      });

      await addDoc(collection(db, "offers"), offerData);
      // setOffers(prev => [...prev, { id: offerRef.id, ...offerData }]);
      setNewOffer({
        type: "",
        name: "",
        description: "",
        price: "",
        address: "",
        city: "",
        country: "",
        rating: "",
        image1: "",
        image2: "",
        accessibility: "",
        public_cible: "",
        standing: "",
        environment: "",
        accomodation_type: "",
        style: "",
        equipments1: "",
        equipments2: "",
        equipments3: "",
        activity_type: "",
        duration: "",
        cadre: "",
        ambiance: "",
        cuisine_origine: "",
        cuisinetype: "",
        ambiances: "",
        services1: "",
        services2: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'offre:", error);
    }
  };

  // ... (le reste du code reste inchangé)

  return (
    <Box className="admin-panel">
      <Typography variant="h4" gutterBottom className="dashboard-title">
        Panel Administrateur
      </Typography>
      {/* ... (le reste du code reste inchangé) */}
      <Paper className="offer-form">
        <Typography variant="h6" gutterBottom className="form-title">
          Ajouter une nouvelle offre
        </Typography>
        <form onSubmit={handleAddOffer}>
          <Grid container spacing={2} className="form-grid">
            {/* Champs communs */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'offre</InputLabel>
                <Select
                  name="type"
                  value={newOffer.type}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="hotel">Hôtel</MenuItem>
                  <MenuItem value="activity">Activité</MenuItem>
                  <MenuItem value="restaurant">Restaurant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={newOffer.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newOffer.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix"
                name="price"
                type="number"
                value={newOffer.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Adresse"
                name="address"
                value={newOffer.address}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ville"
                name="city"
                value={newOffer.city}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pays"
                name="country"
                value={newOffer.country}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Note"
                name="rating"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={newOffer.rating}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image 1 URL"
                name="image1"
                value={newOffer.image1}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image 2 URL"
                name="image2"
                value={newOffer.image2}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Accessibilité"
                name="accessibility"
                value={newOffer.accessibility}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Public cible"
                name="public_cible"
                value={newOffer.public_cible}
                onChange={handleInputChange}
              />
            </Grid>
            {/* Champs spécifiques pour les hôtels */}
            {newOffer.type === "hotel" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Standing"
                    name="standing"
                    value={newOffer.standing}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Environnement"
                    name="environment"
                    value={newOffer.environment}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Type d'hébergement"
                    name="accomodation_type"
                    value={newOffer.accomodation_type}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Style"
                    name="style"
                    value={newOffer.style}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Équipement 1"
                    name="equipments1"
                    value={newOffer.equipments1}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Équipement 2"
                    name="equipments2"
                    value={newOffer.equipments2}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Équipement 3"
                    name="equipments3"
                    value={newOffer.equipments3}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
            {/* Champs spécifiques pour les activités */}
            {newOffer.type === "activity" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Type d'activité"
                    name="activity_type"
                    value={newOffer.activity_type}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Durée"
                    name="duration"
                    value={newOffer.duration}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cadre"
                    name="cadre"
                    value={newOffer.cadre}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ambiance"
                    name="ambiance"
                    value={newOffer.ambiance}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
            {/* Champs spécifiques pour les restaurants */}
            {newOffer.type === "restaurant" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Origine de la cuisine"
                    name="cuisine_origine"
                    value={newOffer.cuisine_origine}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Type de cuisine"
                    name="cuisinetype"
                    value={newOffer.cuisinetype}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ambiance"
                    name="ambiances"
                    value={newOffer.ambiances}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Service 1"
                    name="services1"
                    value={newOffer.services1}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Service 2"
                    name="services2"
                    value={newOffer.services2}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" className="submit-button">
                Ajouter l'offre
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {/* ... (le reste du code reste inchangé) */}
    </Box>
  );
};

export default AdminPanel;