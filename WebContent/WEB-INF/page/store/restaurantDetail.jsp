<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>맛집 상세정보 - HonestPick</title>
    <link rel="stylesheet" href="../_css/restaurantDetail.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.css">
    <!-- 카카오맵 API 추가 -->
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=33f110dc34a085164c0394ce26ed4616&libraries=services"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js" defer></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/ko.js" defer></script>
    <script src="../_js/restaurantDetail.js" defer></script>
</head>
<body>
    <%@ include file="../_include/header.jsp" %>
	
    <main class="restaurant-detail-main">
        <div class="container">
            <!-- 상단 정보 섹션 -->
            <section class="restaurant-hero">
                <div class="hero-content">
                    <!-- 상단 행: 매장정보 + 이미지 + 영업시간 -->
                    <div class="hero-top-row">
                        <div class="restaurant-info">
                            <h1 class="restaurant-name">${dtoStore.storeName}</h1>
                            <div class="restaurant-meta">
                                <div class="rating-info">
                                    <div class="stars">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-star-half-alt"></i>
                                    </div>
                                    <span class="rating-score">${ReviewAvg.roundedReviewEstimation}</span>
                                    <span class="review-count">(${fn:length(listReview)}개 리뷰)</span>
                                </div>
                                <div class="status-badges">
                                    <span class="category-badge">${dtoStore.storeCategory}</span>
                                    <span class="status-badge open">영업중</span>
                                    <!-- 찜하기 버튼들 -->
                                    <div class="wishlist-buttons">
                                    	<c:if test="${not empty sessionScope.MemberNo}">
	                                    	<c:choose>
		                                    	<c:when test="${wish == 'X'}">
			                                        <!-- 찜하기 버튼 (빈 하트) -->
			                                        <a href="${path}/Mypage_servlet/wishAdd.do?StoreNo=${dtoStore.storeNo}&MemberNo=${sessionScope.MemberNo}" 
			                                           class="wishlist-btn wishlist-add" title="찜하기">
			                                            <i class="far fa-heart"></i>
			                                        </a>
			                                    </c:when>
			                                    <c:otherwise>
			                                        <!-- 찜 해제 버튼 (채워진 하트) -->
			                                        <a href="${path}/Mypage_servlet/wishRemove.do?StoreNo=${dtoStore.storeNo}&MemberNo=${sessionScope.MemberNo}&page=store" 
			                                           class="wishlist-btn wishlist-remove active" title="찜 해제">
			                                            <i class="fas fa-heart"></i>
			                                        </a>
			                                    </c:otherwise>
			                                </c:choose>
			                            </c:if>
                                    </div>
                                </div>
                            </div>
                            <div class="restaurant-tags">
                            	<c:forEach var="facility" items="${Facilities}">
                            		<span class="tag">${facility}</span>
                            	</c:forEach>
                            </div>
                            
                           	<c:if test="${sessionScope.MemberNo == MemberNo}">
                           		<!-- 수정/삭제/메뉴추가 버튼 -->
	                            <div class="admin-buttons">
	                                <button type="button" class="admin-btn edit-btn" onclick="location.href='${path}/Admin_servlet/storeEdit.do?StoreNo=${dtoStore.storeNo}'">
	                                    <i class="fas fa-edit"></i>
	                                    수정하기
	                                </button>
	                                <button type="button" class="admin-btn delete-btn" onclick="location.href='${path}/Admin_servlet/storeRemove.do?StoreNo=${dtoStore.storeNo}'">
	                                    <i class="fas fa-trash-alt"></i>
	                                    삭제하기
	                                </button>
	                                <button type="button" class="admin-btn add-menu-btn" onclick="location.href='${path}/Admin_servlet/menuAdd.do?StoreNo=${dtoStore.storeNo}'">
	                                    <i class="fas fa-plus"></i>
	                                    메뉴추가
	                                </button>
	                            </div>
                           	</c:if>
                            
                        </div>

                        <div class="hero-image">
                            <img src="${path}/attach/${dtoStore.storeImage}" alt="${dtoStore.storeName}">
                        </div>

                        <!-- 영업시간 (오른쪽) -->
                        <div class="hero-business-hours">
                            <div class="hero-hours-header">
                                <i class="fas fa-clock"></i>
                                <strong>영업시간</strong>
                            </div>
                            <div class="hero-hours-list">
                            	<c:forEach var="i" begin="0" end="${(fn:length(day)-1)*2}" step="2">
                            		<div class="hero-hours-item">
                                        <span class="day">${day[i/2]}</span>
                                        <c:choose>
                                        	<c:when test="${listSchedule[i] == '휴무'}">
                                        		<span class="time">${listSchedule[i]}</span>
                                        	</c:when>
                                        	<c:otherwise>
                                        		<span class="time">${listSchedule[i]} - ${listSchedule[i+1]}</span>
                                        	</c:otherwise>
                                        </c:choose>
                                    </div>
                            	</c:forEach>
                            </div>
                        </div>
                    </div>

                    <!-- 하단 행: 기본정보 가로 배치 -->
                    <div class="hero-basic-info">
                        <div class="basic-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="basic-info-content">
                                <strong>주소</strong>
                                <span>${dtoStore.storeAddr}<br>${dtoStore.storeStreetAddr} ${dtoStore.storeAdditionalInfo}</span>
                            </div>
                        </div>
                        <div class="basic-info-item">
                            <i class="fas fa-won-sign"></i>
                            <div class="basic-info-content">
                                <strong>가격대</strong>
                                <span>${dtoStore.menu.menuMin}~${dtoStore.menu.menuMax}원</span>
                            </div>
                        </div>
                        <div class="basic-info-item">
                            <i class="fas fa-user-tie"></i>
                            <div class="basic-info-content">
                                <strong>대표명</strong>
                                <span>${MemberName}</span>
                            </div>
                        </div>
                        <div class="basic-info-item">
                            <i class="fas fa-phone"></i>
                            <div class="basic-info-content">
                                <strong>전화번호</strong>
                                <span>${dtoStore.storeContact}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 메인 컨텐츠 그리드 -->
            <div class="detail-grid">
                <!-- 왼쪽: 예약 섹션 -->
                <aside class="reservation-panel">
                    <div class="panel-card">
                        <h3 class="panel-title">
                            <i class="fas fa-calendar-check"></i>
                            예약하기
                        </h3>
                        <form class="reservation-form" method="post" action="${path}/Store_servlet/reservationProc.do">
                        <input type="hidden" name="MemberNo" value="${sessionScope.MemberNo}">
                        <input type="hidden" name="StoreNo" value="${dtoStore.storeNo}">
                        
                        <!-- 스케줄 데이터를 hidden input으로 전달 -->
                        <input type="hidden" id="schedule-data" value='
                        {
                            <c:forEach var="i" begin="0" end="${(fn:length(day)-1)*2}" step="2" varStatus="status">
                                "${day[i/2]}": {
                                    "day": "${day[i/2]}",
                                    <c:choose>
                                        <c:when test="${listSchedule[i] == '휴무'}">
                                            "isOpen": false,
                                            "openTime": null,
                                            "closeTime": null
                                        </c:when>
                                        <c:otherwise>
                                            "isOpen": true,
                                            "openTime": "${listSchedule[i]}",
                                            "closeTime": "${listSchedule[i+1]}"
                                        </c:otherwise>
                                    </c:choose>
                                }<c:if test="${!status.last}">,</c:if>
                            </c:forEach>
                        }'>
						    
						    <!-- 날짜 선택 -->
						    <div class="form-group">
						        <label><i class="fas fa-calendar-alt"></i> 날짜</label>
						        <input type="text" id="reservation-date" name="date" placeholder="날짜를 선택하세요" class="form-input" readonly>
						    </div>
						    
						    <!-- 시간 선택 -->
						    <div class="form-group">
						        <label><i class="fas fa-clock"></i> 시간</label>
						        <select class="form-input time-select" name="time">
						            <option value="" disabled selected>먼저 날짜를 선택해주세요</option>
						        </select>
						        <div class="time-info">
						            <small class="time-help-text">날짜를 선택하면 예약 가능한 시간이 표시됩니다.</small>
						        </div>
						    </div>
						    
						    <!-- 인원수 선택 -->
						    <div class="form-group">
						        <label><i class="fas fa-users"></i> 인원</label>
						        <div class="counter-group">
						            <button type="button" class="counter-btn decrease-btn">
						                <i class="fas fa-minus"></i>
						            </button>
						            <span class="counter-value" name="people">2</span>
						            <button type="button" class="counter-btn increase-btn">
						                <i class="fas fa-plus"></i>
						            </button>
						        </div>
						        <!-- 실제 form 제출을 위한 hidden input 추가 -->
						        <input type="hidden" name="peopleCount" value="2" class="people-count-input">
						    </div>
						    
						    <!-- 예약 코멘트 추가 -->
						    <div class="form-group">
						        <label><i class="fas fa-comment-dots"></i> 요청사항</label>
						        <textarea 
						            class="form-textarea reservation-comment" 
						            name="resComment" 
						            rows="3" 
						            placeholder="알레르기, 특별한 요청사항, 축하 메시지 등을 입력해주세요 (선택사항)"
						            maxlength="200"></textarea>
						        <div class="comment-counter">
						            <span class="current-length">0</span>/<span class="max-length">200</span>자
						        </div>
						    </div>
						    
						    <button type="submit" class="reservation-submit-btn">
						        <i class="fas fa-check"></i>
						        예약 신청하기
						    </button>
						</form>
                    </div>
                </aside>

                <!-- 중앙: 상세 정보 -->
                <main class="restaurant-content">
                    <!-- 메뉴 정보 -->
                    <section class="menu-section">
                        <h2 class="section-title">메뉴 정보</h2>
                        <div class="menu-categories">
                            <div class="menu-category">
                                <h3 class="category-title">메뉴</h3>
                                <div class="menu-items">
                                	<c:if test="${fn:length(listMenu) == 0}">
				                    	<p>메뉴 목록이 없습니다.</p>
				                    </c:if>
                                	<c:forEach var="listMenu" items="${listMenu}">
                                		<c:choose>
                                			<c:when test="${sessionScope.MemberNo == MemberNo}">
                                				<div class="menu-item" onclick="location.href='${path}/Admin_servlet/menuEdit.do?StoreNo=${listMenu.storeNo}&MenuNo=${listMenu.menuNo}'">
		                                			<img src="${path}/attach/${listMenu.menuImage}">
			                                        <div class="menu-info">
			                                            <h4 class="menu-name">${listMenu.menuName}</h4>
			                                            <p class="menu-description">${listMenu.menuDescription}</p>
			                                        </div>
			                                        <div class="menu-price">${listMenu.menuPrice}원</div>
		                                        </div>
                                			</c:when>
                                			<c:otherwise>
                                				<div class="menu-item">
		                                			<img src="${path}/attach/${listMenu.menuImage}">
			                                        <div class="menu-info">
			                                            <h4 class="menu-name">${listMenu.menuName}</h4>
			                                            <p class="menu-description">${listMenu.menuDescription}</p>
			                                        </div>
			                                        <div class="menu-price">${listMenu.menuPrice}원</div>
		                                        </div>
                                			</c:otherwise>
                                		</c:choose>
                                	</c:forEach>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- 연도별 평점 -->
                    <section class="rating-section">
                        <h2 class="section-title">연도별 평점 추이</h2>
                        <div class="rating-timeline">
                            <div class="rating-year">
                                <div class="year">2025</div>
                                <div class="rating-stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                </div>
                                <div class="rating-score">4.5</div>
                            </div>
                            <div class="rating-year">
                                <div class="year">2024</div>
                                <div class="rating-stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                </div>
                                <div class="rating-score">4.3</div>
                            </div>
                            <div class="rating-year">
                                <div class="year">2023</div>
                                <div class="rating-stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                </div>
                                <div class="rating-score">4.2</div>
                            </div>
                        </div>
                    </section>

                    <!-- 리뷰 섹션 -->
                    <section class="reviews-section">
                        <div class="reviews-header">
                            <h2 class="section-title">리뷰 <span class="count">(${fn:length(listReview)})</span></h2>
                            <div class="review-actions">
                                <div class="review-filters">
                                    <button class="filter-btn active" data-filter="latest">최신순</button>
                                    <button class="filter-btn" data-filter="highest">별점 높은순</button>
                                    <button class="filter-btn" data-filter="lowest">별점 낮은순</button>
                                    <button class="filter-btn" data-filter="photos">사진리뷰</button>
                                </div>
                            </div>
                        </div>

                        <c:if test="${fn:length(listReview) == 0}">
                            <div class="no-reviews">
                                <div class="no-reviews-icon">
                                    <i class="fas fa-comment-slash"></i>
                                </div>
                                <p class="no-reviews-text">아직 작성된 리뷰가 없습니다.</p>
                                <c:if test="${not empty sessionScope.MemberNo}">
                                    <p class="no-reviews-subtext">첫 번째 리뷰를 작성해보세요!</p>
                                    <a href="${path}/Review_servlet/reviewWrite.do?StoreNo=${dtoStore.storeNo}" class="first-review-btn">
                                        <i class="fas fa-edit"></i>
                                        리뷰 작성하기
                                    </a>
                                </c:if>
                            </div>
                        </c:if>

                        <div class="reviews-list">
                            <c:forEach var="listReview" items="${listReview}">
                                <div class="review-item">
                                    <div class="review-header">
                                        <div class="reviewer-info">
                                            <img src="${path}/attach/${listReview.memberImage}" alt="리뷰어" class="reviewer-avatar">
                                            <div class="reviewer-details">
                                                <div class="reviewer-name">
                                                    ${listReview.memberNickname}
                                                    <span class="verified-badge">
                                                        <i class="fas fa-check-circle"></i>
                                                        인증
                                                    </span>
                                                    <c:if test="${listReview.memberNickname == sessionScope.MemberNickname}">
                                                        <div class="review-action-buttons">
                                                            <button type="button" class="review-action-btn review-edit-btn" onclick="location.href='${path}/Admin_servlet/reviewEdit.do?ReviewNo=${listReview.reviewNo}'">
                                                                <i class="fas fa-edit"></i>
                                                                수정
                                                            </button>
                                                            <button type="button" class="review-action-btn review-delete-btn" onclick="confirmDelete('${path}/Admin_servlet/reviewRemove.do?StoreNo=${dtoStore.storeNo}&MemberNo=${sessionScope.MemberNo}&ReviewNo=${listReview.reviewNo}')">
                                                                <i class="fas fa-trash-alt"></i>
                                                                삭제
                                                            </button>
                                                        </div>
                                                    </c:if>
                                                </div>
                                                <div class="review-date">${listReview.reviewRegidate}</div>
                                            </div>
                                        </div>
                                        <div class="review-rating">
                                            <div class="stars">
                                                <c:forEach begin="1" end="5" var="star">
                                                    <c:choose>
                                                        <c:when test="${star <= listReview.roundedReviewEstimation}">
                                                            <i class="fas fa-star"></i>
                                                        </c:when>
                                                        <c:otherwise>
                                                            <i class="far fa-star"></i>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </c:forEach>
                                            </div>
                                            <span class="score">${listReview.roundedReviewEstimation}점</span>
                                        </div>
                                    </div>
                                    <c:if test="${not empty listReview.reviewTitle}">
                                        <h4 class="review-title">${listReview.reviewTitle}</h4>
                                    </c:if>
                                    <div class="review-content">
                                        <p class="review-text">${listReview.reviewContent}</p>
                                    </div>
                                    <c:if test="${not empty listReview.reviewImage}">
                                        <div class="review-images">
                                            <img src="${path}/attach/${listReview.reviewImage}" alt="리뷰 이미지" class="review-image">
                                        </div>
                                    </c:if>
                                    <!-- 리뷰 유용성 버튼 -->
                                    <div class="review-actions-bottom">
                                        <button type="button" class="review-helpful-btn">
                                            <i class="far fa-thumbs-up"></i>
                                            도움돼요 <span class="helpful-count">0</span>
                                        </button>
                                        <button type="button" class="review-report-btn">
                                            <i class="fas fa-flag"></i>
                                            신고
                                        </button>
                                    </div>
                                </div>
                            </c:forEach>
                        </div>

                        <!-- 리뷰 더보기 버튼 -->
                        <c:if test="${fn:length(listReview) > 5}">
                            <div class="load-more-section">
                                <button type="button" class="load-more-btn">
                                    <i class="fas fa-chevron-down"></i>
                                    리뷰 더보기
                                </button>
                            </div>
                        </c:if>
                    </section>
                </main>

                <!-- 오른쪽: 지도 및 광고 -->
                <aside class="sidebar">
                    <!-- 카카오맵 -->
                    <div class="panel-card">
                        <h3 class="panel-title">
                            <i class="fas fa-map-marker-alt"></i>
                            위치 정보
                        </h3>
                        <div class="map-container">
                            <!-- 카카오맵이 표시될 영역 -->
                            <div id="kakao-map" style="width:100%;height:300px;border-radius:8px;"></div>
                        </div>
                        <div class="location-info">
                            <p><strong>${dtoStore.storeAddr} ${dtoStore.storeAdditionalInfo}</strong></p>
                            <p>${dtoStore.storeStreetAddr}</p>
                            <div class="map-controls">
                                <button class="map-btn" onclick="openLargeMap()" type="button">
                                    <i class="fas fa-expand"></i>
                                    큰 지도 보기
                                </button>
                                <button class="map-btn" onclick="copyAddress()" type="button">
                                    <i class="fas fa-copy"></i>
                                    주소 복사
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 광고 섹션 -->
                    <c:choose>
	                	<c:when test="${empty listAds }">
						    <aside class="ads-sidebar">
			                    <div class="ads-container">
			                        <!-- IF no advertisement -->
			                        <div class="ad-section">
				                        <div class="ad-item">
				                            <div class="ad-header">
				                                <span class="ad-title">등록된 광고가 없습니다.</span>
				                                <span class="ad-label">광고를 추가해주세요.</span>
				                            </div>
				                            <div class="ad-content">
				                                <img src="${path}/attach/none.jpg" alt="noneAd">
				                            </div>
				                        </div>
				                    </div>
			                    </div>
		                	</aside>
		                </c:when>
						<c:otherwise>
							<aside class="ads-sidebar">
								<div class="ads-container">
									<c:forEach var="ad" items="${listAds}">
										<div class="ad-section">
					                        <div class="ad-item">
					                            <div class="ad-header">
					                                <span class="ad-title">${ad.adTitle}</span>
					                            </div>
					                            <div class="ad-header">
					                                <span class="ad-label">${ad.description}</span>
					                            </div>
					                            <div class="ad-content">
					                                <img src="${path}/attach/${ad.adImage}" alt="${ad.adImage }">					                                
					                            </div>
					                        </div>
					                    </div>
									</c:forEach>
								</div>
							</aside>
						</c:otherwise>
					</c:choose>
                </aside>
            </div>
        </div>
    </main>

    <!-- 큰 지도 모달 -->
    <div class="modal-overlay" id="map-modal">
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>위치 정보 - ${dtoStore.storeName}</h3>
                <button class="modal-close" id="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <!-- 큰 지도가 표시될 영역 -->
                <div id="large-kakao-map" style="width:100%;height:500px;border-radius:8px;"></div>
                <div class="modal-location-info">
                    <div class="location-details">
                        <h4>${dtoStore.storeName}</h4>
                        <p><strong>${dtoStore.storeAddr} ${dtoStore.storeAdditionalInfo}</strong></p>
                        <p>${dtoStore.storeStreetAddr}</p>
                        <p><i class="fas fa-phone"></i> ${dtoStore.storeContact}</p>
                    </div>
                    <div class="modal-map-controls">
                        <button class="modal-map-btn" onclick="centerMap()" type="button">
                            <i class="fas fa-crosshairs"></i>
                            위치 중심으로
                        </button>
                        <button class="modal-map-btn" onclick="openKakaoMap()" type="button">
                            <i class="fas fa-external-link-alt"></i>
                            카카오맵에서 보기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div class="modal-overlay" id="delete-confirm-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>리뷰 삭제</h3>
                <button class="modal-close" onclick="closeDeleteModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="delete-confirm-content">
                    <div class="delete-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p>정말로 이 리뷰를 삭제하시겠습니까?</p>
                    <p class="delete-warning">삭제된 리뷰는 복구할 수 없습니다.</p>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-cancel" onclick="closeDeleteModal()">취소</button>
                    <button type="button" class="btn btn-delete" id="confirm-delete-btn">삭제</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 주소 데이터를 스크립트에서 사용하기 위한 hidden input -->
    <input type="hidden" id="store-address" value="${dtoStore.storeAddr}">
	<input type="hidden" id="store-name" value="${dtoStore.storeName}">

    <%@ include file="../_include/footer.jsp" %>
</body>
</html>