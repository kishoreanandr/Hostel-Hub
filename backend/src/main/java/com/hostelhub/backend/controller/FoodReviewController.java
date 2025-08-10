package com.hostelhub.backend.controller;


import com.hostelhub.backend.dto.FoodReviewRequest;
import com.hostelhub.backend.model.FoodReview;
import com.hostelhub.backend.model.MealType;
import com.hostelhub.backend.model.User;
import com.hostelhub.backend.repository.FoodReviewRepository;
import com.hostelhub.backend.repository.UserRepository;
import com.hostelhub.backend.security.CustomUserDetailsService;
import com.hostelhub.backend.security.CustomerUserDetails;
import com.hostelhub.backend.service.FoodReviewServiceImplementation;
import com.hostelhub.backend.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class FoodReviewController {

    private final FoodService foodService;
    private final FoodReviewRepository foodReviewRepository;
    private final UserRepository userRepository;

    @Autowired
    public FoodReviewController(FoodService foodService, FoodReviewRepository foodReviewRepository, UserRepository userRepository) {
        this.foodService = foodService;
        this.foodReviewRepository = foodReviewRepository;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/submit",consumes = {"multipart/form-data"})
    public ResponseEntity<String> submitReview(@ModelAttribute FoodReviewRequest foodReviewRequest, @AuthenticationPrincipal CustomerUserDetails userDetails){
            if(userDetails==null || userDetails.getUser()==null){
                return ResponseEntity.status(401).body("Unauthorized");
            }
            foodService.saveReview(foodReviewRequest, userDetails.getUser());
            return ResponseEntity.ok("Review Saved Successfully!..");
    }

    @GetMapping
    public ResponseEntity<List<FoodReview>> getReviews
            (@RequestParam(required = false)MealType mealType,
             @RequestParam(required = false) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date){
            List<FoodReview> reviews=foodService.getReviews(mealType,date);
            return ResponseEntity.ok(reviews);
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/reviews/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Adjust based on your image type
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
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
