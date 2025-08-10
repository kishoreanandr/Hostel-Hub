package com.hostelhub.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class ReviewEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReviewConfirmationMail(String userEmail,String userName) throws MessagingException {
        MimeMessage message=mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(message,true);

        helper.setTo(userEmail);
        helper.setSubject("Thanks for your review");

        String htmlContent="<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #4CAF50;'>Hello " + userName + "!</h2>"
                + "<p>Thank you for submitting your review on <b>HostelHub</b>.</p>"
                + "<p>We value your feedback and will consider it for future improvements.</p>"
                + "<br/>"
                + "<p style='font-size: 14px; color: gray;'>This is an automated message from HostelHub.</p>"
                + "</div>";
        helper.setText(htmlContent,true);
        mailSender.send(message);
    }
}
