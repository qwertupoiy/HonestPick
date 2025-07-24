<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="_inc_JSTL.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../_css/myPage_sidebar.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="../_js/myPage_sidebar.js"></script>
</head>
<body>
	<div class="sidebar">
	    <ul class="menu-list">
	        <li class="menu-item">
	            <a href="${path}/Mypage_servlet/changeInfo.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="changeInfo">
	                <i class="fas fa-user menu-icon"></i> 회원정보 수정
	            </a>
	        </li>
	        <c:if test="${sessionScope.Admin != null and sessionScope.Admin > 0}"> 
		        <li class="menu-item">
		            <a href="${path}/Mypage_servlet/storeList.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="storeList">
		                <i class="fas fa-store menu-icon"></i> 내 매장 보기
		            </a>
		        </li>
	        </c:if>
	        <li class="menu-item">
	            <a href="${path}/Mypage_servlet/wishList.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="wishList">
	                <i class="fas fa-heart menu-icon"></i> 찜한 맛집
	            </a>
	        </li>
	        <li class="menu-item">
	            <a href="${path}/Mypage_servlet/reservationInfo.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="reservationInfo">
	                <i class="fas fa-calendar-check menu-icon"></i> 예약내역
	            </a>
	        </li>
	        <li class="menu-item">
	            <a href="${path}/Mypage_servlet/visitList.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="visitList">
	                <i class="fas fa-history menu-icon"></i> 방문 기록
	            </a>
	        </li>
	        <li class="menu-item">
	            <a href="${path}/Mypage_servlet/reviewList.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="reviewList">
	                <i class="fas fa-comment menu-icon"></i> 나의 리뷰
	            </a>
	        </li>
	        <li class="menu-item">
	            <a href="${path}/Mypage_servlet/inquiryList.do?MemberNo=${sessionScope.MemberNo}" class="menu-link" data-page="inquiryList">
	                <i class="fas fa-headset menu-icon"></i> 나의 문의
	            </a>
	        </li>
	    </ul>
	</div>
</body>
</html>