<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="_inc_JSTL.jsp" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../_css/admin_header.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
	<script src="../_js/admin_header.js"></script>
</head>
<body>
	<c:if test="${not empty alertMsg}">
	    <script>
	        alert("${alertMsg}");
	    </script>
	</c:if>
	
	<!-- 관리자 전용 헤더 -->
	<header class="admin-header">
	    <div class="admin-nav-container">
	        <!-- 관리자 로고 영역 -->
	        <div class="admin-logo">
	            <a href="${path}/Admin_servlet/admin_home.do" aria-label="관리자 대시보드로 이동">
	                <h2>
	                    <i class="fas fa-cogs"></i>
	                    <span>HonestPick 관리자</span>
	                </h2>
	            </a>
	        </div>
	        
	        <!-- 관리자 네비게이션 메뉴 -->
	        <nav class="admin-nav" role="navigation" aria-label="관리자 메뉴">
	            <ul class="admin-nav-menu">
	                <!-- 메인 페이지로 이동 -->
	                <li class="nav-item">
	                    <a href="${path}/Home_servlet/home.do" class="nav-link main-page-btn" aria-label="메인 페이지로 이동">
	                        <i class="fas fa-home"></i>
	                        <span>웹사이트</span>
	                    </a>
	                </li>
	                
	                <!-- 통계 리포트 -->
	                <li class="nav-item">
	                    <a href="${path}/Admin_servlet/admin_home.do" class="nav-link" aria-label="통계 리포트">
	                        <i class="fas fa-headset menu-icon"></i>
	                        <span>문의 현황</span>
	                    </a>
	                </li>
	                
	                <!-- 회원 관리 -->
	                <li class="nav-item">
	                    <a href="${path}/Admin_servlet/admin_member.do" class="nav-link" aria-label="회원 관리">
	                        <i class="fas fa-users"></i>
	                        <span>회원 관리</span>
	                    </a>
	                </li>
	                
	                <!-- 가게 관리 -->
	                <li class="nav-item">
	                    <a href="${path}/Admin_servlet/admin_stores.do" class="nav-link" aria-label="가게 관리">
	                        <i class="fas fa-store"></i>
	                        <span>가게 관리</span>
	                    </a>
	                </li>
	                
	                <!-- 광고 관리 -->
	                <li class="nav-item">
	                    <a href="${path}/Admin_servlet/admin_ads.do" class="nav-link" aria-label="광고 관리">
	                        <i class="fas fa-bullhorn"></i>
	                        <span>광고 관리</span>
	                    </a>
	                </li>
	            </ul>
	        </nav>
	        
	        <!-- 관리자 사용자 메뉴 -->
	        <div class="admin-user-menu">
	            <div class="user-info">
	                <span class="user-name">
	                    <i class="fas fa-user-shield"></i>
	                    <span>관리자님</span>
	                </span>
	                <a href="${path}/Member_servlet/logout.do" class="logout-btn" aria-label="로그아웃">
	                    <i class="fas fa-sign-out-alt"></i>
	                    <span>로그아웃</span>
	                </a>
	            </div>
	        </div>
	    </div>
	</header>
</body>
</html>