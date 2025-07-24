<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>예약 변경</title>
    <link rel="stylesheet" href="../_css/my_reservationInfoUpdate.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/my_reservationInfoUpdate.js"></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- 예약변경 섹션 -->
    <section class="mypage-section">
        <div class="container">
            <div class="mypage-header">
                <h2>예약 변경</h2>
            </div>
            
            <div class="modification-content">
                <!-- 현재 예약 정보 -->
                <div class="current-reservation-info">
                    <h3 class="section-title">
                        <i class="fas fa-info-circle"></i>
                        현재 예약 정보
                    </h3>
                    <div class="current-info-card">
                        <img src="${path}/attach/${dtoRes.storeImageName}" alt="음식점 이미지" class="current-image">
                        <div class="current-details">
                            <h4 class="store-name">${dtoRes.storeName}</h4>
                            <div class="current-item">
                                <span class="label">예약일시:</span>
                                <span class="value">
                                    <fmt:formatDate value="${dtoRes.reservationDateTime}" pattern="yyyy년 MM월 dd일 HH:mm"/>
                                </span>
                            </div>
                            <div class="current-item">
                                <span class="label">인원:</span>
                                <span class="value">${dtoRes.resPeople}명</span>
                            </div>
                            <div class="current-item">
                                <span class="label">예약번호:</span>
                                <span class="value">${dtoRes.resNo}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 예약 변경 폼 -->
                <div class="modification-form-section">
                    <h3 class="section-title">
                        <i class="fas fa-edit"></i>
                        예약 정보 변경
                    </h3>
                    <div class="form-container">
                        <form class="reservation-form" method="post" action="${path}/Mypage_servlet/reservationInfoUpdateProc.do?resNo=${dtoRes.resNo}">
                            <input type="hidden" name="MemberNo" value="${sessionScope.MemberNo}">
                            <input type="hidden" name="StoreNo" value="${dtoRes.storeNo}">
                            <input type="hidden" name="resNo" value="${dtoRes.resNo}">
                            
                            <!-- 날짜 선택 -->
                            <div class="form-group">
                                <label><i class="fas fa-calendar-alt"></i> 변경할 날짜</label>
                                <input type="date" id="reservation-date" name="date" value="${dtoRes.resDate}" class="form-input">
                                <div class="help-text">현재: <fmt:formatDate value="${dtoRes.reservationDateTime}" pattern="yyyy년 MM월 dd일"/></div>
                            </div>
                            
                            <!-- 시간 선택 -->
                            <div class="form-group">
                                <label><i class="fas fa-clock"></i> 변경할 시간</label>
                                <select class="form-input time-select" name="time">
								    <option value="" disabled>시간을 선택하세요</option>
								    <option value="11:00" ${dtoRes.resTime == '11:00' ? 'selected' : ''}>11:00 (오전)</option>
								    <option value="12:00" ${dtoRes.resTime == '12:00' ? 'selected' : ''}>12:00 (점심)</option>
								    <option value="13:00" ${dtoRes.resTime == '13:00' ? 'selected' : ''}>13:00 (오후)</option>
								    <option value="18:00" ${dtoRes.resTime == '18:00' ? 'selected' : ''}>18:00 (저녁)</option>
								    <option value="19:00" ${dtoRes.resTime == '19:00' ? 'selected' : ''}>19:00 (저녁)</option>
								    <option value="20:00" ${dtoRes.resTime == '20:00' ? 'selected' : ''}>20:00 (저녁)</option>
								</select>
                                <div class="help-text">현재: <fmt:formatDate value="${dtoRes.reservationDateTime}" pattern="HH:mm"/></div>
                            </div>
                            
                            <!-- 인원수 선택 -->
                            <div class="form-group">
                                <label><i class="fas fa-users"></i> 변경할 인원</label>
                                <div class="counter-group">
                                    <button type="button" class="counter-btn decrease-btn">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="counter-value" name="people">${dtoRes.resPeople}</span>
                                    <button type="button" class="counter-btn increase-btn">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <!-- 실제 form 제출을 위한 hidden input 추가 -->
                                <input type="hidden" name="peopleCount" value="${dtoRes.resPeople}" class="people-count-input">
                                <div class="help-text">현재: ${dtoRes.resPeople}명</div>
                            </div>
                            
                            <!-- 예약 코멘트 추가 -->
                            <div class="form-group">
                                <label><i class="fas fa-comment-dots"></i> 요청사항</label>
                                <textarea 
                                    class="form-textarea reservation-comment" 
                                    name="resComment" 
                                    rows="3" 
                                    placeholder="알레르기, 특별한 요청사항, 축하 메시지 등을 입력해주세요 (선택사항)"
                                    maxlength="200">${dtoRes.resComment}</textarea>
                                <div class="comment-counter">
                                    <span class="current-length">0</span>/<span class="max-length">200</span>자
                                </div>
                            </div>
                            
                            <!-- 변경 사유 -->
							<div class="form-group">
							    <label><i class="fas fa-question-circle"></i> 변경 사유 (선택사항)</label>
							    <textarea 
							        class="form-textarea change-reason" 
							        name="changeReason" 
							        rows="2" 
							        placeholder="예약 변경 사유를 입력해주세요"
							        maxlength="100">${dtoRes.changeReason}
							    </textarea>
							    <div class="comment-counter">
							        <span class="reason-length">0</span>/<span class="max-length">100</span>자
							    </div>
							</div>
                            
                            <!-- 버튼 영역 -->
                            <div class="form-actions">
                                <button type="button" class="cancel-btn" onclick="location.href='${path}/Mypage_servlet/myInfo_reservationInfo.do?MemberNo=${sessionScope.MemberNo}'">
								    <i class="fas fa-arrow-left"></i>
								    취소
								</button>
                                <button type="submit" class="reservation-submit-btn">
                                    <i class="fas fa-check"></i>
                                    예약 변경하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>