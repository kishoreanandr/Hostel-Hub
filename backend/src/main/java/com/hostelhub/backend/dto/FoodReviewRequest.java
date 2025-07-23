package com.hostelhub.backend.dto;

import com.hostelhub.backend.model.MealType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodReviewRequest {
    private MealType mealType;
    private int rating;
    private String comments;
    private MultipartFile image;
}
