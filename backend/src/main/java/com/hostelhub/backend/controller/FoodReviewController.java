package com.hostelhub.backend.controller;


import com.hostelhub.backend.dto.FoodReviewRequest;
import com.hostelhub.backend.model.FoodReview;
import com.hostelhub.backend.model.MealType;
import com.hostelhub.backend.model.User;
import com.hostelhub.backend.repository.FoodReviewRepository;
import com.hostelhub.backend.repository.UserRepository;
import com.hostelhub.backend.service.FoodReviewServiceImplementation;
import com.hostelhub.backend.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class FoodReviewController {

    private final FoodService foodService;

    private final UserRepository userRepository;

    @Autowired
    public FoodReviewController(FoodService foodService, UserRepository userRepository) {
        this.foodService = foodService;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/submit",consumes = {"multipart/form-data"})
    public ResponseEntity<String> submitReview(@ModelAttribute FoodReviewRequest foodReviewRequest, @AuthenticationPrincipal User user){

            foodService.saveReview(foodReviewRequest,user);
            return ResponseEntity.ok("Review Saved Successfully!..");
    }

    @GetMapping
    public ResponseEntity<List<FoodReview>> getReviews
            (@RequestParam(required = false)MealType mealType,
             @RequestParam(required = false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date){
            List<FoodReview> reviews=foodService.getReviews(mealType,date);
            return ResponseEntity.ok(reviews);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id){
        System.out.println("Id is: "+id);
        foodService.deleteRveiewById(id);
        System.out.println("Deleted Id: "+id);
        return ResponseEntity.ok("Review Deleted Successfully");
    }
}
