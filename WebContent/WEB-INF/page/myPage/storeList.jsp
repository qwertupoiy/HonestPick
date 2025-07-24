<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내 매장 보기</title>
    <link rel="stylesheet" href="../_css/my_storeList.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/my_storeList.js"></script>
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
                    <!-- 내 매장 보기 컨텐츠 -->
                    <div class="store-container tab-content active" id="storeContent">
                        <h3 class="form-title">내 매장 보기</h3>
                        
                        <!-- 필터링 옵션 -->
                        <div class="store-filters">
                            <select class="filter-select" id="sortFilter">
                                <option value="recent">최근 등록순</option>
                                <option value="name">매장명순</option>
                                <option value="rating">평점 높은순</option>
                                <option value="status">운영상태별</option>
                            </select>
                            <select class="filter-select" id="statusFilter">
                                <option value="all">전체 상태</option>
                                <option value="open">운영중</option>
                                <option value="closed">휴업중</option>
                                <option value="temp_closed">임시휴업</option>
                            </select>
                            <div class="search-container">
                                <input type="text" class="search-input" placeholder="매장 검색...">
                                <button class="search-btn"><i class="fas fa-search"></i></button>
                            </div>
                        </div>
                        
                        <!-- 매장 카운트 -->
                        <div class="store-count">
                            총 <span class="count-number">${fn:length(listStore)}</span>개의 매장을 운영하고 있습니다.
                        </div>
                        
                        <!-- 매장 목록 -->
                        <div class="store-cards">
                            <c:if test="${fn:length(listStore) == 0}">
                                <div class="no-store-message">
                                    <i class="fas fa-store"></i>
                                    <p>등록된 매장이 없습니다.</p>
                                    <span class="sub-text">첫 번째 매장을 등록해보세요!</span>
                                    <button class="add-first-store-btn" onclick="location.href='${path}/Admin_servlet/storeAdd.do?MemberNo=${sessionScope.MemberNo}'">
                                        첫 매장 등록하기
                                    </button>
                                </div>
                            </c:if>
                            <c:forEach var="listStore" items="${listStore}" varStatus="i">
                                <div class="store-card" data-status="open">
                                    <div class="store-header-card">
                                        <img src="${path}/attach/${listStore.storeImage}" class="store-image" alt="${listStore.storeName}">
                                        <div class="store-status-badge open">운영중</div>
                                        <div class="store-actions-dropdown">
                                            <button class="dropdown-toggle" onclick="toggleDropdown(this)">
                                                <i class="fas fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-menu">
                                                <a href="${path}/Admin_servlet/storeEdit.do?StoreNo=${listStore.storeNo}" class="dropdown-item">
                                                    <i class="fas fa-edit"></i> 매장 수정
                                                </a>
                                                <a href="${path}/Admin_servlet/storeRemove.do?StoreNo=${listStore.storeNo}" class="dropdown-item delete-btn">
                                                    <i class="fas fa-trash"></i> &nbsp;매장 삭제
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="store-content">
                                        <div class="store-meta">
                                            <span class="store-category ${listStore.storeCategory}">${listStore.storeCategory}</span>
                                            <div class="store-rating">
                                                <i class="fas fa-star"></i>
                                                <span>${listStore.review.roundedReviewEstimation}</span>
                                                <span class="review-count">(${listStore.review.reviewCount})</span>
                                            </div>
                                        </div>
                                        <h4 class="store-title">${listStore.storeName}</h4>
                                        <p class="store-location">
                                            <i class="fas fa-map-marker-alt"></i>
                                            ${listStore.storeAddr}
                                        </p>
                                        <p class="store-phone">
                                            <i class="fas fa-phone"></i>
                                            ${listStore.storeContact}
                                        </p>
                                        <div class="store-card-actions">
                                            <div class="action-btn btn-view" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listStore.storeNo}'">
                                                상세보기
                                            </div>
                                            <c:choose>
                                            	<c:when test="${listStore.state == 'exist'}">
		                                            <div class="action-btn btn-view" onclick="location.href='${path}/Mypage_servlet/memberShip.do?StoreNo=${listStore.storeNo}&MemberNo=${sessionScope.MemberNo}&State=${listStore.state}'">
		                                                ${listStore.memberShip}까지 | 멤버십 연장
		                                            </div>
                                            	</c:when>
                                            	<c:otherwise>
		                                            <div class="action-btn btn-view" onclick="location.href='${path}/Mypage_servlet/memberShip.do?StoreNo=${listStore.storeNo}&MemberNo=${sessionScope.MemberNo}&State=${listStore.state}'">
		                                                멤버십 구매
		                                            </div>
                                            	</c:otherwise>
                                            </c:choose>
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