<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>나의 방문기록</title>
    <link rel="stylesheet" href="../_css/my_visitList.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/my_visitList.js"></script>
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
                    <!-- 나의 방문기록 컨텐츠 -->
                    <div class="visits-container tab-content active" id="visitsContent">
                        <h3 class="form-title">나의 방문기록</h3>
                        
                        <!-- 방문기록 탭 -->
                        <div class="visits-tabs">
                            <div class="visits-tab active" data-status="all">전체</div>
                            <div class="visits-tab" data-status="reviewed">리뷰작성완료</div>
                            <div class="visits-tab" data-status="not-reviewed">리뷰미작성</div>
                        </div>
                        
                        <!-- 필터링 옵션 -->
                        <div class="visit-filters">
                            <select class="filter-select" id="sortFilter">
                                <option value="recent">최신순</option>
                                <option value="old">오래된순</option>
                                <option value="name">가게명순</option>
                            </select>
                            <select class="filter-select" id="categoryFilter">
                                <option value="all">전체 카테고리</option>
                                <option value="korean">한식</option>
                                <option value="japanese">일식</option>
                                <option value="chinese">중식</option>
                                <option value="western">양식</option>
                                <option value="cafe">카페/디저트</option>
                            </select>
                            <select class="filter-select" id="periodFilter">
                                <option value="all">전체 기간</option>
                                <option value="1month">1개월</option>
                                <option value="3months">3개월</option>
                                <option value="6months">6개월</option>
                                <option value="1year">1년</option>
                            </select>
                        </div>
                        
                        <!-- 방문기록 카드 목록 -->
                        <div class="visit-cards">
                        	<c:if test="${fn:length(listVisit) == 0}">
                            	<p>매장 방문 내역이 없습니다.</p>
                            </c:if>
                            <c:forEach var="listVisit" items="${listVisit}">
	                            <div class="visit-card" data-status="not-reviewed" data-category="korean">
	                                <img src="${path}/attach/${listVisit.storeImageName}" class="visit-image" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listVisit.storeNo}'">
	                                <div class="visit-content">
	                                    <h4 class="visit-title">${listVisit.storeName}</h4>
	                                    <div class="visit-details">
	                                    	<div class="detail-item">
	                                            <span class="detail-label">예약번호</span>
	                                            <span>${listVisit.resNo}</span>
	                                        </div>
	                                        <div class="detail-item">
	                                            <span class="detail-label">방문일시</span>
	                                            <span>
	                                            	<fmt:formatDate value="${listVisit.reservationDateTime}" pattern="yyyy년 MM월 dd일 HH:mm"/>
	                                            </span>
	                                        </div>
	                                        <div class="detail-item">
	                                            <span class="detail-label">인원</span>
	                                            <span>${listVisit.resPeople}명</span>
	                                        </div>
	                                    </div>
	                                    <c:choose>
	                                    	<c:when test="${listVisit.reviewNo == 0}">
			                                    <div class="visit-actions">
			                                        <button class="action-btn btn-review" onclick="location.href='${path}/Admin_servlet/reviewAdd.do?StoreNo=${listVisit.storeNo}&ResNo=${listVisit.resNo}'">
			                                            <i class="fas fa-pencil-alt"></i> 리뷰 작성
			                                        </button>
			                                    </div>
			                                </c:when>
			                                <c:otherwise>
			                                	<div class="visit-actions">
			                                        <div class="review-completed">
			                                            <i class="fas fa-check-circle"></i> 리뷰 작성 완료
			                                        </div>
			                                    </div>
			                                </c:otherwise>
	                                    </c:choose>
	                                </div>
	                            </div>
	                        </c:forEach>
                        </div>
                        <!-- 
                        페이지네이션
                        <div class="pagination">
                            <div class="page-item active">1</div>
                            <div class="page-item">2</div>
                            <div class="page-item">3</div>
                            <div class="page-item"><i class="fas fa-angle-right"></i></div>
                        </div>
                         -->
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>