import React, { useState, useEffect } from "react";
import { ReplyDialog } from "./ReviewReply";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import { db } from "./firebaseConfig"; 
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { keyframes } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import Gallery from "./Gallery";
import Navbar from "./Navbar";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from './firebaseConfig'; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [newAccommodation, setNewAccommodation] = useState({
    type: "",
    price: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [viewMoreOpen, setViewMoreOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  // const [reviews, setReviews] = useState([]); 
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetching accommodations
  useEffect(() => {
    const fetchAccommodations = async () => {
      const querySnapshot = await getDocs(collection(db, "accommodation"));
      const accommodationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id.toString(),
        ...doc.data(),
      }));
      setAccommodations(accommodationsData);
    };
    fetchAccommodations();
  }, []);

  // fetching bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Set default status to 'Pending' if not present
      }));
      setBookings(bookingsData);
    };
    fetchBookings();
  }, []);

  // function for filtering by id for search input
  const filteredBookings = bookings.filter((booking) =>
    booking.userId.includes(searchId)
  );

  const handleCancelBooking = async (bookingId, userEmail) => {
    try {
      console.log("Attempting to cancel booking:", bookingId);

      // Convert bookingId to string if it's not already
      const bookingIdString = bookingId.toString();

      // Retrieve all bookings to ensure you have the correct full ID
      const bookingsCollection = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);

      let fullBookingId = null;

      // Find the full booking ID that matches the given partial ID
      bookingsSnapshot.forEach((doc) => {
        if (doc.id.startsWith(bookingIdString)) {
          fullBookingId = doc.id; // Use the full ID (e.g. 1725837902670-fABVFuss72goxgodGfe5fl6ZnrE3)
        }
      });

      if (!fullBookingId) {
        throw new Error(`Booking with ID ${bookingIdString} does not exist`);
      }

      console.log("Full booking ID:", fullBookingId);

      // Reference to the specific booking document using the full ID
      const bookingRef = doc(db, "bookings", fullBookingId);

      // Check if the booking document exists
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        throw new Error(`Booking with ID ${fullBookingId} does not exist`);
      }

      // Update the booking status to "Cancelled"
      await updateDoc(bookingRef, {
        status: "Cancelled",
        cancelledAt: new Date().toISOString(),
      });

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === fullBookingId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      // Send a cancellation email
      await axios.post("http://localhost:3001/api/send-email", {
        to: userEmail,
        subject: "Booking Cancellation Confirmation",
        text: `Your booking with ID ${bookingIdString} has been cancelled.`,
      });

      // Display success message
      setSnackbarMessage("Booking cancelled and email sent to the user.");
      setSnackbarOpen(true);

      console.log("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setSnackbarMessage(`Error cancelling booking: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  //this is merely for debugging to ensure that the booking is indeed present
  const listAllBookings = async () => {
    const bookingsCollection = collection(db, "bookings");
    const bookingsSnapshot = await getDocs(bookingsCollection);
    console.log("All bookings:");
    bookingsSnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  const handleConfirmBooking = async (bookingId, userEmail) => {
    await listAllBookings();
    try {
      console.log("Attempting to confirm booking:", bookingId);

      // Convert bookingId to string if it's not already
      const bookingIdString = bookingId.toString();

      // Log the full list of bookings
      const bookingsCollection = collection(db, "bookings");
      const bookingsSnapshot = await getDocs(bookingsCollection);

      let fullBookingId = null;

      // Find the full booking ID that matches the given partial ID
      bookingsSnapshot.forEach((doc) => {
        if (doc.id.startsWith(bookingIdString)) {
          fullBookingId = doc.id;
        }
      });

      if (!fullBookingId) {
        throw new Error(`Booking with ID ${bookingIdString} does not exist`);
      }

      console.log("Full booking ID:", fullBookingId);

      // Reference to the specific booking document using the full ID
      const bookingRef = doc(db, "bookings", fullBookingId);

      // Check if the booking document exists
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        throw new Error(`Booking with ID ${fullBookingId} does not exist`);
      }

      // Update the booking status
      await updateDoc(bookingRef, {
        status: "Confirmed",
        confirmedAt: new Date().toISOString(),
      });

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === fullBookingId
            ? { ...booking, status: "Confirmed" }
            : booking
        )
      );

      // Send a confirmation email
      await axios.post("http://localhost:3001/api/send-email", {
        to: userEmail,
        subject: "Booking Confirmation",
        text: `Your booking with ID ${bookingIdString} has been confirmed.`,
      });

      // Display success message
      setSnackbarMessage("Booking confirmed and email sent to the user.");
      setSnackbarOpen(true);

      console.log("Booking confirmed successfully");
    } catch (error) {
      console.error("Error confirming booking:", error);
      setSnackbarMessage(`Error confirming booking: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  // Fetch users and their favorites/bookings

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id.toString(),
        ...doc.data(),
      }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // const handleAddAccommodation = async () => {
  //   const newId = Date.now().toString();
  //   await setDoc(doc(db, "accommodation", newId), newAccommodation);
  //   setAccommodations([...accommodations, { id: newId, ...newAccommodation }]);
  //   setNewAccommodation({ type: "", price: "", image: "" });
  // };

  // to add a new room
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }
    
    const storageRef = ref(storage, `accommodation_images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        alert("Image upload failed. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setSelectedAccommodation(prev => ({ ...prev, image: downloadURL }));
          setSnackbarMessage("Image uploaded successfully!");
          setSnackbarOpen(true);
          setUploadProgress(0);
        });
      }
    );
  };


 

 
 
  // const handleAddAccommodation = async () => {
  //   if (!newAccommodation.type || !newAccommodation.price || !newAccommodation.image) {
  //     alert("Please fill in all fields and upload an image.");
  //     return;
  //   }
  
  //   try {
  //     const newId = Date.now().toString(); // Generate a unique ID
  
  //     // Add the new accommodation to Firestore
  //     await setDoc(doc(db, "accommodation", newId), newAccommodation);
  
  //     // Update local state
  //     setAccommodations([...accommodations, { id: newId, ...newAccommodation }]);
  
  //     // Reset the form
  //     setNewAccommodation({ type: "", price: "", image: "" });
  //     setImageFile(null); // Reset the image file state
  //     alert("Accommodation added successfully!");
  //   } catch (error) {
  //     console.error("Error adding accommodation: ", error);
  //     alert("Failed to add accommodation. Please try again.");
  //   }
  // };
  const handleAddAccommodation = async () => {
    if (!newAccommodation.type || !newAccommodation.price) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const newId = Date.now().toString();
      await setDoc(doc(db, "accommodation", newId), newAccommodation);
      setAccommodations([...accommodations, { id: newId, ...newAccommodation }]);
      setNewAccommodation({ type: "", price: "", image: "" });
      setImageFile(null);
      setSnackbarMessage("Accommodation added successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding accommodation: ", error);
      setSnackbarMessage("Failed to add accommodation. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteAccommodation = async (id) => {
    await deleteDoc(doc(db, "accommodation", id));
    setAccommodations(accommodations.filter((acc) => acc.id !== id));
  };

  const handleViewMore = async (id) => {
    if (!id) {
      console.error("ID is undefined or null");
      return;
    }

    const stringId = id.toString();
    try {
      const docRef = doc(db, "accommodation", stringId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Set the selected accommodation with the ID included
        setSelectedAccommodation({ id: stringId, ...docSnap.data() });
        setViewMoreOpen(true);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error.message);
    }
  };

  const handleCloseViewMore = () => {
    setViewMoreOpen(false);
    setSelectedAccommodation(null);
  };

  
const handleSaveChanges = async () => {
  if (!selectedAccommodation?.id) {
    console.error("No accommodation ID found.");
    return;
  }

  // Ensure amenities and policies are in the correct format
  const updatedData = {
    ...selectedAccommodation,
    amenities: Array.isArray(selectedAccommodation.amenities)
      ? selectedAccommodation.amenities
      : [],
    policies: Array.isArray(selectedAccommodation.policies)
      ? selectedAccommodation.policies
      : [],
  };

  try {
    // Update Firestore document with new details, including the image URL
    await setDoc(doc(db, "accommodation", selectedAccommodation.id), updatedData);

    // Update local accommodations state
    setAccommodations(
      accommodations.map((acc) =>
        acc.id === updatedData.id ? updatedData : acc
      )
    );

    handleCloseViewMore();

    // Show success popup
    setSnackbarMessage("Changes saved successfully");
    setSnackbarOpen(true);
  } catch (error) {
    console.error("Error updating accommodation:", error.message);
    setSnackbarMessage("Error saving changes");
    setSnackbarOpen(true);
  }
};
  // const handleSaveChanges = async () => {
  //   if (!selectedAccommodation?.id) {
  //     console.error("No accommodation ID found.");
  //     return;
  //   }

  //   const updatedData = {
  //     ...selectedAccommodation,
  //     amenities: Array.isArray(selectedAccommodation.amenities)
  //       ? selectedAccommodation.amenities
  //       : [],
  //     policies: Array.isArray(selectedAccommodation.policies)
  //       ? selectedAccommodation.policies
  //       : [],
  //   };

  //   try {
  //     await setDoc(
  //       doc(db, "accommodation", selectedAccommodation.id),
  //       updatedData
  //     );
  //     setAccommodations(
  //       accommodations.map((acc) =>
  //         acc.id === updatedData.id ? updatedData : acc
  //       )
  //     );
  //     handleCloseViewMore();

  //     // Show success popup
  //     setSnackbarMessage("Changes saved successfully");
  //     setSnackbarOpen(true);
  //   } catch (error) {
  //     console.error("Error updating accommodation:", error.message);
  //     setSnackbarMessage("Error saving changes");
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amenities" || name === "policies") {
      const arrValue = value ? value.split(",").map((item) => item.trim()) : [];
      setSelectedAccommodation((prev) => ({ ...prev, [name]: arrValue }));
    } else {
      setSelectedAccommodation((prev) => ({ ...prev, [name]: value }));
    }
  };

  // functions for reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, "reviews");
      const reviewDocs = await getDocs(reviewsCollection);
      setReviews(reviewDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchReviews();
  }, []);


// to handle review reply
const handleOpenReplyDialog = (reviewId) => {
  setSelectedReviewId(reviewId);
  setOpenReplyDialog(true);
};

const handleCloseReplyDialog = () => {
  setOpenReplyDialog(false);
  setSelectedReviewId(null);
};

const handleSubmitReply = async (reviewId, replyText) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      adminReply: replyText,
      adminReplyTimestamp: new Date()
    });
    
    // Update the local state to reflect the change
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, adminReply: replyText, adminReplyTimestamp: new Date() } 
        : review
    ));
  } catch (error) {
    console.error("Error updating review: ", error);
    // Handle error (e.g., show an error message to the user)
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
    <div>
      <Navbar/>
    <Box sx={{ width: "100%" }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{color:'black'}}>
        <Tab label="Rooms" />
        <Tab label="Bookings" />
        <Tab label="Reviews" />
        <Tab label="Gallery" />

      </Tabs>

      {tabValue === 0 && (
        <Box p={3}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "purple",
            borderBottom: "2px solid purple",
            paddingBottom: "10px",
          }}
        >
          Manage Rooms
        </Typography>
  
        {/* Form for adding accommodations */}
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
  {/* Type Input */}
  <Grid item xs={12} sm={6} md={4}>
    <TextField
      label="Type"
      value={newAccommodation.type}
      onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })}
      fullWidth
      sx={{
        borderRadius: "8px",
        "& .MuiInputBase-root": {
          borderRadius: "8px",
          border: "2px solid purple",
          padding: "10px",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "purple",
        },
      }}
    />
  </Grid>

  {/* Price Input */}
  <Grid item xs={12} sm={6} md={4}>
    <TextField
      label="Price"
      value={newAccommodation.price}
      onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })}
      fullWidth
      sx={{
        borderRadius: "8px",
        "& .MuiInputBase-root": {
          borderRadius: "8px",
          border: "2px solid purple",
          padding: "10px",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "purple",
        },
      }}
    />
  </Grid>

  {/* Image Upload Input */}
  <Grid item xs={12} md={4}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <Button
        variant="contained"
        component="label"
        fullWidth
        sx={{ 
          backgroundColor: 'purple', 
          color: 'white',
          height: '56px', // Match height with TextField
        }}
      >
        Upload Image
        <input
          type="file"
          hidden
          onChange={handleImageChange}
        />
      </Button>

      {/* Upload button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleUploadImage}
        sx={{ 
          backgroundColor: 'black', 
          color: 'white',
          height: '56px', // Match height with TextField
        }}
      >
        Upload to database
      </Button>
    </Box>
  </Grid>

  {/* Add Room Button */}
  <Grid item xs={12}>
    <Button
      variant="contained"
      onClick={handleAddAccommodation}
      startIcon={<Add />}
      fullWidth
      sx={{
        backgroundColor: "black",
        "&:hover": {
          backgroundColor: "#6a0dad",
        },
        fontSize: { xs: "14px", sm: "16px" },
        padding: { xs: "8px 16px", sm: "10px 20px" },
        borderRadius: "8px",
      }}
    >
      Add Room
    </Button>
  </Grid>
</Grid>
  
        {/* Displaying accommodations */}
        <Grid container spacing={4} sx={{ marginTop: 2 }}>
          {accommodations.map((acc) => (
            <Grid item xs={12} sm={6} md={3} key={acc.id}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card sx={{ border: "2px solid purple", borderRadius: "8px", boxShadow: 3 }}>
                  <CardMedia component="img" height="140" image={acc.image} alt={acc.type} />
                  <CardContent>
                    <Typography variant="h5">{acc.type}</Typography>
                    <Typography variant="body2">Price: R{acc.price}</Typography>
                  </CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
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
          <Typography variant="h4" gutterBottom>
            Manage Bookings
          </Typography>

          {/* Search input */}
          <TextField
            label="Search User by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>UserID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Room Type</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>CheckIn</TableCell>
                  <TableCell>CheckOut</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => {
                  // here we're Fetch the user information from the users array based on booking.userId
                  const user = users.find((u) => u.id === booking.userId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.userId}</TableCell>
                      <TableCell>{user ? user.email : "Unknown"}</TableCell>
                      <TableCell>{booking.type || "Unknown"}</TableCell>
                      <TableCell>R{booking.price || "N/A"}</TableCell>
                      <TableCell>{booking.checkInDate || "Unknown"}</TableCell>
                      <TableCell>{booking.checkOutDate || "Unknown"}</TableCell>
                      <TableCell>{booking.guests || "Unknown"}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success" // Green button
                          onClick={() =>
                            handleConfirmBooking(booking.id, user?.email)
                          }
                          sx={{
                            backgroundColor: "green",
                            "&:hover": {
                              backgroundColor: "darkgreen",
                            },
                            marginRight: "8px", // Space between buttons
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outlined"
                          color="error" // Red button
                          onClick={() =>
                            handleCancelBooking(booking.id, user?.email)
                          }
                          sx={{
                            borderColor: "red",
                            color: "red",
                            "&:hover": {
                              borderColor: "darkred",
                              color: "darkred",
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* reviews tab */}
      {tabValue === 2 && (
        <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Overall Hotel Reviews
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Review ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Review</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Admin Reply</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.userId}</TableCell>
                  <TableCell>{review.reviewText}</TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell>
                    {new Date(review.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {review.adminReply ? (
                      <>
                        <Typography variant="body2">{review.adminReply}</Typography>
                        <Typography variant="caption">
                          {new Date(review.adminReplyTimestamp).toLocaleString()}
                        </Typography>
                      </>
                    ) : (
                      'No reply yet'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleOpenReplyDialog(review.id)}
                      sx={{background:'purple'}}
                    >
                      {review.adminReply ? 'Edit Reply' : 'Reply'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ReplyDialog
          open={openReplyDialog}
          handleClose={handleCloseReplyDialog}
          handleSubmit={handleSubmitReply}
          reviewId={selectedReviewId}
        />
      </Box>
      
      )}

{tabValue === 3 && (
       <Gallery/>
      
      )}

      {/* View More Dialog */}
      <Dialog
        open={viewMoreOpen}
        onClose={handleCloseViewMore}
        sx={{
          "& .MuiDialog-paper": {
            border: "2px solid purple",
            borderRadius: "12px",
            padding: 2,
            animation: `${fadeIn} 0.3s ease`,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "purple",
          }}
        >
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
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    border: "1px solid purple",
                    padding: "10px",
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
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    border: "1px solid purple",
                    padding: "10px",
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
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    border: "1px solid purple",
                    padding: "10px",
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
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    border: "1px solid purple",
                    padding: "10px",
                  },
                }}
              />
              
              <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle1">Current Image:</Typography>
              {selectedAccommodation.image && (
                <img 
                  src={selectedAccommodation.image} 
                  alt="Accommodation" 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px' }} 
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="dialog-image-upload"
              />
              <label htmlFor="dialog-image-upload">
                <Button
                  variant="contained"
                  component="span"
                  sx={{ backgroundColor: 'purple', color: 'white', marginRight: 2 }}
                >
                  Select New Image
                </Button>
              </label>
              {imageFile && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Selected: {imageFile.name}
                </Typography>
              )}
              <Button
                variant="contained"
                onClick={handleUploadImage}
                disabled={!imageFile}
                sx={{ marginTop: 2, backgroundColor: 'black', color: 'white' }}
              >
                Upload New Image
              </Button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Upload progress: {uploadProgress.toFixed(0)}%
                </Typography>
              )}
            </Box>
              <TextField
                label="Amenities (comma-separated)"
                value={selectedAccommodation.amenities?.join(", ")}
                name="amenities"
                onChange={handleChange}
                fullWidth
                sx={{
                  marginBottom: 2,
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    border: "1px solid purple",
                    padding: "10px",
                  },
                }}
              />
              <TextField
                label="Policies (comma-separated)"
                value={selectedAccommodation.policies?.join(", ")}
                name="policies"
                onChange={handleChange}
                fullWidth
                sx={{
                  marginBottom: 2,
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    border: "1px solid purple",
                    padding: "10px",
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <Box
          sx={{
            padding: "8px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            sx={{
              backgroundColor: "purple",
              "&:hover": { backgroundColor: "#6a0dad" },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            onClick={handleCloseViewMore}
            sx={{ borderColor: "purple", color: "purple" }}
          >
            Cancel
          </Button>
        </Box>
      </Dialog>

      {/* Snackbar for save confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </div>
  );
};

export default AdminPanel;
