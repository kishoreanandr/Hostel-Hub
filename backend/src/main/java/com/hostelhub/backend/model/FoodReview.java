package com.hostelhub.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FoodReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private MealType mealType;
    private int rating;
    private String comments;

    @Column(name="review_date")
    private LocalDate reviewDate;

    @Column(name = "review_date_time")
    private LocalDateTime reviewDateTime;

    @Column(name = "image",columnDefinition = "LONGBLOB")
    private byte[] image;

    @ManyToOne
    private User user;
}
