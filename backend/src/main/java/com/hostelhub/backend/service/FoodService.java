package com.hostelhub.backend.service;

import com.hostelhub.backend.dto.FoodReviewRequest;
import com.hostelhub.backend.model.FoodReview;
import com.hostelhub.backend.model.MealType;
import com.hostelhub.backend.model.User;

import java.time.LocalDate;
import java.util.List;

public interface FoodService {
    void saveReview(FoodReviewRequest request, User user);

    List<FoodReview> getReviews(MealType mealType, LocalDate date);

    void deleteRveiewById(Long id);
}
