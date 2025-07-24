<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 신뢰도 높은 리뷰 플랫폼</title>
    <link rel="stylesheet" href="../_css/home.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="../_js/home.js" defer></script>
</head>
<body>
	<!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main>
        <!-- 메인 배너 영역 -->
        <section class="hero-section">
            <div class="container">
                <div class="hero-content">
                    <h1>당신의 선택이 더 믿음직해지도록</h1>
                    <p>HonestPick에서는 방문 인증을 거친 진짜 리뷰만 모았습니다.</p>
                    <div class="hero-search">
					    <input type="text" placeholder="음식점 이름으로 검색하세요" class="search-input-large">
					    <button class="btn btn-primary">검색</button>
					</div>
                </div>
            </div>
        </section>

        <!-- 추천 맛집 영역 -->
        <section class="recommended-section">
            <div class="container">
                <div class="section-header">
                    <h2>주간 리뷰 급상승 맛집</h2>
                    <div class="slider-controls">
                        <button id="prev-recommend" class="slider-control"><i class="fas fa-chevron-left"></i></button>
                        <button id="next-recommend" class="slider-control"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="restaurant-slider">
                    <c:forEach var="listRecommend" items="${listRecommend}">
	                    <div class="restaurant-card" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listRecommend.storeNo}'">
	                        <div class="restaurant-image">
	                            <img src="${path}/attach/${listRecommend.storeImage}">
	                            <span class="status-badge open">영업중</span>
	                        </div>
	                        <div class="restaurant-info">
	                            <h3>${listRecommend.storeName}</h3>
	                            <div class="rating">
	                                <span class="stars" data-rating="${listRecommend.review.roundedReviewEstimation}"></span>
	                                <span class="rating-score">${listRecommend.review.roundedReviewEstimation}</span>
	                                <span class="review-count">(${listRecommend.review.reviewCount})</span>
	                            </div>
	                            <p class="category-tag">${listRecommend.storeCategory}</p>
	                            <p class="location">${listRecommend.storeAddr}</p>
	                        </div>
	                    </div>
	                </c:forEach>
                </div>
            </div>
        </section>

        <!-- 카테고리별 추천 영역 -->
        <section class="category-section">
            <div class="container">
                <div class="section-header">
                    <h2>카테고리별 맛집</h2>
                </div>
                <div class="category-buttons">
                    <button class="category-btn active">전체</button>
                    <button class="category-btn">한식</button>
					<button class="category-btn">중식</button>
					<button class="category-btn">일식</button>
					<button class="category-btn">양식</button>
					<button class="category-btn">카페</button>
					<button class="category-btn">분식</button>
					<button class="category-btn">베이커리</button>
					<button class="category-btn">술집</button>
					<button class="category-btn">아시안</button>
					<button class="category-btn">샐러드</button>
					<button class="category-btn">간식</button>
					<button class="category-btn">디저트</button>
                </div>
                <div class="category-grid">
                    <c:forEach var="listCategory" items="${listCategory}">
	                    <div class="restaurant-card" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listCategory.storeNo}'">
	                        <div class="restaurant-image">
	                            <img src="${path}/attach/${listCategory.storeImage}">
	                            <span class="status-badge open">영업중</span>
	                        </div>
	                        <div class="restaurant-info">
	                            <h3>${listCategory.storeName}</h3>
	                            <div class="rating">
	                                <span class="stars" data-rating="${listCategory.review.roundedReviewEstimation}"></span>
	                                <span class="rating-score">${listCategory.review.roundedReviewEstimation}</span>
	                                <span class="review-count">(${listCategory.review.reviewCount})</span>
	                            </div>
	                            <p class="category-tag">${listCategory.storeCategory}</p>
	                        </div>
	                    </div>
	                </c:forEach>
                </div>
            </div>
        </section>

        <!-- 리뷰 하이라이트 영역 -->
        <section class="reviews-section">
            <div class="container">
                <div class="section-header">
                    <h2>리뷰 하이라이트</h2>
                </div>
                <div class="review-grid">
                    <c:forEach var="listReview" items="${listReview}">
	                    <div class="review-card">
	                        <div class="review-header">
	                            <div class="reviewer-info">
	                                <img src="${path}/attach/${listReview.member.memberImage}" class="reviewer-img">
	                                <div>
	                                    <h4>${listReview.member.memberNickname}</h4>
	                                </div>
	                            </div>
	                            <div class="rating">
	                                <span class="stars" data-rating="${listReview.roundedReviewEstimation}"></span>
	                                <span class="rating-score">${listReview.roundedReviewEstimation}</span>
	                            </div>
	                        </div>
	                        <div class="review-content">
	                            <div class="review-images">
	                                <img src="${path}/attach/${listReview.reviewImage}">
	                            </div>
	                            <p>${listReview.reviewContent}</p>
	                            <p class="restaurant-link"><a href="${path}/Store_servlet/restaurantDetail.do?StoreNo=${listReview.storeNo}">맛집 보러가기</a></p>
	                        </div>
	                    </div>
	                </c:forEach>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>