<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 음식점 정보 수정</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="../_css/storeEdit.css">
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="../_js/storeEdit.js"></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main class="store-edit-main">
        <div class="container">            
            <form id="store-edit-form" action="${path}/Admin_servlet/storeEditProc.do" method="post" enctype="multipart/form-data">
                <input type="hidden" name="StoreNo" value="${dtoStore.storeNo}">
                
                <div class="edit-content">
                    <!-- 왼쪽 기본 정보 영역 -->
                    <div class="edit-left">
                        <!-- 기본 정보 섹션 -->
                        <section class="edit-section">
                            <div class="section-header">
                                <h2><i class="fas fa-store"></i> 기본 정보</h2>
                            </div>
                            <div class="section-content">
                                <div class="form-group">
                                    <label for="storeName">음식점명 <span class="required">*</span></label>
                                    <input type="text" id="storeName" name="StoreName" value="${dtoStore.storeName}" required>
                                    <p class="field-hint">고객에게 표시될 음식점 이름입니다.</p>
                                </div>

                                <div class="form-group">
                                    <label for="officeName">상호명 <span class="required">*</span></label>
                                    <input type="text" id="officeName" name="OfficeName" value="${dtoStore.officeName}" required placeholder="사업자등록증상 상호명을 입력해주세요">
                                    <p class="field-hint">사업자등록증에 기재된 정식 상호명을 입력해주세요.</p>
                                </div>
                                
                                <div class="form-group">
                                    <label for="storeCategory">카테고리 <span class="required">*</span></label>
                                    <select id="storeCategory" name="StoreCategory" required>
                                        <option value="">카테고리를 선택하세요</option>
                                        <option value="한식" ${dtoStore.storeCategory == '한식' ? 'selected' : ''}>한식</option>
                                        <option value="중식" ${dtoStore.storeCategory == '중식' ? 'selected' : ''}>중식</option>
                                        <option value="일식" ${dtoStore.storeCategory == '일식' ? 'selected' : ''}>일식</option>
                                        <option value="양식" ${dtoStore.storeCategory == '양식' ? 'selected' : ''}>양식</option>
                                        <option value="카페" ${dtoStore.storeCategory == '카페' ? 'selected' : ''}>카페</option>
                                        <option value="분식" ${dtoStore.storeCategory == '분식' ? 'selected' : ''}>분식</option>
                                        <option value="베이커리" ${dtoStore.storeCategory == '베이커리' ? 'selected' : ''}>베이커리</option>
                                        <option value="술집" ${dtoStore.storeCategory == '술집' ? 'selected' : ''}>술집</option>
                                        <option value="아시안" ${dtoStore.storeCategory == '아시안' ? 'selected' : ''}>아시안</option>
                                        <option value="샐러드" ${dtoStore.storeCategory == '샐러드' ? 'selected' : ''}>샐러드</option>
                                        <option value="간식" ${dtoStore.storeCategory == '간식' ? 'selected' : ''}>간식</option>
                                        <option value="디저트" ${dtoStore.storeCategory == '디저트' ? 'selected' : ''}>디저트</option>
                                    </select>
                                    <p class="field-hint">음식점의 주요 음식 카테고리를 선택해주세요.</p>
                                </div>
                                
                                <div class="form-group">
                                    <label for="storePhone">전화번호</label>
                                    <input type="tel" id="storePhone" name="StoreContact" value="${dtoStore.storeContact}" placeholder="예: 02-1234-5678 또는 010-1234-5678">
                                    <p class="field-hint">고객 문의가 가능한 연락처를 입력해주세요.</p>
                                </div>

                                <div class="form-group">
                                    <label for="businessNumber">사업자등록번호 <span class="required">*</span></label>
                                    <div class="business-number-group">
                                        <input type="text" id="businessNumber" name="StoreBusinessNum" value="${dtoStore.storeBusinessNum}" required placeholder="000-00-00000" maxlength="12">
                                    </div>
                                    <p class="field-hint">사업자등록번호를 정확히 입력해주세요. (하이픈 포함)</p>
                                </div>
                                
                                <div class="form-group">
                                    <label for="storeDescription">소개글</label>
                                    <textarea id="storeDescription" name="StoreComment" rows="4" placeholder="음식점을 소개하는 글을 작성하세요">${dtoStore.storeComment}</textarea>
                                    <p class="field-hint">매장의 특징, 주요 메뉴, 추가 정보 등을 자유롭게 작성해주세요. (최대 500자)</p>
                                </div>
                            </div>
                        </section>
                        
                        <!-- 주소 정보 섹션 -->
                        <section class="edit-section">
                            <div class="section-header">
                                <h2><i class="fas fa-map-marker-alt"></i> 주소 정보</h2>
                            </div>
                            <div class="section-content">
                                <div class="form-group">
                                    <label for="postcode">우편번호 <span class="required">*</span></label>
                                    <div class="address-input">
                                        <input type="text" id="postcode" name="StorePostalCode" value="${dtoStore.storePostalCode}" readonly>
                                        <button type="button" id="address-search-btn" class="btn-secondary">우편번호 찾기</button>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="address">주소 <span class="required">*</span></label>
                                    <input type="text" id="address" name="StoreAddr" value="${dtoStore.storeAddr}" required readonly>
                                </div>

                                <div class="form-group">
                                    <label for="detailAddress">상세주소</label>
                                    <input type="text" id="detailAddress" name="StoreStreetAddr" value="${dtoStore.storeStreetAddr}" placeholder="상세 주소를 입력하세요">
                                </div>
                                
                                <div class="form-group">
                                    <label for="extraAddress">참고항목</label>
                                    <input type="text" id="extraAddress" name="StoreAdditionalInfo" value="${dtoStore.storeAdditionalInfo}" readonly>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <!-- 오른쪽 추가 정보 영역 -->
                    <div class="edit-right">
                        <!-- 이미지 업로드 섹션 -->
                        <section class="edit-section">
                            <div class="section-header">
                                <h2><i class="fas fa-images"></i> 이미지 관리</h2>
                            </div>
                            <div class="section-content">
                                <div class="image-upload-area">
                                    <div class="current-image">
                                        <img id="preview-image" src="${path}/attach/${dtoStore.storeImage}" alt="현재 이미지">
                                    </div>
                                    <div class="upload-controls">
                                        <input type="file" id="storeImage" name="StoreImage" accept="image/*" style="display: none;">
                                        <button type="button" id="image-upload-btn" class="btn-secondary">이미지 변경</button>
                                        <button type="button" id="image-remove-btn" class="btn-cancel">이미지 삭제</button>
                                        <p class="upload-note">권장 크기: 800x600px, 최대 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <!-- 편의시설 섹션 - register 스타일 적용 -->
                        <section class="edit-section">
                            <div class="section-header">
							    <h2><i class="fas fa-concierge-bell"></i> 편의시설</h2>
							</div>
							<div class="section-content">
							    <div class="facilities-grid">
							        <div class="facility-card" data-value="주차 가능">
							            <input type="checkbox" id="parking" name="StoreFacilities" value="주차 가능"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '주차 가능')}">checked</c:if>>
							            <label for="parking" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-parking"></i>
							                </div>
							                <span class="facility-text">주차 가능</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="예약 가능">
							            <input type="checkbox" id="reservation" name="StoreFacilities" value="예약 가능"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '예약 가능')}">checked</c:if>>
							            <label for="reservation" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-calendar-check"></i>
							                </div>
							                <span class="facility-text">예약 가능</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="포장 가능">
							            <input type="checkbox" id="takeout" name="StoreFacilities" value="포장 가능"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '포장 가능')}">checked</c:if>>
							            <label for="takeout" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-shopping-bag"></i>
							                </div>
							                <span class="facility-text">포장 가능</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="배달 가능">
							            <input type="checkbox" id="delivery" name="StoreFacilities" value="배달 가능"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '배달 가능')}">checked</c:if>>
							            <label for="delivery" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-motorcycle"></i>
							                </div>
							                <span class="facility-text">배달 가능</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="테라스 좌석">
							            <input type="checkbox" id="terrace" name="StoreFacilities" value="테라스 좌석"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '테라스 좌석')}">checked</c:if>>
							            <label for="terrace" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-umbrella-beach"></i>
							                </div>
							                <span class="facility-text">테라스 좌석</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="단체석">
							            <input type="checkbox" id="groupSeating" name="StoreFacilities" value="단체석"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '단체석')}">checked</c:if>>
							            <label for="groupSeating" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-users"></i>
							                </div>
							                <span class="facility-text">단체석</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="키즈 존">
							            <input type="checkbox" id="kidsZone" name="StoreFacilities" value="키즈 존"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '키즈 존')}">checked</c:if>>
							            <label for="kidsZone" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-baby"></i>
							                </div>
							                <span class="facility-text">키즈 존</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="무선 인터넷">
							            <input type="checkbox" id="wifi" name="StoreFacilities" value="무선 인터넷"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '무선 인터넷')}">checked</c:if>>
							            <label for="wifi" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-wifi"></i>
							                </div>
							                <span class="facility-text">무선 인터넷</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="반려동물 동반 가능">
							            <input type="checkbox" id="pet" name="StoreFacilities" value="반려동물 동반 가능"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '반려동물 동반 가능')}">checked</c:if>>
							            <label for="pet" class="facility-label">
							                <div class="facility-icon">
							                    <i class="fas fa-paw"></i>
							                </div>
							                <span class="facility-text">반려동물 동반</span>
							            </label>
							        </div>
							        <div class="facility-card" data-value="24시간 운영">
							            <input type="checkbox" id="hour24" name="StoreFacilities" value="24시간 운영"
							                <c:if test="${fn:contains(fn:join(Facilities, ', '), '24시간 운영')}">checked</c:if>>
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
                        <section class="edit-section">
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
						                        <option value="" <c:if test="${listSchedule[0] == '휴무' || listSchedule[0] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[0] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="mondayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[1] == '휴무' || listSchedule[1] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[1] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                </div>
						            </div>
						            
						            <!-- 화요일 -->
						            <div class="day-row">
						                <div class="day-label">화요일</div>
						                <div class="time-inputs">
						                    <select name="tuesdayOpen" class="time-select">
						                        <option value="" <c:if test="${listSchedule[2] == '휴무' || listSchedule[2] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[2] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="tuesdayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[3] == '휴무' || listSchedule[3] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[3] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                </div>
						            </div>
						            
						            <!-- 수요일 -->
						            <div class="day-row">
						                <div class="day-label">수요일</div>
						                <div class="time-inputs">
						                    <select name="wednesdayOpen" class="time-select">
						                        <option value="" <c:if test="${listSchedule[4] == '휴무' || listSchedule[4] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[4] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="wednesdayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[5] == '휴무' || listSchedule[5] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[5] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                </div>
						            </div>
						            
						            <!-- 목요일 -->
						            <div class="day-row">
						                <div class="day-label">목요일</div>
						                <div class="time-inputs">
						                    <select name="thursdayOpen" class="time-select">
						                        <option value="" <c:if test="${listSchedule[6] == '휴무' || listSchedule[6] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[6] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="thursdayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[7] == '휴무' || listSchedule[7] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[7] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                </div>
						            </div>
						            
						            <!-- 금요일 -->
						            <div class="day-row">
						                <div class="day-label">금요일</div>
						                <div class="time-inputs">
						                    <select name="fridayOpen" class="time-select">
						                        <option value="" <c:if test="${listSchedule[8] == '휴무' || listSchedule[8] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[8] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="fridayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[9] == '휴무' || listSchedule[9] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[9] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                </div>
						            </div>
						            
						            <!-- 토요일 -->
						            <div class="day-row">
						                <div class="day-label">토요일</div>
						                <div class="time-inputs">
						                    <select name="saturdayOpen" class="time-select">
						                        <option value="" <c:if test="${listSchedule[10] == '휴무' || listSchedule[10] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[10] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="saturdayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[11] == '휴무' || listSchedule[11] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[11] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                </div>
						            </div>
						            
						            <!-- 일요일 -->
						            <div class="day-row">
						                <div class="day-label">일요일</div>
						                <div class="time-inputs">
						                    <select name="sundayOpen" class="time-select">
						                        <option value="" <c:if test="${listSchedule[12] == '휴무' || listSchedule[12] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[12] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
						                    </select>
						                    <span>~</span>
						                    <select name="sundayClose" class="time-select">
						                        <option value="" <c:if test="${listSchedule[13] == '휴무' || listSchedule[13] == ''}">selected</c:if>>휴무</option>
						                        <c:forEach var="hour" begin="0" end="23">
						                            <c:forEach var="minute" items="00,30">
						                                <c:set var="timeValue" value="${hour}:${minute}" />
						                                <option value="${timeValue}" <c:if test="${listSchedule[13] == timeValue}">selected</c:if>>${timeValue}</option>
						                            </c:forEach>
						                        </c:forEach>
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
                    <button type="button" id="cancel-btn" class="btn-cancel">취소</button>
                    <button type="submit" id="save-btn" class="btn-primary">저장하기</button>
                </div>

                <!-- 현재 데이터를 위한 숨겨진 필드들 -->
                <input type="hidden" name="currentFacilities" value="${store.facilities}">
                <input type="hidden" name="currentOperatingHours" value="${store.operatingHours}">
                
                <!-- JavaScript에서 생성될 문자열 데이터를 위한 숨겨진 필드들 -->
                <input type="hidden" name="StoreFacilitiesString" value="">
                <input type="hidden" name="StoreScheduleString" value="">
            </form>
        </div>
    </main>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>