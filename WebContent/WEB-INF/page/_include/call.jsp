<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="../_css/call.css">
<script src="../_js/call.js"></script>

<!-- 1:1 상담 버튼 컴포넌트 -->
<div id="consultBtn" class="consult-button">
    <div class="consult-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
            <circle cx="7" cy="9" r="1" fill="white"/>
            <circle cx="12" cy="9" r="1" fill="white"/>
            <circle cx="17" cy="9" r="1" fill="white"/>
        </svg>
    </div>
    <span class="consult-text">문의하기</span>
</div>

<!-- 상담 모달 -->
<div id="consultModal" class="consult-modal">
    <div class="consult-modal-content">
        <div class="consult-modal-header">
            <h3>1:1 상담 문의</h3>
            <span class="consult-close-btn" id="closeModal">&times;</span>
        </div>
        <div class="consult-modal-body">
            <form id="consultForm" method="post" action="${path}/Mypage_servlet/inquiryAdd.do">
                <div class="consult-form-group">
                    <label for="consultType">문의 유형</label>
                    <select id="consultType" name="InquiryType" required>
                        <option value="">선택해주세요</option>
                        <option value="예약">예약 관련 문의</option>
                        <option value="음식점">음식점 정보 문의</option>
                        <option value="리뷰">리뷰 관련 문의</option>
                        <option value="점주">점주 서비스 문의</option>
                        <option value="결제">결제 관련 문의</option>
                        <option value="계정">계정/로그인 문의</option>
                        <option value="기술">기술적 오류 신고</option>
                        <option value="편의">불만/신고</option>
                        <option value="제휴">제휴 문의</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div class="consult-form-group">
                    <label for="consultContent">문의 내용</label>
                    <textarea id="consultContent" name="InquiryContent" rows="4" placeholder="문의하실 내용을 자세히 적어주세요." required></textarea>
                </div>
                <div class="consult-form-actions">
                    <button type="button" class="consult-btn-cancel" id="cancelBtn">취소</button>
                    <button type="submit" class="consult-btn-submit">문의하기</button>
                </div>
            </form>
        </div>
    </div>
</div>