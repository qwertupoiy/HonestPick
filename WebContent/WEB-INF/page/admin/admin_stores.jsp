<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 가게 관리</title>
    <link rel="stylesheet" href="../_css/admin_stores.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- 관리자 헤더 -->
    <%@ include file="../_include/admin_header.jsp" %>

    <div class="admin-container">
        <main class="admin-main">
        	<!-- 
            서브 네비게이션
            <div class="sub-nav">
                <div class="sub-nav-container">
                    <div class="sub-nav-items">
                        <button class="sub-nav-btn active" data-section="all">
                            <i class="fas fa-store"></i>
                            <span>가게 현황</span>
                        </button>
                        <button class="sub-nav-btn" data-section="pending">
                            <i class="fas fa-clock"></i>
                            <span>승인 대기</span>
                            <span class="nav-badge" id="pendingBadge">0</span>
                        </button>
                        <button class="sub-nav-btn" data-section="new">
                            <i class="fas fa-plus-circle"></i>
                            <span>신규 등록</span>
                            <span class="nav-badge new" id="newBadge">0</span>
                        </button>
                        <button class="sub-nav-btn" data-section="suspended">
                            <i class="fas fa-ban"></i>
                            <span>정지된 가게</span>
                            <span class="nav-badge danger" id="suspendedBadge">0</span>
                        </button>
                    </div>
                </div>
            </div>
			 -->
            <!-- 가게 현황 섹션 -->
            <div id="all-section" class="content-section active">
                <!-- 페이지 헤더 -->
                <div class="page-header">
                    <div class="header-content">
                        <div class="header-left">
                            <h1 class="page-title">
                                <i class="fas fa-store"></i>
                                가게 현황
                            </h1>
                            <p class="page-subtitle">등록된 모든 가게들을 관리하고 통계를 확인할 수 있습니다.</p>
                        </div>
                    </div>
                </div>

                <!-- 통계 카드 -->
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-icon stores">
                            <i class="fas fa-store"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="totalStores">${listOut[0]}</div>
                            <div class="stat-label">총 가게수</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +${listOut[1]} 이번 주
                            </div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon approved">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="approvedStores">${listOut[0]}</div>
                            <div class="stat-label">승인된 가게</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +${listOut[1]} 이번 주
                            </div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon pending">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="pendingStores">0</div>
                            <div class="stat-label">승인 대기</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +0 이번 주
                            </div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon rating">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${listOut[2]}</div>
                            <div class="stat-label">평균 평점</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +${listOut[3]} 이번 달
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 필터 및 검색 섹션 -->
                <div class="content-body">
                    <div class="content-header">
                        <div class="filter-section">
                            <h3 class="section-title">카테고리 필터</h3>
                            <div class="filter-buttons">
                                <button class="filter-btn active" data-filter="all">
                                    <i class="fas fa-list"></i>
                                    전체
                                </button>
                                <button class="filter-btn" data-filter="korean">
                                    <i class="fas fa-bowl-rice"></i>
                                    한식
                                </button>
                                <button class="filter-btn" data-filter="chinese">
                                    <i class="fas fa-utensils"></i>
                                    중식
                                </button>
                                <button class="filter-btn" data-filter="japanese">
                                    <i class="fas fa-fish"></i>
                                    일식
                                </button>
                                <button class="filter-btn" data-filter="western">
                                    <i class="fas fa-hamburger"></i>
                                    양식
                                </button>
                                <button class="filter-btn" data-filter="cafe">
                                    <i class="fas fa-coffee"></i>
                                    카페
                                    Comment : ${store.storeComment} 
                                </button>
                            </div>
                        </div>
                        
                        <div class="search-section">
                            <h3 class="section-title">검색</h3>
                            <div class="search-controls">
                                <select id="searchType" class="search-select">
                                    <option value="all">전체</option>
                                    <option value="name">가게명</option>
                                    <option value="owner">점주명</option>
                                    <option value="location">지역</option>
                                </select>
                                <div class="search-input-group">
                                    <input type="text" id="searchInput" placeholder="검색어를 입력하세요" class="search-input">
                                    <button class="search-btn" onclick="performSearch()">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 일괄 작업 바 -->
                    <div class="bulk-actions" id="bulkActions" style="display: none;">
                        <div class="bulk-info">
                            <i class="fas fa-check-square"></i>
                            <span id="selectedCount">0</span>개 항목 선택됨
                        </div>
                        <div class="bulk-buttons">
                            <button class="btn btn-success btn-sm" onclick="bulkApprove()">
                                <i class="fas fa-check"></i>
                                승인
                            </button>
                            <button class="btn btn-warning btn-sm" onclick="bulkSuspend()">
                                <i class="fas fa-pause"></i>
                                정지
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="bulkDelete()">
                                <i class="fas fa-trash"></i>
                                삭제
                            </button>
                        </div>
                    </div>

                    <!-- 가게 목록 테이블 -->
                    <div class="data-table-container">
                        <div class="table-header">
                            <div class="table-info">
                                <i class="fas fa-list"></i>
                                총 <strong id="totalCount">${fn:length(listStore)}</strong>개의 가게
                            </div>
                            <div class="table-options">
                                <select id="pageSize" onchange="changePageSize()">
                                    <option value="10">10개씩 보기</option>
                                    <option value="25" selected>25개씩 보기</option>
                                    <option value="50">50개씩 보기</option>
                                    <option value="100">100개씩 보기</option>
                                </select>
                            </div>
                        </div>

                        <div class="table-wrapper">
                            <table class="data-table" id="storesTable">
                                <thead>
                                    <tr>
                                        <th class="checkbox-col">
                                            <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                                        </th>
                                        <th class="sortable">가게번호</th>
                                        <th class="image-col">이미지</th>
                                        <th class="sortable" onclick="sortTable('name')">
                                            가게명
                                            <i class="fas fa-sort sort-icon"></i>
                                        </th>
                                        <th class="sortable" onclick="sortTable('category')">
                                            카테고리
                                            <i class="fas fa-sort sort-icon"></i>
                                        </th>
                                        <th class="sortable" onclick="sortTable('location')">
                                            지역
                                            <i class="fas fa-sort sort-icon"></i>
                                        </th>
                                        <th class="sortable" onclick="sortTable('owner')">
                                            점주
                                            <i class="fas fa-sort sort-icon"></i>
                                        </th>
                                        <th class="sortable" onclick="sortTable('registerDate')">
                                            등록일
                                            <i class="fas fa-sort sort-icon"></i>
                                        </th>
                                        <th>작업</th>
                                    </tr>
                                </thead>
                                <tbody id="storesTableBody">
                                    <!-- 서버에서 가져온 가게 목록 데이터 -->
                                    <c:choose>
                                        <c:when test="${not empty listStore}">
                                            <c:forEach var="store" items="${listStore}" varStatus="status">
                                                <tr class="table-row" data-store-id="${store.storeNo}">
                                                    <td class="checkbox-col">
                                                        <input type="checkbox" class="store-checkbox" 
                                                               value="${store.storeNo}" 
                                                               onchange="toggleStoreSelection(${store.storeNo})">
                                                    </td>
                                                    <td class="image-col">#${store.storeNo}</td>
                                                    <td class="image-col">
                                                        <c:choose>
                                                            <c:when test="${not empty store.storeImage and store.storeImage ne 'store_none.jpg'}">
                                                                <img src="${pageContext.request.contextPath}/attach/${store.storeImage}" 
                                                                     alt="${store.storeName} 이미지" 
                                                                     class="store-img">
                                                            </c:when>
                                                            <c:otherwise>
                                                                <img src="${pageContext.request.contextPath}/attach/none.jpg" 
                                                                     alt="기본 가게 이미지" 
                                                                     class="store-img">
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </td>
                                                    <td>
                                                        <a href="javascript:void(0)" 
                                                           class="store-name-link" 
                                                           data-store-no="${store.storeNo}"
                                                           data-member-no="${store.memberNo}"
                                                           data-store-name="${store.storeName}"
                                                           data-store-category="${store.storeCategory}"
                                                           data-office-name="${store.officeName}"
                                                           data-store-contact="${store.storeContact}"
                                                           data-store-postal-code="${store.storePostalCode}"
                                                           data-store-addr="${store.storeAddr}"
                                                           data-store-street-addr="${store.storeStreetAddr}"
                                                           data-store-additional-info="${store.storeAdditionalInfo}"
                                                           data-store-business-num="${store.storeBusinessNum}"
                                                           data-store-image="<c:choose><c:when test='${not empty store.storeImage and store.storeImage ne "store_none.jpg"}'>${pageContext.request.contextPath}/attach/${store.storeImage}</c:when><c:otherwise>${pageContext.request.contextPath}/_images/default-store.png</c:otherwise></c:choose>"
                                                           data-store-schedule="${store.storeSchedule}"
                                                           data-store-comment="${store.storeComment}"
                                                           data-store-facilities="${store.storeFacilities}"
                                                           data-store-regidate="${store.storeRegidate}"
                                                           data-store-update="${store.storeUpdate}"
                                                           data-owner-name="${store.ownerName}"
                                                           onclick="openStoreDetailFromData(this)"
                                                           data-name="${store.storeName}"
                                                           data-category="${store.storeCategory}"
                                                           data-location="${store.storeAddr}"
                                                           data-owner="${store.ownerName}"
                                                           data-register-date="${store.storeRegidate}">
                                                            ${store.storeName}
                                                        </a>
                                                    </td>
                                                    <td data-category="${store.storeCategory}">
                                                        <span class="category-badge ${store.storeCategory}">
                                                            <c:choose>
                                                                <c:when test="${store.storeCategory == 'korean'}">한식</c:when>
                                                                <c:when test="${store.storeCategory == 'chinese'}">중식</c:when>
                                                                <c:when test="${store.storeCategory == 'japanese'}">일식</c:when>
                                                                <c:when test="${store.storeCategory == 'western'}">양식</c:when>
                                                                <c:when test="${store.storeCategory == 'cafe'}">카페</c:when>
                                                                <c:otherwise>${store.storeCategory}</c:otherwise>
                                                            </c:choose>
                                                        </span>
                                                    </td>
                                                    <td data-location="${store.storeAddr}">${store.storeAddr}</td>
                                                    <td data-owner="${store.ownerName}">${store.ownerName}</td>
                                                    <td data-register-date="${store.storeRegidate}">
                                                        <fmt:formatDate value="${store.storeRegidate}" pattern="yyyy-MM-dd"/>
                                                    </td>
                                                    <td class="action-col">
                                                        <div class="action-buttons">
                                                            <button class="action-btn view" onclick="viewStoreDetail(${store.storeNo})" title="상세 보기">
                                                                <i class="fas fa-eye"></i>
                                                            </button>
                                                            <button class="action-btn edit" onclick="editStoreInfo(${store.storeNo})" title="편집">
                                                                <i class="fas fa-edit"></i>
                                                            </button>
                                                            <button class="action-btn delete" onclick="deleteStoreConfirm(${store.storeNo}, '${store.storeName}')" title="삭제">
                                                                <i class="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </c:when>
                                        <c:otherwise>
                                            <tr>
                                                <td colspan="8" class="no-data">
                                                    <div style="text-align: center; padding: 40px; color: var(--admin-text-light);">
                                                        <i class="fas fa-store" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                                                        <p style="font-size: 1.1rem; margin-bottom: 5px;">등록된 가게가 없습니다</p>
                                                        <p style="font-size: 0.9rem;">새로운 가게를 추가해보세요.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </c:otherwise>
                                    </c:choose>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 페이지네이션 -->
                    <div class="pagination-container">
                        <div class="pagination-info">
                            <i class="fas fa-info-circle"></i>
                            <span id="paginationInfo">1-${fn:length(listStore)} of ${fn:length(listStore)} 가게</span>
                        </div>
                        <div class="pagination" id="pagination">
                            <!-- 페이지네이션은 JavaScript에서 처리 -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- 다른 섹션들 (승인 대기, 신규 등록, 정지된 가게) -->
            <div id="pending-section" class="content-section">
                <div class="page-header">
                    <h1 class="page-title">
                        <i class="fas fa-clock"></i>
                        승인 대기 가게
                    </h1>
                </div>
                <div id="pendingStoresGrid" class="pending-stores-grid">
                    <!-- JavaScript에서 동적 생성 -->
                </div>
            </div>

            <div id="new-section" class="content-section">
                <div class="page-header">
                    <h1 class="page-title">
                        <i class="fas fa-plus-circle"></i>
                        신규 등록 가게
                    </h1>
                </div>
                <div id="newStoresTimeline" class="new-stores-timeline">
                    <!-- JavaScript에서 동적 생성 -->
                </div>
            </div>

            <div id="suspended-section" class="content-section">
                <div class="page-header">
                    <h1 class="page-title">
                        <i class="fas fa-ban"></i>
                        정지된 가게
                    </h1>
                </div>
                <div id="suspendedStoresList" class="suspended-stores-list">
                    <!-- JavaScript에서 동적 생성 -->
                </div>
            </div>
        </main>
    </div>

    <!-- 가게 상세 모달 -->
    <div id="storeModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-store"></i> 가게 상세 정보</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="storeDetailForm" action="${path }/Admin_servlet/storeEditProc.do" method="post" enctype="multipart/form-data">
                    <!-- Hidden Fields -->
                    <input type="hidden" name="StoreNo" id="storeNoHidden" value="">
                    <input type="hidden" name="MemberNo" id="hiddenMemberNo" value="">
                    
                    <!-- 메인 폼 영역 -->
                    <div class="store-detail-main-form">
                        <!-- 왼쪽 영역 -->
                        <div class="store-detail-left">
                            <!-- 기본 정보 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-info-circle"></i> 기본 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="form-group">
                                        <label for="modalStoreName">가게명</label>
                                        <input type="text" id="modalStoreName" name="StoreName" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreCategory">카테고리</label>
                                        <select id="modalStoreCategory" name="StoreCategory" disabled>
                                            <option value="">카테고리를 선택해주세요</option>
	                                        <option value="한식">한식</option>
	                                        <option value="중식">중식</option>
	                                        <option value="일식">일식</option>
	                                        <option value="양식">양식</option>
	                                        <option value="카페">카페</option>
	                                        <option value="분식">분식</option>
	                                        <option value="베이커리">베이커리</option>
	                                        <option value="술집">술집</option>
	                                        <option value="아시안">아시안</option>
	                                        <option value="샐러드">샐러드</option>
	                                        <option value="간식">간식</option>
                                        <option value="디저트">디저트</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalOfficeName">사업자명</label>
                                        <input type="text" id="modalOfficeName" name="OfficeName" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreContact">전화번호</label>
                                        <input type="tel" id="modalStoreContact" name="StoreContact" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreBusinessNum">사업자번호</label>
                                        <input type="text" id="modalStoreBusinessNum" name="StoreBusinessNum" readonly>
                                    </div>
                                </div>
                            </div>

                            <!-- 주소 정보 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-map-marker-alt"></i> 주소 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="form-group">
                                        <label for="modalStorePostcode">우편번호</label>
                                        <input type="text" id="modalStorePostcode" name="StorePostalCode" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreAddress">주소</label>
                                        <input type="text" id="modalStoreAddress" name="StoreAddr" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreDetailAddress">상세주소</label>
                                        <input type="text" id="modalStoreDetailAddress" name="StoreStreetAddr" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreExtraAddress">참고항목</label>
                                        <input type="text" id="modalStoreExtraAddress" name="StoreAdditionalInfo" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 오른쪽 영역 -->
                        <div class="store-detail-right">
                            <!-- 가게 이미지 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-image"></i> 가게 이미지</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="store-image-upload-area">
                                        <div class="store-image-preview-container">
                                            <div class="store-image-preview">
                                                <img id="modalStoreImagePreview" src="${pageContext.request.contextPath}/_images/default-store.png" alt="가게 이미지">
                                            </div>
                                        </div>
                                        <input type="file" id="modalStoreImageFile" name="StoreImage" accept="image/*" style="display: none;">
                                    </div>
                                </div>
                            </div>

                            <!-- 운영 정보 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-clock"></i> 운영 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="form-group">
                                        <label for="modalStoreSchedule">운영시간</label>
                                        <textarea id="modalStoreSchedule" name="StoreScheduleString" rows="3" readonly></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreFacilities">시설정보</label>
                                        <textarea id="modalStoreFacilities" name=StoreFacilitiesString rows="3" readonly></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreComment">가게소개</label>
                                        <textarea id="modalStoreComment" name="StoreComment" rows="4" readonly></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- 등록 정보 -->
                            <div class="modal-section-card">
                                <div class="modal-section-header">
                                    <h3><i class="fas fa-info-circle"></i> 등록 정보</h3>
                                </div>
                                <div class="modal-section-content">
                                    <div class="form-group">
                                        <label for="modalStoreRegidate">등록일</label>
                                        <input type="text" id="modalStoreRegidate" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreUpdate">최종수정일</label>
                                        <input type="text" id="modalStoreUpdate" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalStoreStatus">가게 상태</label>
                                        <input type="text" id="modalStoreStatus" value="운영중" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- 모달 하단 버튼 -->
            <div class="modal-bottom">
                <div class="form-buttons">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        <i class="fas fa-times"></i> 닫기
                    </button>
                    <button type="button" class="btn btn-primary" id="editBtn" onclick="enableStoreEdit()">
                        <i class="fas fa-edit"></i> 정보 수정
                    </button>
                    <button type="button" class="btn btn-danger" onclick="deleteStoreFromModal()">
                        <i class="fas fa-trash"></i> 가게 삭제
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
    <script src="../_js/admin_stores.js"></script>
    
    <!-- 초기화 스크립트 -->
    <script>
        // 전역 변수 설정
        var path = '${pageContext.request.contextPath}';
        
        // 서버 데이터
        var serverData = {
            totalStores: ${listOut[0]},
            weeklyNew: ${listOut[1]},
            avgRating: ${listOut[2]},
            monthlyRatingIncrease: ${listOut[3]},
            storeCount: ${fn:length(listStore)}
        };
        
        // 페이지 로드 시 초기화
        document.addEventListener('DOMContentLoaded', function() {
            console.log('페이지 로드됨 - 가게 수:', serverData.storeCount);
            initializeAdminStores();
        });
    </script>
</body>
</html>