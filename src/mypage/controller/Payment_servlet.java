package mypage.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import mypage.dto.MemberShipDTO;

/**
 * 결제 처리 서블릿
 * 토스페이먼츠 API를 사용한 결제 승인 및 검증 처리
 */
@WebServlet(urlPatterns = {"/payment/success", "/payment/fail", "/payment/verify"})
public class Payment_servlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    // 토스페이먼츠 시크릿 키 (실제 운영 시에는 환경변수나 설정파일에서 관리)
    private static final String TOSS_PAYMENTS_SECRET_KEY = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R"; // 테스트용
    private static final String TOSS_API_URL = "https://api.tosspayments.com/v1/payments/confirm";
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        if (requestURI.contains("/payment/success")) {
            handlePaymentSuccess(request, response);
        } else if (requestURI.contains("/payment/fail")) {
            handlePaymentFail(request, response);
        } else if (requestURI.contains("/payment/verify")) {
            handlePaymentVerify(request, response);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
    
    /**
     * 결제 성공 처리
     */
    private void handlePaymentSuccess(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // 토스페이먼츠에서 전달된 파라미터 받기
            String paymentKey = request.getParameter("paymentKey");
            String orderId = request.getParameter("orderId");
            String amount = request.getParameter("amount");
            
            // 프론트엔드에서 전달된 추가 정보 받기
            String memberNo = request.getParameter("memberNo");
            String storeNo = request.getParameter("storeNo");
            String state = request.getParameter("state");
            String membershipPlan = request.getParameter("membershipPlan");
            String paymentMethod = request.getParameter("paymentMethod");
            String selectedPrice = request.getParameter("selectedPrice");
            String selectedMonths = request.getParameter("selectedMonths");
            
            // 필수 파라미터 검증
            if (paymentKey == null || orderId == null || amount == null) {
                throw new IllegalArgumentException("필수 결제 정보가 누락되었습니다.");
            }
            
            // 토스페이먼츠 결제 승인 요청
            PaymentConfirmResult confirmResult = confirmPayment(paymentKey, orderId, amount);
            
            if (confirmResult.isSuccess()) {
                // 결제 성공 시 처리
                System.out.println("결제 승인 성공: " + confirmResult.getPaymentData());
                
                // 세션에 결제 정보 저장
                HttpSession session = request.getSession();
                session.setAttribute("paymentResult", confirmResult.getPaymentData());
                session.setAttribute("membershipPlan", membershipPlan);
                session.setAttribute("paymentMethod", paymentMethod);
                session.setAttribute("selectedPrice", selectedPrice);
                session.setAttribute("selectedMonths", selectedMonths);
                
                // 멤버십 추가 페이지로 리디렉션
                MemberShipDTO dtoAg = new MemberShipDTO();
                dtoAg.setStoreNo(Integer.parseInt(storeNo));
                dtoAg.setState(state);
                dtoAg.setPaymentKey(URLEncoder.encode(paymentKey, "UTF-8"));
                dtoAg.setOrderId(URLEncoder.encode(orderId, "UTF-8"));
                dtoAg.setMemberShipPlan(URLEncoder.encode(membershipPlan, "UTF-8"));
                dtoAg.setPaymentMethod(URLEncoder.encode(paymentMethod, "UTF-8"));
                dtoAg.setSelectedPrice(Integer.parseInt(selectedPrice));
                dtoAg.setSelectedMonths(Integer.parseInt(selectedMonths));
                
                session.setAttribute("dtoAg", dtoAg);
        		
                response.sendRedirect(request.getContextPath() + "/Mypage_servlet/memberShipAdd.do");
                
            } else {
                // 결제 승인 실패
                throw new RuntimeException("결제 승인 실패: " + confirmResult.getErrorMessage());
            }
            
        } catch (Exception e) {
            System.err.println("결제 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            
            // 오류 페이지로 리디렉션
            String errorUrl = request.getContextPath() + 
                "/payment/fail?error=" + URLEncoder.encode(e.getMessage(), "UTF-8");
            response.sendRedirect(errorUrl);
        }
    }
    
    /**
     * 결제 실패 처리
     */
    private void handlePaymentFail(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String errorCode = request.getParameter("code");
        String errorMessage = request.getParameter("message");
        String customError = request.getParameter("error");
        
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        out.println("<!DOCTYPE html>");
        out.println("<html lang='ko'>");
        out.println("<head>");
        out.println("<meta charset='UTF-8'>");
        out.println("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        out.println("<title>결제 실패</title>");
        out.println("<style>");
        out.println("body { font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }");
        out.println(".container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }");
        out.println(".error-icon { font-size: 4rem; color: #e74c3c; margin-bottom: 20px; }");
        out.println(".error-title { font-size: 1.5rem; color: #333; margin-bottom: 10px; }");
        out.println(".error-message { color: #666; margin-bottom: 30px; }");
        out.println(".btn { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }");
        out.println(".btn:hover { background: #2980b9; }");
        out.println("</style>");
        out.println("</head>");
        out.println("<body>");
        out.println("<div class='container'>");
        out.println("<div class='error-icon'>❌</div>");
        out.println("<h1 class='error-title'>결제가 실패했습니다</h1>");
        
        if (customError != null) {
            out.println("<p class='error-message'>" + customError + "</p>");
        } else if (errorMessage != null) {
            out.println("<p class='error-message'>" + errorMessage + "</p>");
        } else {
            out.println("<p class='error-message'>결제 처리 중 오류가 발생했습니다.</p>");
        }
        
        out.println("<a href='javascript:history.back()' class='btn'>다시 시도</a>");
        out.println("<a href='" + request.getContextPath() + "/mypage/membership' class='btn'>멤버십 페이지로</a>");
        out.println("</div>");
        out.println("</body>");
        out.println("</html>");
    }
    
    /**
     * 결제 검증 (AJAX 요청용)
     */
    private void handlePaymentVerify(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json; charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            String paymentKey = request.getParameter("paymentKey");
            String orderId = request.getParameter("orderId");
            String amount = request.getParameter("amount");
            
            PaymentConfirmResult result = confirmPayment(paymentKey, orderId, amount);
            
            Gson gson = new Gson();
            Map<String, Object> responseData = new HashMap<>();
            
            if (result.isSuccess()) {
                responseData.put("success", true);
                responseData.put("data", result.getPaymentData());
            } else {
                responseData.put("success", false);
                responseData.put("error", result.getErrorMessage());
            }
            
            out.print(gson.toJson(responseData));
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            
            Gson gson = new Gson();
            out.print(gson.toJson(errorResponse));
        }
    }
    
    /**
     * 토스페이먼츠 결제 승인 요청
     */
    private PaymentConfirmResult confirmPayment(String paymentKey, String orderId, String amount) {
        try {
            // 요청 데이터 생성
            Map<String, String> requestData = new HashMap<>();
            requestData.put("paymentKey", paymentKey);
            requestData.put("orderId", orderId);
            requestData.put("amount", amount);
            
            Gson gson = new Gson();
            String jsonData = gson.toJson(requestData);
            
            // HTTP 클라이언트 생성
            HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
            
            // 인증 헤더 생성 (Base64 인코딩)
            String auth = TOSS_PAYMENTS_SECRET_KEY + ":";
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            
            // HTTP 요청 생성
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(TOSS_API_URL))
                .header("Authorization", "Basic " + encodedAuth)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonData))
                .timeout(Duration.ofSeconds(30))
                .build();
            
            // 요청 전송
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            // 응답 처리
            if (response.statusCode() == 200) {
                JsonObject jsonResponse = JsonParser.parseString(response.body()).getAsJsonObject();
                return new PaymentConfirmResult(true, jsonResponse.toString(), null);
            } else {
                JsonObject errorResponse = JsonParser.parseString(response.body()).getAsJsonObject();
                String errorMessage = errorResponse.has("message") ? 
                    errorResponse.get("message").getAsString() : "결제 승인 실패";
                return new PaymentConfirmResult(false, null, errorMessage);
            }
            
        } catch (Exception e) {
            System.err.println("결제 승인 요청 중 오류: " + e.getMessage());
            e.printStackTrace();
            return new PaymentConfirmResult(false, null, "결제 승인 요청 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 결제 승인 결과를 담는 내부 클래스
     */
    private static class PaymentConfirmResult {
        private final boolean success;
        private final String paymentData;
        private final String errorMessage;
        
        public PaymentConfirmResult(boolean success, String paymentData, String errorMessage) {
            this.success = success;
            this.paymentData = paymentData;
            this.errorMessage = errorMessage;
        }
        
        public boolean isSuccess() {
            return success;
        }
        
        public String getPaymentData() {
            return paymentData;
        }
        
        public String getErrorMessage() {
            return errorMessage;
        }
    }
}