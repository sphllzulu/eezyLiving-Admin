import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, IconButton, Button, TextField, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editImageId, setEditImageId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const imagesCollection = collection(db, 'images');
      const snapshot = await getDocs(imagesCollection);
      const imageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imageList);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !imageName) {
      alert('Please select an image and enter a name.');
      return;
    }
    console.log("Uploading file:", imageFile); 
    setLoading(true);
    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully:", downloadURL);

      const imageData = {
        name: imageName,
        url: downloadURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editImageId) {
        await updateDoc(doc(db, 'images', editImageId), imageData);
      } else {
        await addDoc(collection(db, 'images'), imageData);
      }

      setImageFile(null);
      setImageName('');
      setEditImageId(null);
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setLoading(false);
  };

  const handleDeleteImage = async (id, url) => {
    try {
      await deleteDoc(doc(db, 'images', id));
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleEditImage = (image) => {
    setEditImageId(image.id);
    setImageName(image.name);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Image Gallery</Typography>
      
      {currentUser && (
        <Box component="form" onSubmit={handleImageUpload} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Image Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" component="span" sx={{ mr: 2 }}>
              Choose File
            </Button>
          </label>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (editImageId ? 'Update' : 'Upload')}
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.url}
                alt={image.name}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6">{image.name}</Typography>
                {currentUser && (
                  <Box sx={{ mt: 1 }}>
                    <IconButton onClick={() => handleEditImage(image)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteImage(image.id, image.url)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Gallery;