<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>문의 수정 - HonestPick</title>
    <link rel="stylesheet" href="../_css/inquiryEdit.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- <script src="../_js/inquiryEdit.js" defer></script> -->
</head>
<body>
    <%@ include file="../_include/header.jsp" %>
    
    <main class="review-edit-main">
        <div class="container">
            <!-- 상단 헤더 -->
            <div class="page-header">
                <div class="breadcrumb">
                    <a href="${path}/Mypage_servlet/inquiryList.do?MemberNo=${dtoInquiry.memberNo}">
                        <i class="fas fa-arrow-left"></i>
                        문의 목록으로 돌아가기
                    </a>
                </div>
                <h1 class="page-title">문의 수정</h1>
                <p class="page-description">작성하신 문의를 수정하거나 삭제할 수 있습니다.</p>
            </div>

            <!-- 메인 컨텐츠 -->
            <div class="content-grid">
                <!-- 문의 수정 폼 -->
                <div class="review-form-section">
                    <div class="form-card">
                        <div class="form-header">
                            <h2 class="form-title">
                                <i class="fas fa-edit"></i>
                                문의 수정하기
                            </h2>
                            <div class="form-actions">
                                <button type="button" class="action-btn delete-btn" onclick="confirmDelete()">
                                    <i class="fas fa-trash-alt"></i>
                                    삭제하기
                                </button>
                            </div>
                        </div>

                        <form class="review-form" method="post" action="${path}/Admin_servlet/inquiryEditProc.do">
                            <!-- Hidden 필드들 -->
                            <input type="hidden" name="InquiryNo" value="${dtoInquiry.inquiryNo}">
                            <input type="hidden" name="MemberNo" value="${dtoInquiry.memberNo}">
                            
                            <div class="form-group">
			                    <label><i class="fas fa-heading"></i> 문의 유형</label>
                            </div>
                            <div class="consult-form-group">
			                    <select id="consultType" name="InquiryType" required>
			                        <option value="">선택해주세요</option>
			                        <option value="예약" <c:if test="${dtoInquiry.inquiryType == '예약'}">selected</c:if>>예약 관련 문의</option>
			                        <option value="음식점" <c:if test="${dtoInquiry.inquiryType == '음식점'}">selected</c:if>>음식점 정보 문의</option>
			                        <option value="리뷰" <c:if test="${dtoInquiry.inquiryType == '리뷰'}">selected</c:if>>리뷰 관련 문의</option>
			                        <option value="점주" <c:if test="${dtoInquiry.inquiryType == '점주'}">selected</c:if>>점주 서비스 문의</option>
			                        <option value="결제" <c:if test="${dtoInquiry.inquiryType == '결제'}">selected</c:if>>결제 관련 문의</option>
			                        <option value="계정" <c:if test="${dtoInquiry.inquiryType == '계정'}">selected</c:if>>계정/로그인 문의</option>
			                        <option value="기술" <c:if test="${dtoInquiry.inquiryType == '기술'}">selected</c:if>>기술적 오류 신고</option>
			                        <option value="편의" <c:if test="${dtoInquiry.inquiryType == '편의'}">selected</c:if>>불만/신고</option>
			                        <option value="제휴" <c:if test="${dtoInquiry.inquiryType == '제휴'}">selected</c:if>>제휴 문의</option>
			                        <option value="기타" <c:if test="${dtoInquiry.inquiryType == '기타'}">selected</c:if>>기타</option>
			                    </select>
			                </div>
                            
                            <!-- 문의 내용 -->
                            <div class="form-group">
                                <label><i class="fas fa-comment"></i> 문의 내용</label>
                                <textarea class="form-textarea review-content" 
                                          name="InquiryContent" 
                                          rows="6" 
                                          placeholder="문의하실 내용을 자세히 적어주세요."
                                          maxlength="200"
                                          required>${dtoInquiry.inquiryContent}</textarea>
                                <div class="content-counter">
                                    <span id="consultContent" class="current-content-length">${fn:length(dtoInquiry.inquiryContent)}</span>/<span class="max-content-length">500</span>자
                                </div>
                            </div>
                            
                            <!-- 수정 완료 버튼 -->
                            <div class="form-actions-bottom">
                                <button type="button" class="cancel-btn" onclick="history.back()">
                                    <i class="fas fa-times"></i>
                                    취소
                                </button>
                                <button type="submit" class="submit-btn">
                                    <i class="fas fa-check"></i>
                                    문의 수정 완료
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- 사이드바 - 도움말 -->
                <div class="sidebar">
                    <div class="help-card">
                        <h3 class="help-title">
                            <i class="fas fa-question-circle"></i>
                            문의 수정 도움말
                        </h3>
                        <div class="help-content">
                            <div class="help-item">
                                <i class="fas fa-star"></i>
                                <div>
                                    <strong>별점 변경</strong>
                                    <p>별을 클릭하여 평점을 다시 매길 수 있습니다.</p>
                                </div>
                            </div>
                            <div class="help-item">
                                <i class="fas fa-camera"></i>
                                <div>
                                    <strong>사진 변경</strong>
                                    <p>새 사진을 업로드하면 기존 사진이 대체됩니다.</p>
                                </div>
                            </div>
                            <div class="help-item">
                                <i class="fas fa-trash-alt"></i>
                                <div>
                                    <strong>문의 삭제</strong>
                                    <p>삭제된 문의는 복구할 수 없으니 신중히 결정해주세요.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 문의 작성 가이드 -->
                    <div class="guide-card">
                        <h3 class="guide-title">
                            <i class="fas fa-lightbulb"></i>
                            좋은 문의 작성 팁
                        </h3>
                        <div class="guide-content">
                            <ul>
                                <li>구체적인 메뉴명과 맛에 대해 작성해주세요</li>
                                <li>서비스와 분위기도 함께 언급해주세요</li>
                                <li>다른 고객들에게 도움이 되는 정보를 포함해주세요</li>
                                <li>사진이 있으면 더욱 신뢰성 있는 문의가 됩니다</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- 삭제 확인 모달 -->
    <div class="modal-overlay" id="delete-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>문의 삭제 확인</h3>
                <button class="modal-close" onclick="closeDeleteModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="warning-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>정말로 이 문의를 삭제하시겠습니까?</p>
                <p class="warning-text">삭제된 문의는 복구할 수 없습니다.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="modal-cancel-btn" onclick="closeDeleteModal()">
                    취소
                </button>
                <button type="button" class="modal-delete-btn" onclick="deleteReview()">
                    삭제하기
                </button>
            </div>
        </div>
    </div>

    <%@ include file="../_include/footer.jsp" %>
</body>
</html>