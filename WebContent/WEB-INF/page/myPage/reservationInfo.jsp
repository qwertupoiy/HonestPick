<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이 페이지</title>
    <link rel="stylesheet" href="../_css/my_reservationInfo.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
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
                    <!-- 회원정보 수정 폼 -->
                    <div class="form-container tab-content" id="userInfoContent">
                        <h3 class="form-title">회원정보 수정</h3>
                        <form id="userInfoForm">
                            <!-- 기본 정보 -->
                            <div class="form-group">
                                <label class="form-label">회원번호</label>
                                <input type="text" class="form-input" value="10001" disabled>
                            </div>
                            <div class="form-group">
                                <label class="form-label">이름</label>
                                <input type="text" class="form-input" value="홍길동" disabled>
                            </div>
                            <div class="form-group">
                                <label class="form-label">아이디</label>
                                <input type="text" class="form-input" value="honggildong" disabled>
                            </div>
                            
                            <!-- 닉네임 (중복 체크) -->
                            <div class="form-group">
                                <label class="form-label" for="nickname">닉네임</label>
                                <div class="input-group">
                                    <div class="input-with-button">
                                        <input type="text" id="nickname" class="form-input" value="맛집탐험가" placeholder="닉네임을 입력하세요">
                                    </div>
                                    <button type="button" class="btn btn-outline" id="checkNickname">중복 확인</button>
                                </div>
                                <div class="validation-message" id="nicknameValidation"></div>
                            </div>
                            
                            <!-- 비밀번호 -->
                            <div class="form-group">
                                <label class="form-label" for="currentPassword">현재 비밀번호</label>
                                <input type="password" id="currentPassword" class="form-input" placeholder="현재 비밀번호를 입력하세요">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="newPassword">새 비밀번호</label>
                                <input type="password" id="newPassword" class="form-input" placeholder="새 비밀번호를 입력하세요">
                                <div class="validation-message">8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="confirmPassword">새 비밀번호 확인</label>
                                <input type="password" id="confirmPassword" class="form-input" placeholder="새 비밀번호를 다시 입력하세요">
                                <div class="validation-message" id="passwordValidation"></div>
                            </div>
                            
                            <!-- 전화번호 -->
                            <div class="form-group">
                                <label class="form-label" for="phoneNumber">전화번호</label>
                                <input type="tel" id="phoneNumber" class="form-input" value="010-1234-5678" placeholder="예: 010-1234-5678">
                            </div>
                            
                            <!-- 주소 -->
                            <div class="form-group">
                                <label class="form-label">주소</label>
                                <div class="input-group">
                                    <div class="input-with-button">
                                        <input type="text" id="postalCode" class="form-input" placeholder="우편번호" readonly>
                                    </div>
                                    <button type="button" class="btn btn-outline" id="searchAddress">주소 검색</button>
                                </div>
                                <div class="address-section">
                                    <div class="address-group">
                                        <input type="text" id="address" class="form-input" placeholder="기본 주소" readonly>
                                    </div>
                                    <div class="address-group">
                                        <input type="text" id="streetAddress" class="form-input" placeholder="상세 주소">
                                    </div>
                                    <div class="address-group">
                                        <input type="text" id="additionalInfo" class="form-input" placeholder="참고 항목">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 본인인증 -->
                            <div class="form-group">
                                <div class="form-check">
                                    <input type="checkbox" id="confirmIdentity" class="form-check-input">
                                    <label for="confirmIdentity">본인인증을 위해 개인정보 수집 및 이용에 동의합니다.</label>
                                </div>
                            </div>
                            
                            <!-- 버튼 영역 -->
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary">취소</button>
                                <button type="submit" class="btn btn-primary">정보 수정</button>
                            </div>
                        </form>
                    </div>

                    <!-- 예약내역 컨텐츠 -->
                    <div class="reservations-container tab-content active" id="reservationsContent">
                        <h3 class="form-title">예약내역</h3>
                        
                        <!-- 예약내역 탭 -->
                        <div class="reservations-tabs">
                            <div class="reservations-tab active" data-status="all">전체</div>
                            <div class="reservations-tab" data-status="confirmed">예약확정</div>
                            <div class="reservations-tab" data-status="pending">예약대기</div>
                            <div class="reservations-tab" data-status="completed">방문완료</div>
                            <div class="reservations-tab" data-status="cancelled">취소</div>
                        </div>
                        
                        <!-- 필터링 옵션 -->
                        <div class="reservation-filters">
                            <select class="filter-select" id="sortFilter">
                                <option value="recent">최신순</option>
                                <option value="old">오래된순</option>
                                <option value="name">가게명순</option>
                            </select>
                            <select class="filter-select" id="periodFilter">
                                <option value="all">전체 기간</option>
                                <option value="1month">1개월</option>
                                <option value="3months">3개월</option>
                                <option value="6months">6개월</option>
                                <option value="1year">1년</option>
                            </select>
                        </div>
                        
                        <jsp:useBean id="now" class="java.util.Date" scope="page" />
                        <!-- 예약카드 목록 -->
                        <div class="reservation-cards">
                            <!-- 예약확정 카드 -->
                            <c:if test="${fn:length(listRes) == 0}">
                            	<p>예약된 내역이 없습니다.</p>
                            </c:if>
                            <c:forEach var="listReservation" items="${listRes}">
								<div class="reservation-card" data-status="confirmed">
	                                <img src="${path}/attach/${listReservation.storeImageName}" class="reservation-image" onclick="location.href='${path}/Store_servlet/restaurantDetail.do?StoreNo=${listReservation.storeNo}'">
	                                <div class="reservation-content">
	                                    <c:choose>
										    <c:when test="${listReservation.reservationDateTime.time < now.time}">
										        <span class="reservation-status status-completed">방문완료</span>
										    </c:when>
										    <c:otherwise>
										        <span class="reservation-status status-confirmed">예약확정</span>
										    </c:otherwise>
										</c:choose>
	                                    <h4 class="reservation-title">${listReservation.storeName}</h4>
	                                    <div class="reservation-details">
	                                        <div class="detail-item">
	                                            <span class="detail-label">예약번호</span>
	                                            <span>${listReservation.resNo}</span>
	                                        </div>
	                                        <div class="detail-item">
	                                            <span class="detail-label">예약일시</span>
	                                            <span>
	                                            	<fmt:formatDate value="${listReservation.reservationDateTime}" pattern="yyyy년 MM월 dd일 HH:mm"/>
	                                            </span>
	                                        </div>
	                                        <div class="detail-item">
	                                            <span class="detail-label">인원</span>
	                                            <span>${listReservation.resPeople}명</span>
	                                        </div>
	                                    </div>
	                                    <div class="reservation-actions">
	                                        <div class="action-btn btn-modify">
	                                        	<a href="${path}/Mypage_servlet/reservationInfoUpdate.do?resNo=${listReservation.resNo}">예약변경</a>
	                                        </div>
	                                        <div class="action-btn btn-cancel">
	                                        	<a href="${path}/Mypage_servlet/reservationInfoDeleteProc.do?resNo=${listReservation.resNo}">예약취소</a>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                        </c:forEach>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	
	<!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>