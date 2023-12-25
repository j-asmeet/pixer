import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import NavMenu from './NavMenu';

const UserGallery = () => {
    const [imageURLs, setImageURLs] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
if(localStorage.getItem("email")==='' || localStorage.getItem("email")===undefined)
navigate('/');

      const fetchImages = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_API_URL+'/Dev/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: localStorage.getItem("email") }),
          });
  
          if (response.ok) {
            const data = await response.json();
            setImageURLs(data);
          } else {
            console.error('Failed to fetch images');
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };
  
      fetchImages();
    }, []);
  
    const openModal = (url) => {
      setSelectedImage(url);
    };
  
    const closeModal = () => {
      setSelectedImage(null);
    };
  
    return (
      <>
        <NavMenu /> 
        <Box mt={12}> 
          <Typography variant="h4" align="center" gutterBottom>
            Gallery
          </Typography>
          <Grid container spacing={2}>
            {imageURLs.map((url, index) => (
              <Grid item key={index} onClick={() => openModal(url)}>
                <img
                  src={url}
                  alt={`Image-${index}`}
                  style={{
                    width: '200px',
                    height: '200px',
                    cursor: 'pointer',
                    border: selectedImage === url ? '3px solid #f50057' : 'none', // Highlight selected image
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Modal open={!!selectedImage} onClose={closeModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                maxWidth: '80%',
                maxHeight: '80%',
                overflow: 'auto',
              }}
            >
              <img src={selectedImage} alt="Enlarged" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Modal>
        </Box>
      </>
    );
  };
  
  export default UserGallery;