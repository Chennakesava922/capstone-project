import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../stylings/Reviews.module.css';

const Reviews = () => {
  const reviews = [
    {
      text: "Excellent service and quick claim settlement. The team was very professional and helpful throughout the process!",
      author: "John Doe",
      rating: 5
    },
    {
      text: "Best insurance provider I've dealt with. Their rates are competitive and service is outstanding.",
      author: "Sarah Smith",
      rating: 5
    },
    {
      text: "Very satisfied with their quick response and hassle-free policy renewal process.",
      author: "Michael Brown",
      rating: 4
    },
    {
      text: "Great coverage options and friendly staff. Highly recommend their services!",
      author: "Emily Johnson",
      rating: 4
    },
    {
      text: "The claim process was smooth and their support team was very helpful. The team was quick to respond and resolved my issue in no time.",
      author: "David Wilson",
      rating: 5
    },
    {
      text: "Affordable premiums and excellent coverage. Couldn't ask for better service!",
      author: "Lisa Anderson",
      rating: 5
    },
    {
      text: "Professional and efficient service. They made insurance easy to understand. It’s exactly what I was looking for, and the quality is outstanding.",
      author: "Robert Taylor",
      rating: 4
    },
    {
      text: "Outstanding customer service and great value for money. Definitely recommended!",
      author: "Jennifer Martinez",
      rating: 5
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className={styles.reviews}>
      <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
      <div className={styles.reviewCarousel}>
        <button className={styles.carouselButton} onClick={prevReview}>
          <ChevronLeft size={24} />
        </button>
        <div className={styles.reviewCard}>
          <div className={styles.stars}>
            {[...Array(reviews[currentReview].rating)].map((_, i) => (
              <Star key={i} className={styles.starIcon} size={20} />
            ))}
          </div>
          <p className={styles.reviewText}>&apos;&apos;{reviews[currentReview].text}&apos;&apos;</p>
          <h4 className={styles.reviewAuthor}>- {reviews[currentReview].author}</h4>
        </div>
        <button className={styles.carouselButton} onClick={nextReview}>
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

export default Reviews;
