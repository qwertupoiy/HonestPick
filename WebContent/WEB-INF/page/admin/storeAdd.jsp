<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>매장 등록 - HonestPick</title>
    <link rel="stylesheet" href="../_css/storeAdd.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="../_js/storeAdd.js" defer></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main class="store-register-main">
        <div class="container">
            <form id="register-form" action="${path}/Admin_servlet/storeAddProc.do" method="post" enctype="multipart/form-data">
                <input type="hidden" name="MemberNo" value="${MemberNo}">
                <div class="register-content">
                    <!-- 왼쪽 기본 정보 영역 -->
                    <div class="register-left">
                        <!-- 기본 정보 섹션 -->
                        <section class="register-section">
                            <div class="section-header">
                                <h2><i class="fas fa-store"></i> 기본 정보</h2>
                            </div>
                            <div class="section-content">
                                <div class="form-group">
                                    <label for="storeName">매장 이름 <span class="required">*</span></label>
                                    <input type="text" id="storeName" name="StoreName" required placeholder="매장 이름을 입력해주세요">
                                    <p class="field-hint">고객에게 표시될 매장 이름입니다.</p>
                                </div>

                                <div class="form-group">
                                    <label for="officeName">상호명 <span class="required">*</span></label>
                                    <input type="text" id="officeName" name="OfficeName" required placeholder="사업자등록증상 상호명을 입력해주세요">
                                    <p class="field-hint">사업자등록증에 기재된 정식 상호명을 입력해주세요.</p>
                                </div>
                                
                                <div class="form-group">
                                    <label for="storeCategory">매장 카테고리 <span class="required">*</span></label>
                                    <select id="storeCategory" name="StoreCategory" required>
                                        <option value="">카테고리를 선택해주세요</option>
                                        <option value="한식">한식</option>
                                        <option value="중식">중식</option>
                                        <option value="일식">일식</option>
                                        <option value="양식">양식</option>
                                        <option value="카페">카페</option>
                                        <option value="분식">분식</option>
                                        <option value="베이커리">베이커리</option>
                                        <option value="술집">술집</option>
                                        <option value="아시안">아시안</option>
                                        <option value="샐러드">샐러드</option>
                                        <option value="간식">간식</option>
                                        <option value="디저트">디저트</option>
                                    </select>
                                    <p class="field-hint">매장의 주요 음식 카테고리를 선택해주세요.</p>
                                </div>
                                
                                <div class="form-group">
                                    <label for="storeContact">매장 연락처 <span class="required">*</span></label>
                                    <input type="tel" id="storeContact" name="StoreContact" placeholder="02-0000-0000 또는 010-0000-0000" required>
                                    <p class="field-hint">고객 문의가 가능한 연락처를 입력해주세요.</p>
                                </div>

                                <div class="form-group">
                                    <label for="businessNumber">사업자등록번호 <span class="required">*</span></label>
                                    <div class="business-number-group">
                                        <input type="text" id="businessNumber" name="StoreBusinessNum" required placeholder="000-00-00000" maxlength="12">
                                        <button type="button" class="btn-secondary business-verify-btn">확인</button>
                                    </div>
                                    <p class="field-hint">사업자등록번호를 정확히 입력해주세요. (하이픈 포함)</p>
                                </div>
                                
                                <div class="form-group">
                                    <label for="storeComment">매장 설명 및 비고 <span class="optional">(선택)</span></label>
                                    <textarea id="storeComment" name="StoreComment" rows="4" placeholder="매장의 특징, 주요 메뉴, 추가 정보 등을 자유롭게 작성해주세요.&#10;&#10;예시:&#10;- 특징: 수제 파스타와 피자 전문점&#10;- 추천 메뉴: 크림 파스타, 마르게리타 피자&#10;- 기타: 단체 예약 시 할인 제공"></textarea>
                                    <p class="field-hint">매장을 소개할 수 있는 내용을 자유롭게 작성해주세요. (최대 500자)</p>
                                </div>
                            </div>
                        </section>
                        
                        <!-- 주소 정보 섹션 -->
                        <section class="register-section">
                            <div class="section-header">
                                <h2><i class="fas fa-map-marker-alt"></i> 주소 정보</h2>
                            </div>
                            <div class="section-content">
                                <div class="form-group">
                                    <label for="storePostcode">우편번호 <span class="required">*</span></label>
                                    <div class="address-input">
                                        <input type="text" id="storePostcode" name="StorePostalCode" placeholder="우편번호" required readonly>
                                        <button type="button" class="btn-secondary address-search-btn">주소검색</button>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="storeAddress">주소 <span class="required">*</span></label>
                                    <input type="text" id="storeAddress" name="StoreAddr" placeholder="주소" required readonly>
                                </div>

                                <div class="form-group">
                                    <label for="storeDetailAddress">상세주소</label>
                                    <input type="text" id="storeDetailAddress" name="StoreStreetAddr" placeholder="상세주소 (건물명, 층수 등)">
                                </div>
                                
                                <div class="form-group">
                                    <label for="storeExtraAddress">참고항목</label>
                                    <input type="text" id="storeExtraAddress" name="StoreAdditionalInfo" placeholder="참고항목" readonly>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <!-- 오른쪽 추가 정보 영역 -->
                    <div class="register-right">
                        <!-- 이미지 업로드 섹션 -->
                        <section class="register-section">
                            <div class="section-header">
                                <h2><i class="fas fa-images"></i> 매장 이미지</h2>
                            </div>
                            <div class="section-content">
                                <div class="image-upload-area">
                                    <div class="current-image">
                                        <img id="storeImagePreview" src="../_images/default-store.png" alt="매장 이미지 미리보기">
                                    </div>
                                    <div class="upload-controls">
                                        <input type="file" id="storeImage" name="StoreImage" accept="image/*" style="display: none;">
                                        <button type="button" id="image-upload-btn" class="btn-secondary">이미지 선택</button>
                                        <button type="button" id="image-remove-btn" class="btn-cancel">이미지 삭제</button>
                                        <p class="upload-note">권장 크기: 800x600px, 최대 5MB<br>JPG, PNG, GIF 파일만 업로드 가능</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <!-- 편의시설 섹션 -->
                        <section class="register-section">
                            <div class="section-header">
                                <h2><i class="fas fa-concierge-bell"></i> 편의시설</h2>
                            </div>
                            <div class="section-content">
                                <div class="facilities-grid">
                                    <div class="facility-card" data-value="주차 가능">
                                        <input type="checkbox" id="parking" name="facilities" value="주차 가능">
                                        <label for="parking" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-parking"></i>
                                            </div>
                                            <span class="facility-text">주차 가능</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="예약 가능">
                                        <input type="checkbox" id="reservation" name="facilities" value="예약 가능">
                                        <label for="reservation" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-calendar-check"></i>
                                            </div>
                                            <span class="facility-text">예약 가능</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="포장 가능">
                                        <input type="checkbox" id="takeout" name="facilities" value="포장 가능">
                                        <label for="takeout" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-shopping-bag"></i>
                                            </div>
                                            <span class="facility-text">포장 가능</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="배달 가능">
                                        <input type="checkbox" id="delivery" name="facilities" value="배달 가능">
                                        <label for="delivery" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-motorcycle"></i>
                                            </div>
                                            <span class="facility-text">배달 가능</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="테라스 좌석">
                                        <input type="checkbox" id="terrace" name="facilities" value="테라스 좌석">
                                        <label for="terrace" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-umbrella-beach"></i>
                                            </div>
                                            <span class="facility-text">테라스 좌석</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="단체석">
                                        <input type="checkbox" id="groupSeating" name="facilities" value="단체석">
                                        <label for="groupSeating" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-users"></i>
                                            </div>
                                            <span class="facility-text">단체석</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="키즈 존">
                                        <input type="checkbox" id="kidsZone" name="facilities" value="키즈 존">
                                        <label for="kidsZone" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-baby"></i>
                                            </div>
                                            <span class="facility-text">키즈 존</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="무선 인터넷">
                                        <input type="checkbox" id="wifi" name="facilities" value="무선 인터넷">
                                        <label for="wifi" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-wifi"></i>
                                            </div>
                                            <span class="facility-text">무선 인터넷</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="반려동물 동반 가능">
                                        <input type="checkbox" id="petFriendly" name="facilities" value="반려동물 동반 가능">
                                        <label for="petFriendly" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="fas fa-paw"></i>
                                            </div>
                                            <span class="facility-text">반려동물 동반</span>
                                        </label>
                                    </div>
                                    <div class="facility-card" data-value="24시간 운영">
                                        <input type="checkbox" id="hour24" name="facilities" value="24시간 운영">
                                        <label for="hour24" class="facility-label">
                                            <div class="facility-icon">
                                                <i class="far fa-clock"></i>
                                            </div>
                                            <span class="facility-text">24시간 운영</span>
                                        </label>
                                    </div>
                                </div>
                                <p class="field-hint">매장에서 제공하는 편의시설을 선택해주세요.</p>
                            </div>
                        </section>

                        <!-- 운영 시간 섹션 -->
                        <section class="register-section">
                            <div class="section-header">
                                <h2><i class="fas fa-clock"></i> 운영 시간</h2>
                            </div>
                            <div class="section-content">
                                <div class="operating-hours">
                                    <!-- 월요일 -->
                                    <div class="day-row">
                                        <div class="day-label">월요일</div>
                                        <div class="time-inputs">
                                            <select name="mondayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="mondayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- 화요일 -->
                                    <div class="day-row">
                                        <div class="day-label">화요일</div>
                                        <div class="time-inputs">
                                            <select name="tuesdayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="tuesdayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- 수요일 -->
                                    <div class="day-row">
                                        <div class="day-label">수요일</div>
                                        <div class="time-inputs">
                                            <select name="wednesdayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="wednesdayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- 목요일 -->
                                    <div class="day-row">
                                        <div class="day-label">목요일</div>
                                        <div class="time-inputs">
                                            <select name="thursdayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="thursdayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- 금요일 -->
                                    <div class="day-row">
                                        <div class="day-label">금요일</div>
                                        <div class="time-inputs">
                                            <select name="fridayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="fridayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- 토요일 -->
                                    <div class="day-row">
                                        <div class="day-label">토요일</div>
                                        <div class="time-inputs">
                                            <select name="saturdayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="saturdayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <!-- 일요일 -->
                                    <div class="day-row">
                                        <div class="day-label">일요일</div>
                                        <div class="time-inputs">
                                            <select name="sundayOpen" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                            <span>~</span>
                                            <select name="sundayClose" class="time-select">
                                                <!-- JavaScript로 동적 생성 -->
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <p class="field-hint">운영시간을 설정해주세요. 휴무일은 '휴무'를 선택하세요.</p>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- 액션 버튼 -->
                <div class="form-actions">
                    <button type="submit" id="register-btn" class="btn-primary">매장 등록하기</button>
                </div>

                <!-- 숨겨진 필드 (JavaScript에서 생성될 문자열 데이터) -->
                <input type="hidden" name="StoreFacilities" id="storeFacilities">
                <input type="hidden" name="StoreSchedule" id="storeSchedule">
            </form>
        </div>
    </main>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>