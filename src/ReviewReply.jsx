import React, { useState } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const ReplyDialog = ({ open, handleClose, handleSubmit, reviewId }) => {
  const [replyText, setReplyText] = useState('');

  const onSubmit = () => {
    handleSubmit(reviewId, replyText);
    setReplyText('');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reply to Review</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reply"
          label="Your Reply"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};