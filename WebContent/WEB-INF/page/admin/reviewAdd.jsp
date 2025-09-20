<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>리뷰 작성하기 - HonestPick</title>
    <link rel="stylesheet" href="../_css/reviewAdd.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/reviewAdd.js" defer></script>
</head>
<body>
    <%@ include file="../_include/header.jsp" %>
	
    <main class="review-write-main">
        <div class="container">
            <!-- 상단 음식점 정보 -->
            <section class="restaurant-info-section">
                <div class="restaurant-summary">
                    <div class="restaurant-image">
                        <img src="${path}/attach/${dtoStore.storeImage}" alt="${dtoStore.storeName}">
                    </div>
                    <div class="restaurant-details">
                        <h1 class="restaurant-name">${dtoStore.storeName}</h1>
                        <div class="restaurant-meta">
                            <span class="category">${dtoStore.storeCategory}</span>
                            <span class="address">${dtoStore.storeAddr}</span>
                        </div>
                        <div class="rating-summary">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span class="rating-score">${ReviewInfo.roundedReviewEstimation}</span>
                            <span class="review-count">(${ReviewInfo.reviewCount}개 리뷰)</span>
                        </div>
                    </div>
                </div>
                
                <!-- 뒤로가기 버튼 -->
                <div class="back-button-container">
                    <button type="button" class="back-btn" onclick="history.back()">
                        <i class="fas fa-arrow-left"></i>
                        뒤로가기
                    </button>
                </div>
            </section>

            <!-- 리뷰 작성 폼 -->
            <section class="review-form-section">
                <div class="form-container">
                    <div class="form-header">
                        <h2 class="form-title">
                            <i class="fas fa-edit"></i>
                            리뷰 작성하기
                        </h2>
                        <p class="form-description">
                            다른 고객들에게 도움이 되는 솔직한 후기를 남겨주세요.
                        </p>
                    </div>

                    <form class="review-form" method="post" action="${path}/Admin_servlet/reviewAddProc.do" enctype="multipart/form-data">
                        <!-- Hidden 필드들 -->
                        <input type="hidden" name="MemberNo" value="${sessionScope.MemberNo}">
                        <input type="hidden" name="StoreNo" value="${dtoStore.storeNo}">
                        <input type="hidden" name="ReviewEstimation" value="" id="rating-value">
                        <input type="hidden" name="ResNo" value="${ResNo}">
                        
                        <!-- 별점 평가 -->
                        <div class="form-group rating-group">
                            <label class="form-label">
                                <i class="fas fa-star"></i> 
                                별점 평가
                                <span class="required">*</span>
                            </label>
                            <div class="star-rating">
                                <button type="button" class="star-btn" data-rating="1">
                                    <i class="fas fa-star"></i>
                                </button>
                                <button type="button" class="star-btn" data-rating="2">
                                    <i class="fas fa-star"></i>
                                </button>
                                <button type="button" class="star-btn" data-rating="3">
                                    <i class="fas fa-star"></i>
                                </button>
                                <button type="button" class="star-btn" data-rating="4">
                                    <i class="fas fa-star"></i>
                                </button>
                                <button type="button" class="star-btn" data-rating="5">
                                    <i class="fas fa-star"></i>
                                </button>
                                <span class="rating-text">별점을 선택해주세요</span>
                            </div>
                            <div class="rating-guide">
                                <div class="rating-item">
                                    <span class="rating-number">1점</span>
                                    <span class="rating-description">별로예요</span>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-number">2점</span>
                                    <span class="rating-description">그저 그래요</span>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-number">3점</span>
                                    <span class="rating-description">괜찮아요</span>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-number">4점</span>
                                    <span class="rating-description">좋아요</span>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-number">5점</span>
                                    <span class="rating-description">최고예요!</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 리뷰 제목 -->
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-edit"></i> 
                                리뷰 제목
                                <span class="required">*</span>
                            </label>
                            <input type="text" 
                                   name="ReviewTitle" 
                                   class="form-input review-title" 
                                   placeholder="리뷰 제목을 입력해주세요 (예: 맛있고 분위기 좋은 곳이에요!)" 
                                   maxlength="100" 
                                   required>
                            <div class="char-counter title-counter">
                                <span class="current-title-length">0</span>/<span class="max-title-length">100</span>자
                            </div>
                        </div>
                        
                        <!-- 리뷰 내용 -->
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-comment"></i> 
                                리뷰 내용
                                <span class="required">*</span>
                            </label>
                            <textarea class="form-textarea review-content" 
                                      name="ReviewContent" 
                                      rows="6" 
                                      placeholder="음식 맛, 서비스, 분위기, 가격 등에 대한 솔직한 후기를 남겨주세요. (최소 10자 이상)"
                                      maxlength="500"
                                      required></textarea>
                            <div class="char-counter content-counter">
                                <span class="current-content-length">0</span>/<span class="max-content-length">500</span>자
                            </div>
                            <div class="content-tips">
                                <h4>도움이 되는 리뷰 작성 팁</h4>
                                <ul>
                                    <li>음식의 맛과 품질에 대해 구체적으로 작성해주세요</li>
                                    <li>서비스와 직원의 친절함에 대해 언급해주세요</li>
                                    <li>매장의 분위기와 청결도를 평가해주세요</li>
                                    <li>가격 대비 만족도를 공유해주세요</li>
                                    <li>재방문 의사를 표현해주세요</li>
                                </ul>
                            </div>
                        </div>
                        
                        <!-- 사진 첨부 -->
                        <div class="form-group photo-group">
                            <label class="form-label">
                                <i class="fas fa-camera"></i> 
                                사진 첨부 
                                <span class="optional">(선택사항)</span>
                            </label>
                            <div class="photo-upload-area">
                                <div class="upload-zone">
                                    <div class="upload-icon">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                    </div>
                                    <div class="upload-text">
                                        <p class="upload-main-text">사진을 드래그하거나 클릭하여 업로드</p>
                                        <p class="upload-sub-text">최대 5장까지 업로드 가능</p>
                                    </div>
                                    <button type="button" class="upload-btn">
                                        <i class="fas fa-camera"></i>
                                        사진 선택
                                    </button>
                                    <input type="file" 
                                           id="photo-input" 
                                           name="ReviewImage" 
                                           accept="image/*" 
                                           multiple 
                                           style="display: none;">
                                </div>
                                <div class="upload-info">
                                    <div class="info-item">
                                        <i class="fas fa-info-circle"></i>
                                        <span>JPG, PNG, GIF 형식만 지원</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-weight-hanging"></i>
                                        <span>파일당 최대 5MB</span>
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-images"></i>
                                        <span>최대 5장까지 업로드</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 사진 미리보기 영역 -->
                            <div class="photo-preview-container">
                                <!-- JavaScript로 동적 생성 -->
                            </div>
                        </div>
                        
                        <!-- 제출 버튼 -->
                        <div class="form-actions">
                            <button type="button" class="btn btn-cancel" onclick="history.back()">
                                <i class="fas fa-times"></i>
                                취소
                            </button>
                            <button type="submit" class="btn btn-submit">
                                <i class="fas fa-paper-plane"></i>
                                리뷰 등록
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 안내 사항 -->
                <div class="guidelines-section">
                    <h3 class="guidelines-title">
                        <i class="fas fa-exclamation-circle"></i>
                        리뷰 작성 가이드라인
                    </h3>
                    <div class="guidelines-content">
                        <div class="guideline-item">
                            <h4>올바른 리뷰</h4>
                            <ul>
                                <li>실제 방문 경험을 바탕으로 한 솔직한 후기</li>
                                <li>다른 고객에게 도움이 되는 구체적인 정보</li>
                                <li>음식, 서비스, 분위기에 대한 객관적인 평가</li>
                            </ul>
                        </div>
                        <div class="guideline-item">
                            <h4>금지 사항</h4>
                            <ul>
                                <li>허위 정보나 과장된 내용</li>
                                <li>개인정보나 사생활 침해 내용</li>
                                <li>욕설, 비방, 차별적 표현</li>
                                <li>광고성 내용이나 홍보 목적의 글</li>
                            </ul>
                        </div>
                    </div>
                    <p class="guidelines-note">
                        부적절한 리뷰는 관리자 검토 후 삭제될 수 있습니다.
                    </p>
                </div>
            </section>
        </div>
    </main>

    <%@ include file="../_include/footer.jsp" %>
</body>
</html>