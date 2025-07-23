package com.hostelhub.backend.repository;

import com.hostelhub.backend.model.FoodReview;
import com.hostelhub.backend.model.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodReviewRepository extends JpaRepository<FoodReview,Long> {
    List<FoodReview> findByMealType(MealType mealType);
    List<FoodReview> findByReviewDate(LocalDate localDate);
    List<FoodReview> findByMealTypeAndReviewDate(MealType mealType,LocalDate localDate);
}
