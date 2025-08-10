package com.hostelhub.backend.service;

import com.hostelhub.backend.dto.FoodReviewRequest;
import com.hostelhub.backend.model.FoodReview;
import com.hostelhub.backend.model.MealType;
import com.hostelhub.backend.model.User;
import com.hostelhub.backend.repository.FoodReviewRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodReviewServiceImplementation implements FoodService{
    private final FoodReviewRepository foodReviewRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    private ReviewEmailService reviewEmailService;

    @Autowired
    public FoodReviewServiceImplementation(FoodReviewRepository foodReviewRepository, FileStorageService fileStorageService) {
        this.foodReviewRepository = foodReviewRepository;
        this.fileStorageService = fileStorageService;
    }


    @Override
    public void saveReview(FoodReviewRequest request, User user) {
        FoodReview foodReview = new FoodReview();
        
        if(request.getImage() != null && !request.getImage().isEmpty()){
            try{
                String filename = fileStorageService.storeFile(request.getImage());
                foodReview.setImagePath(filename);
            }catch (IOException e){
                throw new RuntimeException("Failed to store image file: " + e.getMessage());
            }
        }
        
        foodReview.setMealType(request.getMealType());
        foodReview.setRating(request.getRating());
        foodReview.setComments(request.getComments());
        foodReview.setReviewDate(LocalDate.now());
        foodReview.setReviewDateTime(LocalDateTime.now());
        foodReview.setUser(user);
        
        System.out.println("User name: "+user.getName()+"User Email: "+user.getEmail());
        foodReviewRepository.save(foodReview);
        
        try {
            reviewEmailService.sendReviewConfirmationMail(user.getEmail(), user.getName());
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
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
        
        // Get the review to delete associated file
        FoodReview review = foodReviewRepository.findById(id).orElse(null);
        if (review != null && review.getImagePath() != null) {
            fileStorageService.deleteFile(review.getImagePath());
        }
        
        foodReviewRepository.deleteById(id);
    }
}
