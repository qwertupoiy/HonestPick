<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 회원 관리</title>
    <link rel="stylesheet" href="../_css/admin_member.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- 관리자 헤더 -->
    <%@ include file="../_include/admin_header.jsp" %>

    <div class="admin-container">
        <main class="admin-main">
            <!-- 페이지 헤더 -->
            <div class="page-header">
                <div class="header-content">
                    <div class="header-left">
                        <h1 class="page-title">
                            <i class="fas fa-users"></i>
                            회원 관리
                        </h1>
                        <p class="page-subtitle">가입된 회원들을 관리하고 통계를 확인할 수 있습니다.</p>
                    </div>
                </div>
            </div>

            <!-- 통계 카드 -->
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-icon users">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${listOut[0]}</div>
                        <div class="stat-label">총 회원수</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +${listOut[1]} 이번 주
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon general">
                        <i class="fas fa-user-friends"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${listOut[2]}</div>
                        <div class="stat-label">일반 회원</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +${listOut[3]} 이번 주
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon owners">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${listOut[4]}</div>
                        <div class="stat-label">점주 회원</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +${listOut[5]} 이번 주
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon inactive">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${dtoCounting.unabledMemberTotalCount}</div>
                        <div class="stat-label">비활성 회원</div>
                        <div class="stat-change negative">
                            <i class="fas fa-arrow-down"></i>
                            -${dtoCounting.unabledMemberWeekCount} 이번 주
                        </div>
                    </div>
                </div>
            </div>

            <!-- 회원 목록 테이블 -->
            <div class="content-section">
                <div class="data-table-container">
                    <div class="table-header">
                        <div class="table-info">
                            <i class="fas fa-list"></i>
                            총 <strong>
                                <c:choose>
                                    <c:when test="${not empty listAdmin}">
                                        ${fn:length(listAdmin)}
                                    </c:when>
                                    <c:otherwise>0</c:otherwise>
                                </c:choose>
                            </strong>명의 회원
                        </div>
                    </div>
                    <div class="table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th class="checkbox-col">
                                        <input type="checkbox">
                                    </th>
                                    <th class="profile-col">회원번호</th>
                                    <th class="profile-col">프로필</th>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>회원 유형</th>
                                    <th>가입일</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody id="membersTableBody">
                                <c:choose>
                                    <c:when test="${empty listAdmin or fn:length(listAdmin) == 0}">
                                        <tr>
                                            <td colspan="8" style="text-align:center; padding: 40px;">
                                                <div style="color: var(--admin-text-light);">
                                                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                                                    <p style="font-size: 1.1rem; margin-bottom: 5px;">등록된 회원이 없습니다.</p>
                                                    <p style="font-size: 0.9rem;">새 회원을 추가해보세요.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </c:when>
                                    <c:otherwise>
                                        <c:forEach var="member" items="${listAdmin}" varStatus="loop">
                                            <tr data-member-id="${member.memberNo}" class="table-row">
                                                <td class="checkbox-col">
                                                    <input type="checkbox" class="member-checkbox" 
                                                           value="${member.memberNo}" 
                                                           onchange="toggleMemberSelection(${member.memberNo})">
                                                </td>
                                                <td>#${member.memberNo}</td>
                                                <td class="profile-col">
                                                    <c:choose>
                                                        <c:when test="${not empty member.memberImage and member.memberImage ne 'member_none.jpg'}">
                                                            <img src="${path}/attach/${member.memberImage}" 
                                                                 alt="${member.memberName} 프로필" 
                                                                 class="profile-img">
                                                        </c:when>
                                                        <c:otherwise>
                                                            <img src="${path}/_images/default-profile.png" 
                                                                 alt="기본 프로필" 
                                                                 class="profile-img">
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <a href="#" class="member-name-link" 
                                                       data-memberno="${member.memberNo}"
                                                       data-membername="${member.memberName}" 
                                                       data-memberemail="${member.memberEmail}" 
                                                       data-phonenumber="${member.phoneNumber}" 
                                                       data-admin="${member.admin}" 
                                                       data-memberregidate="${member.memberRegidate}" 
                                                       data-memberid="${member.memberId}" 
                                                       data-membernickname="${member.memberNickname}" 
                                                       data-memberpostalcode="${member.memberPostalCode}" 
                                                       data-memberaddr="${member.memberAddr}" 
                                                       data-memberstreetaddr="${member.memberStreetAddr}" 
                                                       data-memberadditionalinfo="${member.memberAdditionalInfo}" 
                                                       data-memberimage="${(not empty member.memberImage and member.memberImage ne 'member_none.jpg') ? path.concat('/attach/').concat(member.memberImage) : path.concat('/_images/default-profile.png')}"
                                                       onclick="openMemberDetailFromData(this)">
                                                        ${member.memberName}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href="mailto:${member.memberEmail}" 
                                                       style="color: var(--admin-primary-color); text-decoration: none;">
                                                        ${member.memberEmail}
                                                    </a>
                                                </td>
                                                <td>
                                                    <span class="type-badge 
													    ${member.admin eq '0' ? 'general' : 
													     (member.admin eq '1' ? 'owner' : 
													     (member.admin eq '2' ? 'admin' : ''))}">
													    <i class="fas fa-${member.admin eq '0' ? 'user' : 
													                     (member.admin eq '1' ? 'user-tie' : 
													                     (member.admin eq '2' ? 'user-shield' : 'question-circle'))}"></i>
													    ${member.admin eq '0' ? '일반회원' : 
													      (member.admin eq '1' ? '점주' : 
													      (member.admin eq '2' ? '관리자' : '알수없음'))}
													</span>
                                                </td>
                                                <td>${member.memberRegidate}</td>
                                                <td class="action-col">
                                                    <div class="action-buttons">
                                                        <button class="action-btn view" onclick="viewMemberDetail(${member.memberNo})" title="상세 보기">
                                                            <i class="fas fa-eye"></i>
                                                        </button>
                                                        <button class="action-btn edit" onclick="editMemberInfo(${member.memberNo})" title="편집">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                        <button class="action-btn delete" onclick="deleteMemberConfirm(${member.memberNo}, '${member.memberName}')" title="삭제">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </c:forEach>
                                    </c:otherwise>
                                </c:choose>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 회원 상세 모달 -->
    <div id="memberModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user-edit"></i> 회원 상세 정보</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="memberDetailForm" action="${path}/Mypage_servlet/changeInfoProc.do" method="post" enctype="multipart/form-data">
                    <!-- Hidden Fields - 폼 전송 시 필요한 모든 데이터 -->
                    <input type="hidden" name="MemberNo" id="memberNoHidden" value="">
                    <input type="hidden" name="MemberId" id="hiddenMemberId" value="">
                    
                    <!-- 메인 폼 영역 (2단 레이아웃) -->
                    <div class="member-detail-main-form">
                        <!-- 왼쪽 기본 정보 영역 -->
                        <div class="member-detail-left">
                            <!-- 기본 정보 섹션 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-user-edit"></i> 기본 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <!-- 아이디 입력 (읽기 전용) -->
                                    <div class="form-group">
                                        <label for="modalUserId">아이디</label>
                                        <input type="text" id="modalUserId" value="" readonly>
                                        <p class="field-hint">아이디는 변경할 수 없습니다.</p>
                                    </div>

                                    <!-- 닉네임 입력 -->
                                    <div class="form-group">
                                        <label for="modalUserNickname">닉네임</label>
                                        <input type="text" id="modalUserNickname" name="MemberNickname" value="" readonly>
                                        <p class="field-hint">2-10자 이내로 입력해주세요. (특수문자 사용 가능)</p>
                                    </div>

                                    <!-- 이름 입력 (수정 불가) -->
                                    <div class="form-group">
                                        <label for="modalUserName">이름</label>
                                        <input type="text" id="modalUserName" name="MemberName" value="" readonly>
                                        <p class="field-hint">이름은 변경할 수 없습니다.</p>
                                    </div>

                                    <!-- 전화번호 입력 -->
                                    <div class="form-group">
                                        <label for="modalUserPhone">전화번호</label>
                                        <input type="tel" id="modalUserPhone" name="phoneNumber" value="" readonly>
                                    </div>

                                    <!-- 이메일 입력 -->
                                    <div class="form-group">
                                        <label for="modalUserEmail">이메일</label>
                                        <input type="email" id="modalUserEmail" name="MemberEmail" value="" readonly>
                                    </div>
                                </div>
                            </div>

                            <!-- 주소 정보 섹션 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-map-marker-alt"></i> 주소 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <!-- 주소 입력 -->
                                    <div class="form-group">
                                        <label for="modalPostcode">우편번호</label>
                                        <input type="text" id="modalPostcode" name="MemberPostalCode" value="" readonly>
                                    </div>

                                    <div class="form-group">
                                        <label for="modalAddress">주소</label>
                                        <input type="text" id="modalAddress" name="MemberAddr" value="" readonly>
                                    </div>

                                    <div class="form-group">
                                        <label for="modalDetailAddress">상세주소</label>
                                        <input type="text" id="modalDetailAddress" name="MemberStreetAddr" value="" readonly>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="modalExtraAddress">참고항목</label>
                                        <input type="text" id="modalExtraAddress" name="MemberAdditionalInfo" value="" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 오른쪽 추가 정보 영역 -->
                        <div class="member-detail-right">
                            <!-- 프로필 사진 섹션 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-camera"></i> 프로필 사진</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="profile-upload-area">
                                        <div class="profile-preview-container">
                                            <div class="profile-preview">
                                                <img id="modalProfilePreview" src="${path}/_images/default-profile.png" alt="프로필 미리보기">
                                            </div>
                                        </div>
                                        <p class="field-hint" style="text-align: center; margin-top: 10px;">
                                            회원 프로필 사진
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- 회원 유형 선택 섹션 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-user-tag"></i> 회원 유형</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="user-type-selection">
                                        <div class="user-type-option">
                                            <input type="radio" id="modalUserType1" name="Admin" value="0" disabled>
                                            <label for="modalUserType1">
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
                                            <input type="radio" id="modalUserType2" name="Admin" value="1" disabled>
                                            <label for="modalUserType2">
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

                            <!-- 가입 정보 섹션 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-info-circle"></i> 가입 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="form-group">
                                        <label for="modalJoinDate">가입일</label>
                                        <input type="text" id="modalJoinDate" value="" readonly>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="modalMemberStatus">회원 상태</label>
                                        <input type="text" id="modalMemberStatus" value="활성" readonly>
                                        <p class="field-hint">현재 회원의 활동 상태입니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- 하단 버튼 영역 -->
            <div class="modal-bottom">
                <div class="form-buttons">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> 닫기
                    </button>
                    <button type="button" class="btn btn-primary" id="editBtn" onclick="enableEdit()">
                        <i class="fas fa-edit"></i> 정보 수정
                    </button>
                    <button type="button" class="btn btn-danger" onclick="deleteMemberFromModal()">
                        <i class="fas fa-trash"></i> 회원 삭제
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 로딩 스피너 -->
    <div id="loadingSpinner" class="loading-spinner" style="display: none;">
        <div class="spinner">
            <i class="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>처리 중...</p>
    </div>

    <!-- JavaScript 파일 포함 -->
    <script src="../_js/admin_member.js"></script>
    
    <!-- 초기화 스크립트 -->
    <script>
        // 전역 변수 설정
        var path = '${pageContext.request.contextPath}';
        
        // 디버깅을 위한 테스트 함수
        function testModal() {
            console.log('Testing modal...');
            var modal = document.getElementById('memberModal');
            if (modal) {
                console.log('Modal found, showing...');
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                console.error('Modal not found!');
            }
        }
        
        // 페이지 로드 시 초기화
        document.addEventListener('DOMContentLoaded', function() {
            console.log('회원 관리 페이지 로드 완료');
            console.log('Path:', path);
            
            // 모달 존재 확인
            var modal = document.getElementById('memberModal');
            console.log('Modal element:', modal);
            
            // 테스트 버튼 클릭 시 모달 열기 (디버깅용)
            // testModal();
        });
    </script>
</body>
</html>