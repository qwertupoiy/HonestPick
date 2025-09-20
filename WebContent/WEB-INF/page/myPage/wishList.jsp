<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>찜한 맛집</title>
    <link rel="stylesheet" href="../_css/my_wishList.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/my_wishList.js"></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- 마이페이지 섹션 -->
    <section class="mypage-section">
        <div class="container">
            <div class="mypage-content">
                
                <%@ include file="../_include/myPage_sidebar.jsp" %>
                
                <!-- 메인 컨텐츠 -->
                <div class="main-content">
                    <!-- 찜한 맛집 컨텐츠 -->
                    <div class="favorites-container tab-content active" id="favoritesContent">
                        <h3 class="form-title">찜한 맛집</h3>
                        
                        <!-- 필터링 옵션 -->
                        <div class="favorites-filters">
                            <select class="filter-select" id="sortFilter">
                                <option value="recent">최근 저장순</option>
                                <option value="name">가게명순</option>
                                <option value="rating">평점 높은순</option>
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
                                <input type="text" class="search-input" placeholder="맛집 검색...">
                                <button class="search-btn"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                        
                        <!-- 찜한 맛집 카운트 -->
                        <div class="favorites-count">
                            총 <span class="count-number">${fn:length(listWish)}</span>개의 맛집을 찜하셨습니다.
                        </div>
                        
                        <!-- 찜한 맛집 목록 -->
                        <div class="favorite-cards">
	                        <c:if test="${fn:length(listWish) == 0}">
		                    	<p>매장 목록이 없습니다.</p>
		                    </c:if>
							<c:forEach var="listWish" items="${listWish}" varStatus="i">
	                            <div class="favorite-card" data-category="korean">
	                                <div class="favorite-header">
	                                    <img src="${path}/attach/${listWish.store.storeImage}" class="favorite-image">
	                                    <button class="favorite-toggle active" 
	                                    		onclick="location.href='${path}/Mypage_servlet/wishRemove.do?StoreNo=${listWish.storeNo}&MemberNo=${sessionScope.MemberNo}&page=wishList'">
	                                        <i class="fas fa-heart"></i>
	                                    </button>
	                                </div>
	                                <div class="favorite-content">
	                                    <div class="favorite-meta">
	                                        <span class="restaurant-category">${listWish.store.storeCategory}</span>
	                                        <div class="restaurant-rating">
	                                            <i class="fas fa-star"></i>
	                                            <span>${listWish.review.roundedReviewEstimation}</span>
                                                <span class="review-count">(${listWish.review.reviewCount})</span>
	                                        </div>
	                                    </div>
	                                    <h4 class="restaurant-title">${listWish.store.storeName}</h4>
	                                    <p class="restaurant-location"><i class="fas fa-map-marker-alt"></i>${listWish.store.storeAddr}</p>
	                                    <div class="restaurant-tags">
	                                    	<c:set var="facilities" value="${fn:split(listWish.store.storeFacilities, ',')}" />
	                                    	<c:forEach var="item" items="${facilities}">
		                                        <span class="tag">${item}</span>
	                                        </c:forEach>
	                                    </div>
	                                    <div class="favorite-actions">
	                                        <div class="action-btn btn-view" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listWish.storeNo}'">상세보기</div>
	                                    </div>
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