package com.hostelhub.backend.service;

import com.hostelhub.backend.dto.FoodReviewRequest;
import com.hostelhub.backend.model.FoodReview;
import com.hostelhub.backend.model.MealType;
import com.hostelhub.backend.model.User;
import com.hostelhub.backend.repository.FoodReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodReviewServiceImplementation implements FoodService{
    private final FoodReviewRepository foodReviewRepository;

    @Autowired
    public FoodReviewServiceImplementation(FoodReviewRepository foodReviewRepository) {
        this.foodReviewRepository = foodReviewRepository;
    }


    @Override
    public void saveReview(FoodReviewRequest request, User user) {
        FoodReview foodReview=new FoodReview();
        if(request.getImage()!=null && !request.getImage().isEmpty()){
            try{
                foodReview.setImage(request.getImage().getBytes());
            }catch (IOException e){
                 throw new RuntimeException("Failed to read image file"+e);
            }
        }
        foodReview.setMealType(request.getMealType());
        foodReview.setRating(request.getRating());
        foodReview.setComments(request.getComments());
        foodReview.setReviewDate(LocalDate.now());
        foodReview.setReviewDateTime(LocalDateTime.now());
        foodReview.setUser(user);
        foodReviewRepository.save(foodReview);

    }

    public List<FoodReview> getReviews(MealType mealType, LocalDate date){
        if(mealType!=null && date!=null) {
            return foodReviewRepository.findByMealTypeAndReviewDate(mealType, date);
        } else if (mealType!=null) {
            return foodReviewRepository.findByMealType(mealType);
        } else if (date!=null) {
            return foodReviewRepository.findByReviewDate(date);
        }else {
            return foodReviewRepository.findAll();
        }
    }

    @Override
    public void deleteRveiewById(Long id) {
        if(!foodReviewRepository.existsById(id)){
            throw new IllegalArgumentException("Review ID: "+id +" does not exist");
        }
        foodReviewRepository.deleteById(id);
    }
}
