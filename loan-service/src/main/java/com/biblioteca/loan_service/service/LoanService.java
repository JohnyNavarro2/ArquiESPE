package com.biblioteca.loan_service.service;

import com.biblioteca.loan_service.dto.LoanDTO;
import com.biblioteca.loan_service.entity.Loan;
import com.biblioteca.loan_service.repository.LoanRepository;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private BookClient bookClient;

    @FeignClient(name = "book-service", url = "http://localhost:8080/api/books")
    public interface BookClient {

        @PutMapping("/{bookId}/update-quantity")
        void updateAvailableQuantity(@PathVariable("bookId") Long bookId, @RequestParam("change") int change);
    }

    public LoanDTO registerLoan(LoanDTO loanDTO) {
        Loan loan = Loan.builder()
                .bookId(loanDTO.getBookId())
                .userId(loanDTO.getUserId())
                .loanDate(LocalDate.now())
                .dueDate(loanDTO.getDueDate())
                .status("ACTIVE")
                .build();
        Loan savedLoan = loanRepository.save(loan);
        return convertToDTO(savedLoan);
    }

    public LoanDTO renewLoan(Long loanId, LocalDate newDueDate) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Préstamo no encontrado con ID: " + loanId));
        loan.setDueDate(newDueDate);
        Loan updatedLoan = loanRepository.save(loan);
        return convertToDTO(updatedLoan);
    }

    public List<LoanDTO> getAllLoans() {
        return loanRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LoanDTO> getActiveLoans() {
        return loanRepository.findByStatus("ACTIVE").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LoanDTO> getLoanHistoryByUser(Long userId) {
        return loanRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LoanDTO> getLoanHistoryByBook(Long bookId) {
        return loanRepository.findByBookId(bookId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LoanDTO convertToDTO(Loan loan) {
        return LoanDTO.builder()
                .id(loan.getId())
                .bookId(loan.getBookId())
                .userId(loan.getUserId())
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .status(loan.getStatus())
                .build();
    }

    public LoanDTO reserveBook(LoanDTO loanDTO) {
        bookClient.updateAvailableQuantity(loanDTO.getBookId(), -1);

        Loan loan = Loan.builder()
                .bookId(loanDTO.getBookId())
                .userId(loanDTO.getUserId())
                .loanDate(LocalDate.now())
                .dueDate(loanDTO.getDueDate())
                .status("RESERVED")
                .build();
        Loan savedLoan = loanRepository.save(loan);

        return convertToDTO(savedLoan);
    }

    public LoanDTO returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Préstamo no encontrado con ID: " + loanId));

        if (!"RESERVED".equals(loan.getStatus()) && !"ACTIVE".equals(loan.getStatus())) {
            throw new IllegalArgumentException("Solo se pueden devolver préstamos activos o reservados.");
        }

        loan.setStatus("RETURNED");
        Loan updatedLoan = loanRepository.save(loan);

        bookClient.updateAvailableQuantity(loan.getBookId(), 1);

        loanRepository.delete(loan);

        return convertToDTO(updatedLoan);
    }
}
