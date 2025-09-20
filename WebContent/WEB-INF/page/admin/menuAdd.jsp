<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>메뉴 등록 - HonestPick</title>
    <link rel="stylesheet" href="../_css/menuAdd.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="../_js/menuAdd.js" defer></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main class="menu-add-main">
        <div class="container">
            <form id="menu-add-form" action="${path}/Admin_servlet/menuAddProc.do" method="post" enctype="multipart/form-data">
                <input type="hidden" name="StoreNo" value="${StoreNo}">
                <div class="add-content">
                    <!-- 왼쪽 기본 정보 영역 -->
                    <div class="add-left">
                        <!-- 기본 정보 섹션 -->
                        <section class="add-section">
                            <div class="section-header">
                                <h2><i class="fas fa-utensils"></i> 메뉴 기본 정보</h2>
                            </div>
                            <div class="section-content">
                                <div class="form-group">
                                    <label for="menuName">메뉴명 <span class="required">*</span></label>
                                    <input type="text" id="menuName" name="MenuName" required placeholder="메뉴명을 입력해주세요">
                                    <p class="field-hint">고객에게 표시될 메뉴명입니다.</p>
                                </div>

                                <div class="form-group">
                                    <label for="menuPrice">메뉴 가격 <span class="required">*</span></label>
                                    <div class="price-input-group">
                                        <input type="number" id="menuPrice" name="MenuPrice" required placeholder="0" min="0" max="1000000">
                                        <span class="price-unit">원</span>
                                    </div>
                                    <p class="field-hint">메뉴의 판매 가격을 입력해주세요.</p>
                                </div>
                                
                                <div class="form-group description-group">
                                    <label for="menuDescription">메뉴 설명 <span class="required">*</span></label>
                                    <textarea id="menuDescription" name="MenuDescription" rows="8" required placeholder="메뉴에 대한 자세한 설명을 입력해주세요.&#10;&#10;예시:&#10;- 재료: 국내산 돼지고기, 신선한 야채&#10;- 특징: 집에서 직접 우린 진한 육수&#10;- 매운 정도: 보통&#10;- 추천 대상: 든든한 한 끼를 원하는 분"></textarea>
                                    <p class="field-hint">메뉴의 재료, 특징, 맛 등을 자세히 설명해주세요. (최대 1000자)</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <!-- 오른쪽 이미지 영역 -->
                    <div class="add-right">
                        <!-- 이미지 업로드 섹션 -->
                        <section class="add-section">
                            <div class="section-header">
                                <h2><i class="fas fa-camera"></i> 메뉴 이미지</h2>
                            </div>
                            <div class="section-content">
                                <div class="image-upload-area">
                                    <div class="current-image">
                                        <img id="menuImagePreview" src="../_images/default-menu.png" alt="메뉴 이미지 미리보기">
                                    </div>
                                    <div class="upload-controls">
                                        <input type="file" id="menuImage" name="MenuImage" accept="image/*" required style="display: none;">
                                        <button type="button" id="image-upload-btn" class="btn-secondary">이미지 선택</button>
                                        <button type="button" id="image-remove-btn" class="btn-cancel">이미지 삭제</button>
                                        <p class="upload-note">
                                            <span class="required">* 필수 항목</span><br>
                                            권장 크기: 800x600px, 최대 5MB<br>
                                            JPG, PNG, GIF 파일만 업로드 가능
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <!-- 메뉴 추가 팁 섹션 -->
                        <section class="add-section">
                            <div class="section-header">
                                <h2><i class="fas fa-lightbulb"></i> 메뉴 등록 팁</h2>
                            </div>
                            <div class="section-content">
                                <div class="tips-content">
                                    <div class="tip-item">
                                        <div class="tip-icon">
                                            <i class="fas fa-camera"></i>
                                        </div>
                                        <div class="tip-text">
                                            <h4>좋은 메뉴 사진</h4>
                                            <p>밝고 선명한 사진을 업로드하면 주문율이 높아집니다.</p>
                                        </div>
                                    </div>
                                    <div class="tip-item">
                                        <div class="tip-icon">
                                            <i class="fas fa-edit"></i>
                                        </div>
                                        <div class="tip-text">
                                            <h4>상세한 설명</h4>
                                            <p>재료, 맛, 특징을 자세히 작성하면 고객 만족도가 높아집니다.</p>
                                        </div>
                                    </div>
                                    <div class="tip-item">
                                        <div class="tip-icon">
                                            <i class="fas fa-won-sign"></i>
                                        </div>
                                        <div class="tip-text">
                                            <h4>적정 가격</h4>
                                            <p>주변 경쟁업체와 비교하여 합리적인 가격을 책정하세요.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- 액션 버튼 -->
                <div class="form-actions">
                    <button type="button" id="cancel-btn" class="btn-cancel">취소</button>
                    <button type="submit" id="add-btn" class="btn-primary">메뉴 등록하기</button>
                </div>
            </form>
        </div>
    </main>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>