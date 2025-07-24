<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마이 페이지</title>
    <link rel="stylesheet" href="../_css/my_changeInfo.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="../_js/my_changeInfo.js"></script>
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
                    <div class="form-container">
                        <h3 class="form-title">회원정보 수정</h3>
                        <form id="userInfoForm" method="post" action="${path}/Mypage_servlet/changeInfoProc.do?MemberNo=${dtoResult.memberNo}" enctype="multipart/form-data">
                            
                            <!-- 기본 정보와 프로필 사진 -->
                            <div class="basic-info-section">
                                <div class="basic-info-fields">
                                    <div class="form-group">
                                        <label class="form-label">회원번호</label>
                                        <input type="text" class="form-input" value="${dtoResult.memberNo}" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">이름</label>
                                        <input type="text" class="form-input" value="${dtoResult.memberName}" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">아이디</label>
                                        <input type="text" class="form-input" value="${dtoResult.memberId}" disabled>
                                    </div>
                                </div>
                                <div class="profile-section">
                                    <div class="profile-image-container">
                                        <img src="${path}/attach/${dtoResult.memberImage}" alt="프로필 이미지" class="profile-image" id="profileImagePreview">
                                        <label for="profileImage" class="change-image-btn">
                                            <i class="fas fa-camera"></i> 변경
                                        </label>
                                        <input type="file" id="profileImage" name="MemberImage" style="display: none;" accept="image/*">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 닉네임 (중복 체크) -->
                            <div class="form-group">
                                <label class="form-label" for="nickname">닉네임</label>
                                <div class="input-group">
                                    <div class="input-with-button">
                                        <input type="text" id="nickname" name="MemberNickname" class="form-input" value="${dtoResult.memberNickname}" placeholder="닉네임을 입력하세요">
                                    </div>
                                    <button type="button" class="btn btn-outline" id="checkNickname">중복 확인</button>
                                </div>
                                <div class="validation-message" id="nicknameValidation"></div>
                            </div>
                            
                            <!-- 비밀번호 -->
                            <div class="form-group">
                                <label class="form-label" for="currentPassword">현재 비밀번호</label>
                                <input type="password" id="currentPassword" name="currentPassword" class="form-input" placeholder="현재 비밀번호를 입력하세요">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="newPassword">새 비밀번호</label>
                                <input type="password" id="newPassword" name="newPassword" class="form-input" placeholder="새 비밀번호를 입력하세요">
                                <div class="validation-message">8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="confirmPassword">새 비밀번호 확인</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" placeholder="새 비밀번호를 다시 입력하세요">
                                <div class="validation-message" id="passwordValidation"></div>
                            </div>
                            
                            <!-- 전화번호 -->
                            <div class="form-group">
                                <label class="form-label" for="phoneNumber">전화번호</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" class="form-input" value="${dtoResult.phoneNumber}" placeholder="예: 010-1234-5678">
                            </div>
                            
                            <!-- 이메일 -->
                            <div class="form-group">
                                <label class="form-label" for="MemberEmail">이메일</label>
                                <input type="text" id="MemberEmail" name="MemberEmail" class="form-input" value="${dtoResult.memberEmail}" placeholder="예: abc12@naver.com">
                            </div>
                            
                            <!-- 주소 -->
                            <div class="form-group">
                                <label class="form-label">주소</label>
                                <div class="address-section">
                                    <div class="address-group">
                                        <div class="input-group">
                                            <div class="input-with-button">
                                                <input type="text" id="postalCode" name="MemberPostalCode" class="form-input" value="${dtoResult.memberPostalCode}" placeholder="우편번호" readonly>
                                            </div>
                                            <button type="button" class="btn btn-outline" id="searchAddress">주소 검색</button>
                                        </div>
                                    </div>
                                    <div class="address-group">
                                        <input type="text" id="address" name="MemberAddr" class="form-input" value="${dtoResult.memberAddr}" placeholder="기본 주소" readonly>
                                    </div>
                                    <div class="address-group">
                                        <input type="text" id="streetAddress" name="MemberStreetAddr" class="form-input" value="${dtoResult.memberStreetAddr}" placeholder="상세 주소">
                                    </div>
                                    <div class="address-group">
                                        <input type="text" id="additionalInfo" name="MemberAdditionalInfo" class="form-input" value="${dtoResult.memberAdditionalInfo}" placeholder="참고 항목">
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
                                <div class="right-buttons">
                                    <button type="submit" class="btn btn-primary">정보 수정</button>
                                    <a href="${path}/Mypage_servlet/changeInfoRemove.do?MemberNo=${dtoResult.memberNo}" class="btn btn-danger" onclick="return confirm('정말로 회원탈퇴를 하시겠습니까?');">회원 탈퇴</a>
                                </div>
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