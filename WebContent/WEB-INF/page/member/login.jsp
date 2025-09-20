<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 로그인</title>
	<link rel="stylesheet" href="../_css/login.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="../_js/login.js" defer></script>
</head>
<body>
	<!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main>
        <!-- 로그인 섹션 -->
        <section class="login-section">
            <div class="container">
                <div class="login-container">
                    <div class="login-header">
                        <h1>로그인</h1>
                        <p>HonestPick에 오신 것을 환영합니다</p>
                    </div>
                    
                    <form id="login-form" class="login-form" method="post" action="${path}/Member_servlet/loginProc.do">
                        <div class="form-group">
                            <label for="MemberId">아이디</label>
                            <div class="input-with-icon">
                                <i class="fas fa-user"></i>
                                <input type="text" id="MemberId" name="MemberId" placeholder="아이디를 입력하세요" required>
                            </div>
                            <span class="error-message" id="id-error"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="MemberPwd">비밀번호</label>
                            <div class="input-with-icon">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="MemberPwd" name="MemberPwd" placeholder="비밀번호를 입력하세요" required>
                                <button type="button" class="toggle-password" aria-label="비밀번호 표시"><i class="fas fa-eye"></i></button>
                            </div>
                            <span class="error-message" id="password-error"></span>
                        </div>
                        
                        <div class="form-options">
                            <div class="remember-me">
                                <input type="checkbox" id="remember-me" name="remember-me">
                                <label for="remember-me">로그인 상태 유지</label>
                                <!-- 히든 필드를 JSP에서 직접 추가 -->
                                <input type="hidden" name="rememberMeValue" id="rememberMeValue" value="N">
                            </div>
                            <a href="forgot-password.jsp" class="forgot-password">비밀번호 찾기</a>
                        </div>
                        
                        <button type="submit" class="btn btn-primary btn-block">로그인</button>
                        
                        <div class="login-divider">
                            <span>또는</span>
                        </div>
                        
                        <div class="social-login">
                            <button type="button" class="btn btn-social btn-kakao">
                                <i class="fas fa-comment"></i> 카카오 로그인
                            </button>
                            <button type="button" class="btn btn-social btn-naver">
                                <i class="fas fa-play"></i> 네이버 로그인
                            </button>
                            <button type="button" class="btn btn-social btn-google">
		                        <i class="fab fa-google"></i> Google 로그인
		                    </button>
                        </div>
                        
                        <div class="signup-link">
                            <p>아직 회원이 아니신가요? <a href="${path}/Member_servlet/join.do">회원가입</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>