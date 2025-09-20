<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 리뷰 내역</title>
    <link rel="stylesheet" href="../_css/my_reviewList.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/my_reviewList.js"></script>
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
                        <!-- 내 리뷰 내역 컨텐츠 -->
                        <div class="reviews-container tab-content active" id="reviewsContent">
                            <h3 class="form-title">내 리뷰 내역</h3>

                            <!-- 필터링 옵션 -->
                            <div class="reviews-filters">
                                <select class="filter-select" id="sortFilter">
                                    <option value="recent">최근 작성순</option>
                                    <option value="rating-high">별점 높은순</option>
                                    <option value="rating-low">별점 낮은순</option>
                                </select>
                                <select class="filter-select" id="categoryFilter">
                                    <option value="all">전체 카테고리</option>
                                    <option value="korean">한식</option>
                                    <option value="japanese">일식</option>
                                    <option value="chinese">중식</option>
                                    <option value="western">양식</option>
                                    <option value="cafe">카페/디저트</option>
                                </select>
                                <div class="search-container">
                                    <input type="text" class="search-input" placeholder="맛집 또는 리뷰 내용 검색...">
                                    <button class="search-btn"><i class="fas fa-search"></i></button>
                                </div>
                            </div>

                            <!-- 리뷰 카운트 -->
                            <div class="reviews-count">
                                총 <span class="count-number">${fn:length(listReview)}</span>개의 리뷰를 작성하셨습니다.
                            </div>
                            <c:if test="${fn:length(listReview) == 0}">
		                    	<p>매장 목록이 없습니다.</p>
		                    </c:if>
		                    
                            <!-- 리뷰 목록 -->
                            <div class="review-cards">
			                    <c:forEach var="listReview" items="${listReview}">
	                                <div class="review-card" data-category="korean" data-rating="4">
	                                    <div class="review-header">
	                                        <div class="restaurant-info">
	                                            <div class="restaurant-image-container">
	                                                <img src="${path}/attach/${listReview.store.storeImage}" class="restaurant-image">
	                                            </div>
	                                            <div class="restaurant-details">
	                                                <h4 class="restaurant-title">${listReview.store.storeName}</h4>
	                                                <span class="restaurant-category">${listReview.store.storeCategory}</span>
	                                                <span class="restaurant-location"><i class="fas fa-map-marker-alt"></i>${listReview.store.storeAddr} ${listReview.store.storeStreetAddr}</span>
	                                            </div>
	                                        </div>
	                                        <div class="review-meta">
	                                            <div class="review-rating">
	                                                <i class="fas fa-star"></i>
	                                                <i class="fas fa-star"></i>
	                                                <i class="fas fa-star"></i>
	                                                <i class="fas fa-star"></i>
	                                                <i class="far fa-star"></i>
	                                                <span>${listReview.reviewEstimation}</span>
	                                            </div>
	                                            <div class="review-date">${listReview.reviewRegidate}</div>
	                                        </div>
	                                    </div>
	                                    <div class="review-content">
	                                        <div class="review-text">
	                                            ${listReview.reviewContent}
	                                        </div>
	                                        <div class="review-images">
	                                            <img src="${path}/attach/${listReview.reviewImage}" class="review-image">
	                                        </div>
	                                    </div>
	                                    <div class="review-actions">
	                                        <button class="action-btn btn-edit" onclick="location.href='${path}/Admin_servlet/reviewEdit.do?ReviewNo=${listReview.reviewNo}'"><i class="fas fa-edit"></i> 수정</button>
	                                        <button
											  class="action-btn btn-delete"
											  type="button"
											  data-url="${path}/Admin_servlet/reviewRemove.do?ReviewNo=${listReview.reviewNo}&StoreNo=${listReview.store.storeNo}&MemberNo=${sessionScope.MemberNo}">
											  <i class="fas fa-trash"></i> 삭제
											</button>
	                                        <button class="action-btn btn-view" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listReview.store.storeNo}'"><i class="fas fa-eye"></i> 맛집 보기</button>
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