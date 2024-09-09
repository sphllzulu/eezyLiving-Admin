



// import React, { useState, useEffect } from 'react';
// import {
//   Tabs, Tab, Typography, Box, Button, Grid, Card, CardContent, CardMedia, IconButton, TextField, Dialog, DialogTitle, DialogContent, Slide
// } from '@mui/material';
// import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
// import { db } from './firebaseConfig'; // Import your firebase configurations
// import { doc, setDoc, deleteDoc, getDoc, getDocs, collection } from 'firebase/firestore';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const AdminPanel = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [accommodations, setAccommodations] = useState([]);
//   const [selectedAccommodation, setSelectedAccommodation] = useState(null);
//   const [newAccommodation, setNewAccommodation] = useState({ type: '', price: '', image: '' });
//   const [viewMoreOpen, setViewMoreOpen] = useState(false);

//   useEffect(() => {
//     const fetchAccommodations = async () => {
//       const querySnapshot = await getDocs(collection(db, 'accommodation'));
//       const accommodationsData = querySnapshot.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() }));
//       setAccommodations(accommodationsData);
//     };
//     fetchAccommodations();
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleAddAccommodation = async () => {
//     const newId = Date.now().toString();
//     await setDoc(doc(db, 'accommodation', newId), newAccommodation);
//     setAccommodations([...accommodations, { id: newId, ...newAccommodation }]);
//     setNewAccommodation({ type: '', price: '', image: '' });
//   };

//   const handleDeleteAccommodation = async (id) => {
//     await deleteDoc(doc(db, 'accommodation', id));
//     setAccommodations(accommodations.filter(acc => acc.id !== id));
//   };

//   const handleViewMore = async (id) => {
//     if (!id) {
//       console.error('ID is undefined or null');
//       return;
//     }
  
//     const stringId = id.toString(); 
//     try {
//       const docRef = doc(db, 'accommodation', stringId);
//       const docSnap = await getDoc(docRef);
  
//       if (docSnap.exists()) {
//         setSelectedAccommodation(docSnap.data());
//         setViewMoreOpen(true);
//       } else {
//         console.log('No such document!');
//       }
//     } catch (error) {
//       console.error('Error fetching document:', error.message);
//     }
//   };

//   const handleCloseViewMore = () => {
//     setViewMoreOpen(false);
//     setSelectedAccommodation(null);
//   };

// //   const handleSaveChanges = async () => {
// //     if (!selectedAccommodation?.id) return;
  
// //     // Ensure amenities and policies are arrays
// //     const updatedData = {
// //       ...selectedAccommodation,
// //       amenities: Array.isArray(selectedAccommodation.amenities) ? selectedAccommodation.amenities : [],
// //       policies: Array.isArray(selectedAccommodation.policies) ? selectedAccommodation.policies : []
// //     };
  
// //     console.log('Updated Data:', updatedData);
  
// //     try {
// //       // Get reference to the Firestore document
// //       const docRef = doc(db, 'accommodation', selectedAccommodation.id);
  
// //       // Log the reference and data being sent
// //       console.log('Document Reference:', docRef);
// //       console.log('Data Being Set:', updatedData);
  
// //       // Update the document in Firestore
// //       await setDoc(docRef, updatedData, { merge: true }); // Use { merge: true } to update only the fields that changed
  
// //       // Update local state
// //       setAccommodations(accommodations.map(acc => (acc.id === updatedData.id ? updatedData : acc)));
      
// //       // Close the dialog
// //       handleCloseViewMore();
// //     } catch (error) {
// //       console.error('Error updating document:', error.message);
// //     }
// //   };
  

//   const handleSaveChanges = async () => {
//     if (!selectedAccommodation?.id) return;

//     // Ensure amenities and policies are arrays
//     const updatedData = {
//       ...selectedAccommodation,
//       amenities: Array.isArray(selectedAccommodation.amenities) ? selectedAccommodation.amenities : [],
//       policies: Array.isArray(selectedAccommodation.policies) ? selectedAccommodation.policies : []
//     };

//     console.log('Updated Data:', updatedData);

//     try {
//       await setDoc(doc(db, 'accommodation', selectedAccommodation.id), updatedData);
//       setAccommodations(accommodations.map(acc => (acc.id === updatedData.id ? updatedData : acc)));
//       handleCloseViewMore();
//     } catch (error) {
//       console.error('Error updating document:', error.message);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'amenities' || name === 'policies') {
//       // Ensure value is an array before using split and map
//       const arrValue = value ? value.split(',').map(item => item.trim()) : [];
//       console.log(`Updating ${name} to`, arrValue);
//       setSelectedAccommodation(prev => ({ ...prev, [name]: arrValue }));
//     } else {
//       console.log(`Updating ${name} to`, value);
//       setSelectedAccommodation(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Tabs value={tabValue} onChange={handleTabChange} centered>
//         <Tab label="Accommodations" />
//         <Tab label="Bookings" />
//         <Tab label="Users" />
//       </Tabs>

//       {tabValue === 0 && (
//         <Box p={3}>
//           <Typography variant="h4" gutterBottom>Manage Accommodations</Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <TextField label="Type" value={newAccommodation.type} onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })} fullWidth />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField label="Price" value={newAccommodation.price} onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })} fullWidth />
//             </Grid>
//             <Grid item xs={4}>
//               <TextField label="Image URL" value={newAccommodation.image} onChange={(e) => setNewAccommodation({ ...newAccommodation, image: e.target.value })} fullWidth />
//             </Grid>
//             <Grid item xs={12}>
//               <Button variant="contained" onClick={handleAddAccommodation} startIcon={<Add />}>Add Accommodation</Button>
//             </Grid>
//           </Grid>

//           <Grid container spacing={2} sx={{ marginTop: 2 }}>
//             {accommodations.map(acc => (
//               <Grid item xs={12} sm={6} md={4} key={acc.id}>
//                 <Card>
//                   <CardMedia component="img" height="140" image={acc.image} alt={acc.type} />
//                   <CardContent>
//                     <Typography variant="h5">{acc.type}</Typography>
//                     <Typography variant="body2">Price: R{acc.price}</Typography>
//                   </CardContent>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
//                     <IconButton><Edit /></IconButton>
//                     <IconButton onClick={() => handleDeleteAccommodation(acc.id)}><Delete /></IconButton>
//                     <IconButton onClick={() => handleViewMore(acc.id)}><Visibility /></IconButton>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       <Dialog
//         open={viewMoreOpen}
//         onClose={handleCloseViewMore}
//         maxWidth="md"
//         fullWidth
//         TransitionComponent={Transition}
//       >
//         <DialogTitle>Room Details</DialogTitle>
//         <DialogContent>
//           {selectedAccommodation && (
//             <Box>
//               <TextField
//                 label="Type"
//                 name="type"
//                 value={selectedAccommodation.type || ''}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Price"
//                 name="price"
//                 value={selectedAccommodation.price || ''}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Image URL"
//                 name="image"
//                 value={selectedAccommodation.image || ''}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Amenities"
//                 name="amenities"
//                 value={selectedAccommodation.amenities?.join(', ') || ''}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Policies"
//                 name="policies"
//                 value={selectedAccommodation.policies?.join(', ') || ''}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={selectedAccommodation.description || ''}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <img src={selectedAccommodation.image || ''} alt={selectedAccommodation.type || ''} width="100%" style={{ marginTop: 10 }} />
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
//                 <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default AdminPanel;



import React, { useState, useEffect } from 'react';
import {
  Tabs, Tab, Typography, Box, Button, Grid, Card, CardContent, CardMedia, IconButton, TextField, Dialog, DialogTitle, DialogContent, Slide, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { db } from './firebaseConfig'; // Import your firebase configurations
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { keyframes } from '@mui/system';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [newAccommodation, setNewAccommodation] = useState({ type: '', price: '', image: '' });
  const [viewMoreOpen, setViewMoreOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch accommodations
  useEffect(() => {
    const fetchAccommodations = async () => {
      const querySnapshot = await getDocs(collection(db, 'accommodation'));
      const accommodationsData = querySnapshot.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() }));
      setAccommodations(accommodationsData);
    };
    fetchAccommodations();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() }));
      setBookings(bookingsData);
    };
    fetchBookings();
  }, []);

  // Handle booking cancellation
  const handleDeleteBooking = async (bookingId, userEmail) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(bookings.filter(booking => booking.id !== bookingId));

      // Send cancellation email
      await sendCancellationEmail(userEmail, bookingId); 

      // Show success message
      setSnackbarMessage('Booking cancelled and email sent to the user.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setSnackbarMessage('Error cancelling booking.');
      setSnackbarOpen(true);
    }
  };

  


  // // Fetch bookings
  // useEffect(() => {
  //   const fetchBookings = async () => {
  //     const querySnapshot = await getDocs(collection(db, 'bookings'));
  //     const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() }));
  //     setBookings(bookingsData);
  //   };
  //   fetchBookings();
  // }, []);






  // Fetch users and their favorites/bookings
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddAccommodation = async () => {
    const newId = Date.now().toString();
    await setDoc(doc(db, 'accommodation', newId), newAccommodation);
    setAccommodations([...accommodations, { id: newId, ...newAccommodation }]);
    setNewAccommodation({ type: '', price: '', image: '' });
  };

  const handleDeleteAccommodation = async (id) => {
    await deleteDoc(doc(db, 'accommodation', id));
    setAccommodations(accommodations.filter(acc => acc.id !== id));
  };




  // const handleViewMore = async (id) => {
  //   if (!id) {
  //     console.error('ID is undefined or null');
  //     return;
  //   }
  
  //   const stringId = id.toString(); 
  //   try {
  //     const docRef = doc(db, 'accommodation', stringId);
  //     const docSnap = await getDoc(docRef);
  
  //     if (docSnap.exists()) {
  //       setSelectedAccommodation(docSnap.data());
  //       setViewMoreOpen(true);
  //     } else {
  //       console.log('No such document!');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching document:', error.message);
  //   }
  // };
  const handleViewMore = async (id) => {
    if (!id) {
      console.error('ID is undefined or null');
      return;
    }
  
    const stringId = id.toString(); 
    try {
      const docRef = doc(db, 'accommodation', stringId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Set the selected accommodation with the ID included
        setSelectedAccommodation({ id: stringId, ...docSnap.data() });
        setViewMoreOpen(true);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error.message);
    }
  };
  



  const handleCloseViewMore = () => {
    setViewMoreOpen(false);
    setSelectedAccommodation(null);
  };






  const handleSaveChanges = async () => {
    if (!selectedAccommodation?.id) {
      console.error('No accommodation ID found.');
      return;
    }
  
    const updatedData = {
      ...selectedAccommodation,
      amenities: Array.isArray(selectedAccommodation.amenities) ? selectedAccommodation.amenities : [],
      policies: Array.isArray(selectedAccommodation.policies) ? selectedAccommodation.policies : [],
    };
  
    try {
      await setDoc(doc(db, 'accommodation', selectedAccommodation.id), updatedData);
      setAccommodations(accommodations.map(acc => (acc.id === updatedData.id ? updatedData : acc)));
      handleCloseViewMore();
  
      // Show success popup
      setSnackbarMessage('Changes saved successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating accommodation:', error.message);
      setSnackbarMessage('Error saving changes');
      setSnackbarOpen(true);
    }
  };
  

  // const handleSaveChanges = async () => {
  //   if (!selectedAccommodation?.id) return;

  //   const updatedData = {
  //     ...selectedAccommodation,
  //     amenities: Array.isArray(selectedAccommodation.amenities) ? selectedAccommodation.amenities : [],
  //     policies: Array.isArray(selectedAccommodation.policies) ? selectedAccommodation.policies : []
  //   };

  //   try {
  //     await setDoc(doc(db, 'accommodation', selectedAccommodation.id), updatedData);
  //     setAccommodations(accommodations.map(acc => (acc.id === updatedData.id ? updatedData : acc)));
  //     handleCloseViewMore();

  //     // Show success popup
  //     setSnackbarMessage('Changes saved successfully');
  //     setSnackbarOpen(true);
  //   } catch (error) {
  //     console.error('Error updating document:', error.message);
  //     setSnackbarMessage('Error saving changes');
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amenities' || name === 'policies') {
      const arrValue = value ? value.split(',').map(item => item.trim()) : [];
      setSelectedAccommodation(prev => ({ ...prev, [name]: arrValue }));
    } else {
      setSelectedAccommodation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Accommodations" />
        <Tab label="Bookings" />
        <Tab label="Users" />
      </Tabs>

      {tabValue === 0 && (
        <Box p={3}>
          {/* Accommodations Tab */}
          {/* Title */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold', 
          color: 'purple', 
          borderBottom: '2px solid purple', 
          paddingBottom: '10px' 
        }}
      >
        Manage Accommodations
      </Typography>

      {/* Form for adding accommodations */}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {/* Type Input */}
        <Grid item xs={4}>
          <TextField 
            label="Type" 
            value={newAccommodation.type} 
            onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })} 
            fullWidth 
            sx={{
              borderRadius: '8px',
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                border: '2px solid purple', // Purple borders
                padding: '10px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'purple',
              },
            }} 
          />
        </Grid>

        {/* Price Input */}
        <Grid item xs={4}>
          <TextField 
            label="Price" 
            value={newAccommodation.price} 
            onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })} 
            fullWidth 
            sx={{
              borderRadius: '8px',
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                border: '2px solid purple',
                padding: '10px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'purple',
              },
            }} 
          />
        </Grid>

        {/* Image URL Input */}
        <Grid item xs={4}>
          <TextField 
            label="Image URL" 
            value={newAccommodation.image} 
            onChange={(e) => setNewAccommodation({ ...newAccommodation, image: e.target.value })} 
            fullWidth 
            sx={{
              borderRadius: '8px',
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                border: '2px solid purple',
                padding: '10px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'purple',
              },
            }} 
          />
        </Grid>

        {/* Button */}
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            onClick={handleAddAccommodation} 
            startIcon={<Add />} 
            sx={{
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#6a0dad',
              },
              fontSize: '16px',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
          >
            Add Accommodation
          </Button>
        </Grid>
      </Grid>

          {/* Displaying accommodations */}
          <Grid container spacing={4} sx={{ marginTop: 2 }}>
      {accommodations.map(acc => (
        <Grid item xs={12} sm={6} md={3} key={acc.id}>
          <motion.div
            whileHover={{ scale: 1.05 }}  // Animation: scale on hover
            transition={{ duration: 0.3 }}  // Smooth transition
          >
            <Card sx={{ 
              border: '2px solid purple',  // Purple border
              borderRadius: '8px',         // Rounded corners
              boxShadow: 3                 // Shadow for depth
            }}>
              <CardMedia component="img" height="140" image={acc.image} alt={acc.type} />
              <CardContent>
                <Typography variant="h5">{acc.type}</Typography>
                <Typography variant="body2">Price: R{acc.price}</Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
                <IconButton onClick={() => handleDeleteAccommodation(acc.id)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => handleViewMore(acc.id)}>
                  <Visibility />
                </IconButton>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
        </Box>
      )}

      {/* Bookings Tab */}
      {tabValue === 1 && (
  <Box p={3}>
    {/* Bookings Tab */}
    <Typography 
      variant="h4" 
      gutterBottom 
      sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: 'purple', 
        borderBottom: '2px solid purple', 
        paddingBottom: '10px' 
      }}
    >
      Manage Bookings
    </Typography>

    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      {bookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <motion.div
            whileHover={{ scale: 1.05 }} // Animation: scale on hover
            transition={{ duration: 0.3 }} // Smooth transition
          >
            <Card sx={{ border: '2px solid purple', borderRadius: '8px', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking ID: {booking.id}
                </Typography>
                <Typography variant="body2">
                  Room Type: {booking.roomType}
                </Typography>
                <Typography variant="body2">
                  Price: R{booking.price}
                </Typography>
                <Typography variant="body2">
                  User ID: {booking.userId}
                </Typography>
                <Typography variant="body2">
                  Check-in: {booking.checkInDate}
                </Typography>
                <Typography variant="body2">
                  Check-out: {booking.checkOutDate}
                </Typography>
              </CardContent>
              <IconButton
                onClick={() => handleDeleteBooking(booking.id, booking.userEmail)}
                sx={{ color: 'red', marginLeft: 'auto', display: 'block' }}
              >
                <Delete />
              </IconButton>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert onClose={handleSnackbarClose} severity="success">
        {snackbarMessage}
      </Alert>
    </Snackbar>
  </Box>
)}

      {/* Users Tab */}
      {tabValue === 2 && (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>Users</Typography>
          <Grid container spacing={2}>
            {users.map(user => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Email: {user.email}</Typography>
                    <Typography variant="body2">
  Favorites: {user.favorites ? user.favorites.length : 0}
</Typography>
<Typography variant="body2">
  Bookings: {user.bookings ? user.bookings.length : 0}
</Typography>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* View More Dialog */}
      <Dialog
      open={viewMoreOpen}
      onClose={handleCloseViewMore}
      sx={{
        '& .MuiDialog-paper': {
          border: '2px solid purple',     // Purple border for the dialog
          borderRadius: '12px',           // Rounded corners
          padding: 2,                     // Padding inside the dialog
          animation: `${fadeIn} 0.3s ease`, // Fade-in effect
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Shadow effect
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: 'purple' }}>
        Accommodation Details
      </DialogTitle>
      <DialogContent>
        {selectedAccommodation && (
          <>
            {/* Customized TextFields */}
            <TextField
              label="Type"
              value={selectedAccommodation.type}
              name="type"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
            <TextField
              label="Price"
              value={selectedAccommodation.price}
              name="price"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
            <TextField
              label="Description"
              value={selectedAccommodation.description}
              name="description"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
            <TextField
              label="Rating"
              value={selectedAccommodation.rating}
              name="rating"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
            <TextField
              label="Image URL"
              value={selectedAccommodation.image || ''}
              name="image"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
            <TextField
              label="Amenities (comma-separated)"
              value={selectedAccommodation.amenities?.join(', ')}
              name="amenities"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
            <TextField
              label="Policies (comma-separated)"
              value={selectedAccommodation.policies?.join(', ')}
              name="policies"
              onChange={handleChange}
              fullWidth
              sx={{
                marginBottom: 2,
                borderRadius: '8px',
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  border: '1px solid purple',
                  padding: '10px',
                },
              }}
            />
          </>
        )}
      </DialogContent>
      <Box sx={{ padding: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={handleSaveChanges} sx={{ backgroundColor: 'purple', '&:hover': { backgroundColor: '#6a0dad' } }}>
          Save Changes
        </Button>
        <Button variant="outlined" onClick={handleCloseViewMore} sx={{ borderColor: 'purple', color: 'purple' }}>
          Cancel
        </Button>
      </Box>
    </Dialog>

      {/* Snackbar for save confirmation */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;



