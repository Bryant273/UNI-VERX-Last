package com.univerx.service;

import com.univerx.model.Grade;
import com.univerx.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GradeService {
    @Autowired
    private GradeRepository gradeRepository;

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    public Grade saveGrade(Grade grade) {
        return gradeRepository.save(grade);
    }

    public List<Grade> getStudentGrades(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }
    
    public Double calculateGPA(Long studentId) {
        List<Grade> grades = getStudentGrades(studentId);
        if (grades.isEmpty()) return 0.0;
        
        double totalWeightedScore = 0.0;
        double totalCoefficients = 0.0;
        
        for (Grade grade : grades) {
            totalWeightedScore += grade.getScore() * grade.getCoefficient();
            totalCoefficients += grade.getCoefficient();
        }
        
        return totalWeightedScore / totalCoefficients;
    }

    public Integer calculateAcquiredCredits(Long studentId) {
        List<Grade> grades = getStudentGrades(studentId);
        return grades.stream()
                .filter(g -> g.getScore() >= 10.0)
                .mapToInt(g -> g.getCourse().getCredits())
                .sum();
    }
}
