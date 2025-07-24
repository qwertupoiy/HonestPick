<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="_inc_JSTL.jsp" %>
<%@ include file="call.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../_css/header.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
	<c:if test="${not empty alertMsg}">
	    <script>
	        alert("${alertMsg}");
	    </script>
	</c:if>

	<!-- Header 영역 -->
	<header class="header-main">
	    <div class="header-container">
	        <!-- 로고 영역 -->
	        <div class="header-logo">
	            <a href="${path}/Home_servlet/home.do" aria-label="홈으로 이동">
	                <img src="${path}/_image/HonestPick_Logo.jpg" alt="HonestPick 로고">
	            </a>
	        </div>
	
	        <!-- 내비게이션 메뉴 -->
	        <nav class="header-nav">
	            <ul class="header-nav-list">
	                <li class="header-nav-item"><a href="${path}/Store_servlet/storeList.do" class="header-nav-link">맛집 목록</a></li>
	                <li class="header-nav-item">
	                    <!-- 검색 폼으로 변경 -->
	                    <form action="${path}/Store_servlet/storeList.do" method="get" class="header-search-container">
	                    	<c:choose>
		                    	<c:when test="${not empty searchKeyword}">
		                    		<input type="text" name="searchKeyword" placeholder="${searchKeyword}" class="header-search-input" aria-label="맛집 검색">
		                    	</c:when>
		                    	<c:otherwise>
		                    		<input type="text" name="searchKeyword" placeholder="맛집 검색" class="header-search-input" aria-label="맛집 검색">
		                    	</c:otherwise>
	                    	</c:choose>
	                        <button type="submit" class="header-search-button" aria-label="검색"><i class="fas fa-search"></i></button>
	                    </form>
	                </li>
	            </ul>
	        </nav>
	
	        <!-- 로그인 및 회원가입 버튼 -->
	        <div class="header-auth-buttons">
	            <c:choose>
		            <c:when test="${not empty sessionScope.MemberNo}">
		            	<!-- 개선된 사용자 인사말 -->
		            	<div class="user-welcome">
		            	    <i class="fas fa-user-circle welcome-icon"></i>
		            	    <span class="welcome-text">${sessionScope.MemberNickname}님 환영해요!</span>
		            	</div>
			            <a href="${path}/Member_servlet/logout.do" class="header-btn header-btn-logout" aria-label="로그아웃">
			                <i class="fas fa-sign-out-alt"></i>
			                로그아웃
			            </a>
			            <a href="${path}/Mypage_servlet/changeInfo.do?MemberNo=${sessionScope.MemberNo}" class="header-btn header-btn-outline" aria-label="마이페이지로 이동">
			                <i class="fas fa-user-cog"></i>
			                마이페이지
			            </a>
		            </c:when>
		            <c:otherwise>
		            	<a href="${path}/Member_servlet/login.do" class="header-btn header-btn-primary" aria-label="로그인 페이지로 이동">
		            	    <i class="fas fa-sign-in-alt"></i>
		            	    로그인
		            	</a>
			            <a href="${path}/Member_servlet/join.do" class="header-btn header-btn-outline" aria-label="회원가입 페이지로 이동">
			                <i class="fas fa-user-plus"></i>
			                회원가입
			            </a>
		            </c:otherwise>
		        </c:choose>
	            <c:if test="${sessionScope.Admin > 0}">
		            <a href="${path}/Admin_servlet/storeAdd.do?MemberNo=${sessionScope.MemberNo}" class="header-btn header-btn-register" aria-label="가게 등록하기">
		                <i class="fas fa-store btn-icon"></i>
		                가게 등록하기
		            </a>
	            </c:if>
	            <c:if test="${sessionScope.Admin > 1}">
		            <a href="${path}/Admin_servlet/admin_home.do" class="header-btn header-btn-register" aria-label="관리자 페이지">
		                <i class="fas fa-cog btn-icon"></i>
		                관리자
		            </a>
	            </c:if>
	        </div>
	    </div>
	</header>
</body>
</html>