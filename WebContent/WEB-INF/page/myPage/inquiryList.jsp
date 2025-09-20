<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 문의 내역</title>
    <link rel="stylesheet" href="../_css/my_inquiryList.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/my_inquiryList.js"></script>
</head>
<body>
    <!-- Header 영역 -->
	<%@ include file="../_include/header.jsp" %>

    <!-- 마이페이지 섹션 -->
    <section class="mypage-section">
        <div class="container">
            <div class="mypage-content">
                <!-- 사이드바 include -->
                <%@ include file="../_include/myPage_sidebar.jsp" %>

                <!-- 메인 컨텐츠 -->
                <div class="main-content">
                    <div class="form-container">
                        <!-- 내 문의 내역 컨텐츠 -->
                        <div class="reviews-container tab-content active" id="reviewsContent">
                            <h3 class="form-title">내 문의 내역</h3>

                            <!-- 문의 카운트 -->
                            <div class="reviews-count">
                                총 <span class="count-number">${fn:length(listInquiry)}</span>개의 문의를 작성하셨습니다.
                            </div>
                            <c:if test="${fn:length(listInquiry) == 0}">
		                    	<p>문의 목록이 없습니다.</p>
		                    </c:if>
		                    
                            <!-- 문의 목록 -->
                            <div class="review-cards">
			                    <c:forEach var="listInquiry" items="${listInquiry}">
	                                <div class="review-card" data-category="korean" data-rating="4">
	                                    <div class="review-header">
	                                        <div class="restaurant-info">
	                                            <div class="restaurant-details">
	                                                <h4 class="restaurant-title">${listInquiry.inquiryType}</h4>
	                                            </div>
	                                        </div>
	                                        <div class="review-meta">
	                                            <div class="review-date">${listInquiry.inquiryRegidate}</div>
	                                        </div>
	                                    </div>
	                                    <div class="review-content">
	                                        <div class="review-text">${listInquiry.inquiryContent}</div>
	                                    </div>
	                                    <div class="review-actions">
	                                        <button class="action-btn btn-edit" onclick="location.href='${path}/Admin_servlet/inquiryEdit.do?InquiryNo=${listInquiry.inquiryNo}&MemberNo=${listInquiry.memberNo}'"><i class="fas fa-edit"></i> 수정</button>
	                                        <button
											  class="action-btn btn-delete"
											  type="button"
											  data-url="${path}/Admin_servlet/inquiryRemove.do?InquiryNo=${listInquiry.inquiryNo}&MemberNo=${listInquiry.memberNo}">
											  <i class="fas fa-trash"></i> 삭제
											</button>
	                                    </div>
	                                </div>
	                            </c:forEach>
                            </div>
							<!-- 
                            페이지네이션
                            <div class="pagination">
                                <div class="page-item active">1</div>
                                <div class="page-item">2</div>
                                <div class="page-item"><i class="fas fa-angle-right"></i></div>
                            </div>
                             -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>