<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>리뷰 수정 - HonestPick</title>
    <link rel="stylesheet" href="../_css/reviewEdit.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/reviewEdit.js" defer></script>
</head>
<body>
    <%@ include file="../_include/header.jsp" %>
    
    <main class="review-edit-main">
        <div class="container">
            <!-- 상단 헤더 -->
            <div class="page-header">
                <div class="breadcrumb">
                    <a href="${path}/Store_servlet/restaurantDetail.do?StoreNo=${dtoReview.storeNo}">
                        <i class="fas fa-arrow-left"></i>
                        매장으로 돌아가기
                    </a>
                </div>
                <h1 class="page-title">리뷰 수정</h1>
                <p class="page-description">작성하신 리뷰를 수정하거나 삭제할 수 있습니다.</p>
            </div>

            <!-- 매장 정보 미리보기 -->
            <div class="store-preview">
                <img src="${path}/attach/${dtoStore.storeImage}" alt="${dtoStore.storeName}" class="store-image">
                <div class="store-info">
                    <h3 class="store-name">${dtoStore.storeName}</h3>
                    <p class="store-category">${dtoStore.storeCategory}</p>
                    <p class="store-address">${dtoStore.storeAddr}</p>
                </div>
            </div>

            <!-- 메인 컨텐츠 -->
            <div class="content-grid">
                <!-- 리뷰 수정 폼 -->
                <div class="review-form-section">
                    <div class="form-card">
                        <div class="form-header">
                            <h2 class="form-title">
                                <i class="fas fa-edit"></i>
                                리뷰 수정하기
                            </h2>
                            <div class="form-actions">
                                <button type="button" class="action-btn delete-btn" onclick="confirmDelete()">
                                    <i class="fas fa-trash-alt"></i>
                                    삭제하기
                                </button>
                            </div>
                        </div>

                        <form class="review-form" method="post" action="${path}/Admin_servlet/reviewEditProc.do" enctype="multipart/form-data">
                            <!-- Hidden 필드들 -->
                            <input type="hidden" name="ReviewNo" value="${dtoReview.reviewNo}">
                            <input type="hidden" name="MemberNo" value="${dtoReview.memberNo}">
                            <input type="hidden" name="StoreNo" value="${dtoReview.storeNo}">
                            <input type="hidden" name="ReviewEstimation" value="${dtoReview.reviewEstimation}" id="rating-value">
                            <input type="hidden" name="ExistingImage" value="${dtoReview.reviewImage}">
                            
                            <!-- 별점 평가 -->
                            <div class="form-group">
                                <label><i class="fas fa-star"></i> 별점 평가</label>
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
                                    <span class="rating-text">현재 별점: ${dtoReview.reviewEstimation}점</span>
                                </div>
                            </div>
                            
                            <!-- 리뷰 제목 -->
                            <div class="form-group">
                                <label><i class="fas fa-heading"></i> 리뷰 제목</label>
                                <input type="text" 
                                       name="ReviewTitle" 
                                       class="form-input review-title" 
                                       placeholder="리뷰 제목을 입력해주세요" 
                                       value="${dtoReview.reviewTitle}"
                                       maxlength="100" 
                                       required>
                                <div class="title-counter">
                                    <span class="current-title-length">${fn:length(dtoReview.reviewTitle)}</span>/<span class="max-title-length">100</span>자
                                </div>
                            </div>
                            
                            <!-- 리뷰 내용 -->
                            <div class="form-group">
                                <label><i class="fas fa-comment"></i> 리뷰 내용</label>
                                <textarea class="form-textarea review-content" 
                                          name="ReviewContent" 
                                          rows="6" 
                                          placeholder="음식, 서비스, 분위기 등에 대한 솔직한 후기를 남겨주세요."
                                          maxlength="500"
                                          required>${dtoReview.reviewContent}</textarea>
                                <div class="content-counter">
                                    <span class="current-content-length">${fn:length(dtoReview.reviewContent)}</span>/<span class="max-content-length">500</span>자
                                </div>
                            </div>
                            
                            <!-- 기존 사진 미리보기 -->
                            <c:if test="${not empty dtoReview.reviewImage}">
                                <div class="form-group">
                                    <label><i class="fas fa-images"></i> 현재 등록된 사진</label>
                                    <div class="existing-photo">
                                        <div class="photo-item">
                                            <img src="${path}/attach/${dtoReview.reviewImage}" alt="기존 리뷰 이미지">
                                            <button type="button" class="remove-existing-photo" onclick="removeExistingPhoto()">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </c:if>
                            
                            <!-- 새 사진 첨부 -->
                            <div class="form-group">
                                <label><i class="fas fa-camera"></i> 새 사진 첨부 (선택사항)</label>
                                <div class="photo-upload">
                                    <button type="button" class="upload-btn">
                                        <i class="fas fa-camera"></i>
                                        새 사진 추가 (최대 5장)
                                    </button>
                                    <input type="file" 
                                           id="photo-input" 
                                           name="ReviewImage" 
                                           accept="image/*" 
                                           multiple 
                                           style="display: none;">
                                </div>
                                <div class="photo-preview" id="photo-preview"></div>
                                <div class="upload-info">
                                    <p>• 새 사진을 업로드하면 기존 사진은 대체됩니다.</p>
                                    <p>• 이미지는 최대 5장까지 업로드 가능합니다.</p>
                                    <p>• 파일 크기는 5MB 이하만 가능합니다.</p>
                                    <p>• JPG, PNG, GIF 형식을 지원합니다.</p>
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
                                    리뷰 수정 완료
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
                            리뷰 수정 도움말
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
                                    <strong>리뷰 삭제</strong>
                                    <p>삭제된 리뷰는 복구할 수 없으니 신중히 결정해주세요.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 리뷰 작성 가이드 -->
                    <div class="guide-card">
                        <h3 class="guide-title">
                            <i class="fas fa-lightbulb"></i>
                            좋은 리뷰 작성 팁
                        </h3>
                        <div class="guide-content">
                            <ul>
                                <li>구체적인 메뉴명과 맛에 대해 작성해주세요</li>
                                <li>서비스와 분위기도 함께 언급해주세요</li>
                                <li>다른 고객들에게 도움이 되는 정보를 포함해주세요</li>
                                <li>사진이 있으면 더욱 신뢰성 있는 리뷰가 됩니다</li>
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
                <h3>리뷰 삭제 확인</h3>
                <button class="modal-close" onclick="closeDeleteModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="warning-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>정말로 이 리뷰를 삭제하시겠습니까?</p>
                <p class="warning-text">삭제된 리뷰는 복구할 수 없습니다.</p>
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