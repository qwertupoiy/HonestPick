<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 음식점 목록</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="${path}/_css/storeList.css">
    <script src="${path}/_js/storeList.js"></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main class="restaurants-main">
        <div class="container">
            <div class="page-title">
                <!-- 제목과 부제 제거 -->
            </div>
            
            <div class="main-content">
                <!-- 왼쪽 필터 사이드바 -->
                <aside class="filters-sidebar">
                    <div class="filters-container">
                        <div class="filter-header">
                            <h3>검색 필터</h3>
                            <button id="reset-filters" class="btn-text">초기화</button>
                        </div>
                        
                        <!-- 가격대 필터 -->
                        <div class="filter-section">
                            <h4>가격대</h4>
                            <div class="price-slider">
                                <div class="price-slider-track"></div>
                                <div class="price-slider-range"></div>
                                <div class="price-slider-thumb price-slider-thumb-min"></div>
                                <div class="price-slider-thumb price-slider-thumb-max"></div>
                                <div class="price-slider-labels">
                                    <span id="price-min-value">0원</span>
                                    <span id="price-max-value">100,000원+</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 카테고리 필터 -->
                        <div class="filter-section">
                            <h4>카테고리</h4>
                            <div class="category-options">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-1" name="category" value="한식">
                                    <label for="category-1">한식</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-2" name="category" value="중식">
                                    <label for="category-2">중식</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-3" name="category" value="일식">
                                    <label for="category-3">일식</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-4" name="category" value="양식">
                                    <label for="category-4">양식</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-5" name="category" value="카페">
                                    <label for="category-5">카페</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-6" name="category" value="분식">
                                    <label for="category-6">분식</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-7" name="category" value="베이커리">
                                    <label for="category-7">베이커리</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-8" name="category" value="술집">
                                    <label for="category-8">술집</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-9" name="category" value="아시안">
                                    <label for="category-9">아시안</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-10" name="category" value="샐러드">
                                    <label for="category-10">샐러드</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-11" name="category" value="간식">
                                    <label for="category-11">간식</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="category-12" name="category" value="디저트">
                                    <label for="category-12">디저트</label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 영업시간 필터 -->
                        <div class="filter-section">
                            <h4>영업시간</h4>
                            <div class="time-options">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="time-1" name="time" value="아침">
                                    <label for="time-1">아침 (06:00~10:00)</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="time-2" name="time" value="점심">
                                    <label for="time-2">점심 (11:00~14:00)</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="time-3" name="time" value="저녁">
                                    <label for="time-3">저녁 (17:00~21:00)</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="time-4" name="time" value="심야">
                                    <label for="time-4">심야 (22:00~05:00)</label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 영업일 필터 -->
                        <div class="filter-section">
                            <h4>영업일</h4>
                            <div class="day-options">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="day-1" name="day" value="주중">
                                    <label for="day-1">주중 영업</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="day-2" name="day" value="주말">
                                    <label for="day-2">주말 영업</label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 편의시설 필터 -->
                        <div class="filter-section">
                            <h4>편의시설</h4>
                            <div class="facility-options">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-1" name="facility" value="주차 가능">
                                    <label for="facility-1">주차 가능</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-2" name="facility" value="예약 가능">
                                    <label for="facility-2">예약 가능</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-3" name="facility" value="포장 가능">
                                    <label for="facility-3">포장 가능</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-4" name="facility" value="배달 가능">
                                    <label for="facility-4">배달 가능</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-5" name="facility" value="테라스 좌석">
                                    <label for="facility-5">테라스 좌석</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-6" name="facility" value="단체석">
                                    <label for="facility-6">단체석</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-7" name="facility" value="키즈 존">
                                    <label for="facility-7">키즈 존</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-8" name="facility" value="무선 인터넷">
                                    <label for="facility-8">무선 인터넷</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-9" name="facility" value="반려동물 동반">
                                    <label for="facility-9">반려동물 동반</label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="facility-10" name="facility" value="24시간 운영">
                                    <label for="facility-10">24시간 운영</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                
                <!-- 중앙 음식점 목록 -->
                <section class="restaurants-list">
                    <div class="restaurants-header">
                        <div class="results-count">총 <span id="results-total">${count}</span>개의 맛집</div>
                        <div class="sort-options">
                            <label for="sort-select">정렬:</label>
                            <select id="sort-select">
                                <option value="rating">별점 높은 순</option>
                                <option value="reviews">리뷰 많은 순</option>
                                <option value="recent">최근 등록 순</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- 음식점 카드 컨테이너 -->
                    <div class="restaurants-results">
                        <div id="restaurants-container">
                            <!-- JavaScript에서 동적으로 생성됨 -->
                        </div>
                        <div id="no-results" style="display: none; text-align: center; padding: 40px;">
                            <p>검색 조건에 맞는 매장이 없습니다.</p>
                        </div>
                    </div>
                </section>
                
                <!-- 오른쪽 광고 사이드바 -->
                <c:choose>
                	<c:when test="${empty listAds }">
					    <aside class="ads-sidebar">
		                    <div class="ads-container">
		                        <!-- IF no advertisement -->
		                        <div class="ad-box">
		                            <span class="ad-label">AD</span>
		                            <img src="assets/ad-sidebar-1.jpg" alt="광고 이미지">
		                            <div class="ad-content">
		                                <h4>등록된 광고가 없습니다.</h4>
		                                <p>광고를 등록하시겠습니까?</p>
		                                <a href="${path }/attach/Admin_servlet/admin_ads.do" class="ad-link">광고 등록하기</a>
		                            </div>
		                        </div>
		                    </div>
	                	</aside>
	                </c:when>
					<c:otherwise>
						<aside class="ads-sidebar">
							<div class="ads-container">
								<c:forEach var="ad" items="${listAds}">
									<div class="ad-box">
										<span class="ad-label">AD</span>
										<img src="${path}/attach/${ad.adImage}" alt="${ad.adImage }">
										<div class="ad-content">
											<h4>${ad.adTitle}</h4>
											<p>${ad.description}</p>
											<a href="${path}/attach/Admin_servlet/admin_ads.do" class="ad-link">
											광고 관리페이지 이동
											</a>
										</div>
									</div>
								</c:forEach>
							</div>
						</aside>
					</c:otherwise>
				</c:choose>
            </div>
        </div>
    </main>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
    
    <!-- 서버 데이터를 JavaScript로 전달 -->
    <script id="store-data" type="application/json">
        [
            <c:forEach var="store" items="${listStore}" varStatus="status">
            {
                "storeNo": "${store.storeNo}",
                "storeName": "${fn:escapeXml(store.storeName)}",
                "storeCategory": "${fn:escapeXml(store.storeCategory)}",
                "storeAddr": "${fn:escapeXml(store.storeAddr)}",
                "storeAdditionalInfo": "${fn:escapeXml(store.storeAdditionalInfo)}",
                "storeImage": "${store.storeImage}",
                "storeFacilities": "${fn:escapeXml(store.storeFacilities)}",
                "menuMin": ${empty store.menu.menuMin ? 0 : fn:replace(store.menu.menuMin, ',', '')},
                "menuMax": ${empty store.menu.menuMax ? 100000 : fn:replace(store.menu.menuMax, ',', '')},
                "menuMinFormatted": "${store.menu.menuMin}",
                "menuMaxFormatted": "${store.menu.menuMax}",
                "reviewEstimation": "${empty store.review.roundedReviewEstimation ? "0.0" : store.review.roundedReviewEstimation}",
                "reviewCount": ${empty store.review.reviewCount ? 0 : store.review.reviewCount},
                "openTime": "${empty store.openTime ? "00:00" : store.openTime}",
                "closeTime": "${empty store.closeTime ? "24:00" : store.closeTime}",
                "operatingDays": [
                    <c:choose>
                        <c:when test="${not empty store.operatingDays}">
                            <c:forEach var="day" items="${store.operatingDays}" varStatus="dayStatus">"${day}"<c:if test="${!dayStatus.last}">,</c:if></c:forEach>
                        </c:when>
                        <c:otherwise>
                            "주중", "주말"
                        </c:otherwise>
                    </c:choose>
                ],
                "facilities": [
                    <c:choose>
                        <c:when test="${not empty store.facilities}">
                            <c:forEach var="facility" items="${store.facilities}" varStatus="facilityStatus">"${fn:escapeXml(facility)}"<c:if test="${!facilityStatus.last}">,</c:if></c:forEach>
                        </c:when>
                        <c:otherwise>
                        </c:otherwise>
                    </c:choose>
                ],
                "businessStatus": "${empty store.businessStatus ? "영업중" : store.businessStatus}"
            }<c:if test="${!status.last}">,</c:if>
            </c:forEach>
        ]
    </script>
    
    <script>
        // contextPath만 전달
        window.contextPath = '${path}';
    </script>
</body>
</html>