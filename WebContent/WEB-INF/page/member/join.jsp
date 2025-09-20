<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원가입 - HonestPick</title>
    <link rel="stylesheet" href="../_css/join.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="../_js/join.js" defer></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main>
        <section class="join-section">
            <div class="container">
                <div class="join-content">
                    <form id="joinForm" class="join-form" action="${path}/Member_servlet/joinProc.do" method="post" enctype="multipart/form-data" style="display: contents;">
                        
                        <!-- 메인 폼 영역 (2단 레이아웃) -->
                        <div class="join-main-form">
                            <!-- 왼쪽 기본 정보 영역 -->
                            <div class="join-left">
                                <!-- 기본 정보 섹션 -->
                                <div class="join-section-card">
                                    <div class="section-header">
                                        <h2><i class="fas fa-user-edit"></i> 기본 정보</h2>
                                    </div>
                                    <div class="section-content">
                                        <!-- 아이디 입력 -->
                                        <div class="form-group">
                                            <label for="userId">아이디 <span class="required">*</span></label>
                                            <div class="input-with-button">
                                                <input type="text" id="userId" name="MemberId" required placeholder="아이디를 입력해주세요.">
                                                <button type="button" class="btn btn-outline id-check-btn">중복확인</button>
                                            </div>
                                            <p class="field-hint">영문, 숫자 조합 6-20자</p>
                                        </div>

                                        <!-- 비밀번호 입력 -->
                                        <div class="form-group">
                                            <label for="userPw">비밀번호 <span class="required">*</span></label>
                                            <input type="password" id="userPw" name="MemberPwd" required placeholder="비밀번호를 입력해주세요.">
                                            <p class="field-hint">영문, 숫자, 특수문자 조합 8-20자</p>
                                        </div>

                                        <!-- 비밀번호 확인 -->
                                        <div class="form-group">
                                            <label for="userPwConfirm">비밀번호 확인 <span class="required">*</span></label>
                                            <input type="password" id="userPwConfirm" name="MemberPwdChk" required placeholder="비밀번호를 다시 입력해주세요.">
                                        </div>
                                        
                                        <!-- 닉네임 입력 -->
                                        <div class="form-group">
                                            <label for="userNickname">닉네임 <span class="required">*</span></label>
                                            <div class="input-with-button">
                                                <input type="text" id="userNickname" name="MemberNickname" required placeholder="닉네임을 입력해주세요.">
                                                <button type="button" class="btn btn-outline nickname-check-btn">중복확인</button>
                                            </div>
                                            <p class="field-hint">2-10자 이내로 입력해주세요. (특수문자 사용 가능)</p>
                                        </div>

                                        <!-- 이름 입력 -->
                                        <div class="form-group">
                                            <label for="userName">이름 <span class="required">*</span></label>
                                            <input type="text" id="userName" name="MemberName" required placeholder="이름을 입력해주세요.">
                                        </div>

                                        <!-- 전화번호 입력 -->
                                        <div class="form-group">
                                            <label for="userPhone">전화번호 <span class="required">*</span></label>
                                            <input type="tel" id="userPhone" name="PhoneNumber" placeholder="010-0000-0000" required>
                                        </div>

                                        <!-- 이메일 입력 -->
                                        <div class="form-group">
                                            <label for="userEmail">이메일 <span class="required">*</span></label>
                                            <input type="email" id="userEmail" name="MemberEmail" placeholder="example@mail.com">
                                        </div>
                                    </div>
                                </div>

                                <!-- 주소 정보 섹션 -->
                                <div class="join-section-card">
                                    <div class="section-header">
                                        <h2><i class="fas fa-map-marker-alt"></i> 주소 정보</h2>
                                    </div>
                                    <div class="section-content">
                                        <!-- 주소 입력 -->
                                        <div class="form-group">
                                            <label for="postcode">우편번호 <span class="required">*</span></label>
                                            <div class="input-with-button">
                                                <input type="text" id="postcode" name="MemberPostalCode" placeholder="우편번호" required readonly>
                                                <button type="button" class="btn btn-outline address-search-btn">주소검색</button>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="address">주소 <span class="required">*</span></label>
                                            <input type="text" id="address" name="MemberAddr" placeholder="주소" required readonly>
                                        </div>

                                        <div class="form-group">
                                            <label for="detailAddress">상세주소</label>
                                            <input type="text" id="detailAddress" name="MemberStreetAddr" placeholder="상세주소" class="address-input">
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="extraAddress">참고항목</label>
                                            <input type="text" id="extraAddress" name="MemberAdditionalInfo" placeholder="참고항목" class="address-input" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 오른쪽 추가 정보 영역 -->
                            <div class="join-right">
                                <!-- 프로필 사진 섹션 -->
                                <div class="join-section-card">
                                    <div class="section-header">
                                        <h2><i class="fas fa-camera"></i> 프로필 사진</h2>
                                    </div>
                                    <div class="section-content">
                                        <div class="profile-upload-area">
                                            <div class="profile-preview-container">
                                                <div class="profile-preview">
                                                    <img id="profilePreview" src="../_images/default-profile.png" alt="프로필 미리보기">
                                                </div>
                                            </div>
                                            <div class="profile-upload-controls">
                                                <input type="file" id="profileImage" name="MemberImage" accept="image/*" class="profile-file-input">
                                                <label for="profileImage" class="btn btn-outline profile-upload-btn">
                                                    <i class="fas fa-camera"></i> 사진 선택
                                                </label>
                                                <button type="button" class="btn btn-outline profile-remove-btn">
                                                    <i class="fas fa-times"></i> 삭제
                                                </button>
                                                <p class="field-hint" style="text-align: center; margin-top: 10px;">
                                                    권장 크기: 200x200px<br>JPG, PNG 파일만 업로드 가능
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 회원 유형 선택 섹션 -->
                                <div class="join-section-card">
                                    <div class="section-header">
                                        <h2><i class="fas fa-user-tag"></i> 회원 유형</h2>
                                    </div>
                                    <div class="section-content">
                                        <div class="user-type-selection">
                                            <div class="user-type-option">
                                                <input type="radio" id="userType1" name="Admin" value="normal" checked>
                                                <label for="userType1">
                                                    <div class="icon-container">
                                                        <i class="fas fa-user"></i>
                                                    </div>
                                                    <div class="user-type-content">
                                                        <span class="user-type-title">일반 회원</span>
                                                        <span class="user-type-desc">맛집을 탐색하고 리뷰를 작성할 수 있어요</span>
                                                    </div>
                                                </label>
                                            </div>

                                            <div class="user-type-option">
                                                <input type="radio" id="userType2" name="Admin" value="owner">
                                                <label for="userType2">
                                                    <div class="icon-container">
                                                        <i class="fas fa-store"></i>
                                                    </div>
                                                    <div class="user-type-content">
                                                        <span class="user-type-title">사업자 회원</span>
                                                        <span class="user-type-desc">매장을 등록하고 관리할 수 있어요</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 약관 동의 섹션 -->
                                <div class="join-section-card">
                                    <div class="section-header">
                                        <h2><i class="fas fa-file-contract"></i> 약관 동의</h2>
                                    </div>
                                    <div class="section-content">
                                        <div class="terms-content">
                                            <div class="checkbox-group all-agree">
                                                <input type="checkbox" id="agreeAll" name="agreeAll">
                                                <label for="agreeAll"><strong>모든 약관에 동의합니다</strong></label>
                                            </div>

                                            <div class="checkbox-group">
                                                <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                                                <label for="agreeTerms">이용약관 동의 <span class="required">(필수)</span></label>
                                                <button type="button" class="terms-view-btn">보기</button>
                                            </div>

                                            <div class="checkbox-group">
                                                <input type="checkbox" id="agreePrivacy" name="agreePrivacy" required>
                                                <label for="agreePrivacy">개인정보 수집 및 이용 동의 <span class="required">(필수)</span></label>
                                                <button type="button" class="terms-view-btn">보기</button>
                                            </div>

                                            <div class="checkbox-group">
                                                <input type="checkbox" id="agreeLocation" name="agreeLocation" required>
                                                <label for="agreeLocation">위치기반 서비스 이용약관 동의 <span class="required">(필수)</span></label>
                                                <button type="button" class="terms-view-btn">보기</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 소셜 로그인 버튼들 -->
                                        <div class="social-login-container in-right">
                                            <p>또는 소셜 계정으로 간편가입</p>
                                            <div class="social-login-buttons">
                                                <button type="button" class="btn btn-social btn-kakao">
                                                    <i class="fas fa-comment"></i> 카카오로 시작하기
                                                </button>
                                                <button type="button" class="btn btn-social btn-naver">
                                                    <i class="fas fa-play"></i> 네이버로 시작하기
                                                </button>
                                                <button type="button" class="btn btn-social btn-google">
                                                    <i class="fab fa-google"></i> Google로 시작하기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 하단 버튼 영역 -->
                        <div class="join-bottom">
                            <!-- 등록하기 버튼 -->
                            <div class="form-buttons">
                                <button type="submit" class="btn btn-primary register-btn">회원가입</button>
                            </div>
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