import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function ReviewPage() {
  const [review, setReview] = useState({
    username: '',
    message: '',
    rating: '',
  });

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/reviews/add', review);
      alert('Review submitted successfully!');
      setReview({ username: '', message: '', rating: '' });
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={review.username} onChange={handleChange} placeholder="Name" />
      <textarea name="message" value={review.message} onChange={handleChange} placeholder="Write your review..." />
      <input name="rating" value={review.rating} onChange={handleChange} placeholder="Rating (1-5)" />
      <button type="submit">Submit Review</button>
    </form>
  );
}
