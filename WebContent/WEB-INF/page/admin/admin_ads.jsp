<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 광고 관리</title>
    <link rel="stylesheet" href="${path}/_css/admin_ads.css">
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
                            <i class="fas fa-ad"></i>
                            광고 관리
                        </h1>
                        <p class="page-subtitle">광고를 관리하고 기간별 통계를 확인할 수 있습니다.</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-outline" onclick="exportAds()">
                            <i class="fas fa-download"></i>
                            <span>내보내기</span>
                        </button>
                        <a href="${path}/Admin_servlet/admin_ads_add.do" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            <span>광고 추가</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- 통계 카드 -->
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-icon ads">
                        <i class="fas fa-ad"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number" id="totalAds">
                            <c:choose>
                                <c:when test="${not empty listOut}">
                                    ${listOut[0]}
                                </c:when>
                                <c:otherwise>0</c:otherwise>
                            </c:choose>
                        </div>
                        <div class="stat-label">총 광고수</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +${listOut != null ? listOut[1] : 0} 이번 주
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon active">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number" id="activeAds">${listOut != null ? listOut[2] : 0}</div>
                        <div class="stat-label">진행중 광고</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +${listOut != null ? listOut[3] : 0} 이번 주
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon ending">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number" id="endingAds">${listOut != null ? listOut[4] : 0}</div>
                        <div class="stat-label">종료 임박</div>
                        <div class="stat-change negative">
                            <i class="fas fa-exclamation-triangle"></i>
                            7일 이내
                        </div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon expired">
                        <i class="fas fa-stop-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number" id="expiredAds">${listOut != null ? listOut[5] : 0}</div>
                        <div class="stat-label">만료된 광고</div>
                        <div class="stat-change negative">
                            <i class="fas fa-arrow-down"></i>
                            +${listOut != null ? listOut[6] : 0}이번 주
                        </div>
                    </div>
                </div>
            </div>

            <!-- 필터 및 검색 -->
            <div class="content-section">
                <div class="content-header">
                    <div class="filter-section">
                        <h3 class="section-title">광고 필터</h3>
                        <div class="filter-buttons">
                            <button class="filter-btn active" data-filter="all">
                                <i class="fas fa-list"></i>
                                전체
                            </button>
                            <button class="filter-btn" data-filter="active">
                                <i class="fas fa-play-circle"></i>
                                진행중
                            </button>
                            <button class="filter-btn" data-filter="ending">
                                <i class="fas fa-clock"></i>
                                종료 임박
                            </button>
                            <button class="filter-btn" data-filter="expired">
                                <i class="fas fa-stop-circle"></i>
                                만료됨
                            </button>
                        </div>
                    </div>
                    
                    <div class="search-section">
                        <h3 class="section-title">검색</h3>
                        <div class="search-controls">
                            <select id="searchType" class="search-select">
                                <option value="all">전체</option>
                                <option value="title">광고 제목</option>
                                <option value="period">기간</option>
                            </select>
                            <div class="search-input-group">
                                <input type="text" id="searchInput" placeholder="검색어를 입력하세요" class="search-input">
                                <button class="search-btn" onclick="searchAds()">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 선택된 항목 액션 바 -->
                <div class="bulk-actions" id="bulkActions" style="display: none;">
                    <div class="bulk-info">
                        <i class="fas fa-check-square"></i>
                        <span id="selectedCount">0</span>개 항목 선택됨
                    </div>
                    <div class="bulk-buttons">
                        <button class="btn btn-success btn-sm" onclick="bulkExtend()">
                            <i class="fas fa-calendar-plus"></i>
                            기간 연장
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="bulkDelete()">
                            <i class="fas fa-trash"></i>
                            삭제
                        </button>
                    </div>
                </div>

                <!-- 광고 목록 테이블 -->
                <div class="data-table-container">
                    <div class="table-header">
                        <div class="table-info">
                            <i class="fas fa-list"></i>
                            총 <strong id="totalCount">
                                <c:choose>
                                    <c:when test="${not empty listAd}">
                                        ${fn:length(listAd)}
                                    </c:when>
                                    <c:otherwise>0</c:otherwise>
                                </c:choose>
                            </strong>개의 광고
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
                        <table class="data-table" id="adsTable">
                            <thead>
                                <tr>
                                    <th class="checkbox-col">
                                        <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                                    </th>
                                    <th class="number-col">광고번호</th>
                                    <th class="image-col">이미지</th>
                                    <th class="sortable" onclick="sortTable('adTitle')">
                                        광고 제목 
                                        <i class="fas fa-sort sort-icon"></i>
                                    </th>
                                    <th class="sortable" onclick="sortTable('adRegidate')">
                                        시작일 
                                        <i class="fas fa-sort sort-icon"></i>
                                    </th>
                                    <th class="sortable" onclick="sortTable('adEndDate')">
                                        종료일 
                                        <i class="fas fa-sort sort-icon"></i>
                                    </th>
                                    <th>남은 기간</th>
                                    <th class="action-col">작업</th>
                                </tr>
                            </thead>
                            <tbody id="adsTableBody">
                                <c:choose>
                                    <c:when test="${empty listAd or fn:length(listAd) == 0}">
                                        <tr>
                                            <td colspan="8" style="text-align:center; padding: 40px;">
                                                <div style="color: var(--admin-text-light);">
                                                    <i class="fas fa-ad" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                                                    <p style="font-size: 1.1rem; margin-bottom: 5px;">등록된 광고가 없습니다.</p>
                                                    <p style="font-size: 0.9rem;">새 광고를 추가해보세요.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </c:when>
                                    <c:otherwise>
                                        <c:forEach var="ad" items="${listAd}" varStatus="loop">
                                            <tr data-ad-id="${ad.adNo}" class="table-row">
                                                <td class="checkbox-col">
                                                    <input type="checkbox" class="ad-checkbox" 
                                                           value="${ad.adNo}" 
                                                           onchange="toggleAdSelection(${ad.adNo})">
                                                </td>
                                                <td class="number-col">#${ad.adNo}</td>
                                                <td class="image-col">
                                                    <c:choose>
                                                        <c:when test="${not empty ad.adImage}">
                                                            <img src="${path}/attach/${ad.adImage}" 
                                                                 alt="${ad.adTitle}" 
                                                                 class="ad-img">
                                                        </c:when>
                                                        <c:otherwise>
                                                            <img src="${path}/attach/none.jpg" 
                                                                 alt="기본 광고 이미지" 
                                                                 class="ad-img">
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <a href="${path}/Admin_servlet/admin_ads_view.do?adNo=${ad.adNo}" 
                                                       style="color: var(--admin-primary-color); text-decoration: none; font-weight: 600;" 
                                                       onmouseover="this.style.textDecoration='underline'" 
                                                       onmouseout="this.style.textDecoration='none'" 
                                                       title="클릭하여 상세보기">
                                                        ${ad.adTitle}
                                                    </a>
                                                </td>
                                                <td>
                                                    <c:choose>
                                                        <c:when test="${not empty ad.adStartDate}">
                                                            ${ad.adStartDate}
                                                        </c:when>
                                                        <c:otherwise>
                                                            <span style="color: var(--admin-text-muted);">정보 없음</span>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <c:choose>
                                                        <c:when test="${not empty ad.adEndDate}">
                                                            ${ad.adEndDate}
                                                        </c:when>
                                                        <c:otherwise>
                                                            <span style="color: var(--admin-text-muted);">정보 없음</span>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td>
                                                    <span class="remaining-period" data-end-date="${ad.adEndDate}">
                                                        <c:choose>
                                                            <c:when test="${not empty ad.adEndDate}">
                                                                ${ad.remaining_days}
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span style="color: var(--admin-text-muted);">정보 없음</span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </span>
                                                </td>
                                                <td class="action-col">
                                                    <div class="action-buttons">
                                                        <a href="${path}/Admin_servlet/admin_ads_view.do?adNo=${ad.adNo}" 
                                                           class="action-btn view" 
                                                           title="상세 보기">
                                                            <i class="fas fa-eye"></i>
                                                        </a>
                                                        <a href="${path}/Admin_servlet/admin_ads_edit.do?adNo=${ad.adNo}" 
                                                           class="action-btn edit" 
                                                           title="편집">
                                                            <i class="fas fa-edit"></i>
                                                        </a>
                                                        <button class="action-btn delete" 
                                                                onclick="deleteAd(${ad.adNo})" 
                                                                title="삭제">
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
                    
                    <!-- 페이지네이션 -->
                    <div class="pagination-container">
                        <div class="pagination-info" id="paginationInfo">
                            <i class="fas fa-info-circle"></i>
                            <span>
                                <c:choose>
                                    <c:when test="${not empty listAd and fn:length(listAd) > 0}">
                                        1-${fn:length(listAd)} of ${fn:length(listAd)} 광고
                                    </c:when>
                                    <c:otherwise>
                                        0-0 of 0 광고
                                    </c:otherwise>
                                </c:choose>
                            </span>
                        </div>
                        <div class="pagination" id="pagination">
                            <!-- 페이지네이션 로직 -->
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 로딩 스피너 -->
    <div id="loadingSpinner" class="loading-spinner" style="display: none;">
        <div class="spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>데이터를 불러오는 중...</p>
    </div>

    <script>
        console.log('JavaScript 시작');

        // 전역 변수
        var selectedAds = new Set();

        // DOM이 로드되면 초기화
        document.addEventListener('DOMContentLoaded', function() {
            console.log('admin_ads.js 로드 완료');
            initializePage();
        });

        /**
         * 페이지 초기화
         */
        function initializePage() {
            setupEventListeners();
            initializeRemainingPeriods();
            console.log('페이지 초기화 완료');
        }

        /**
         * 이벤트 리스너 설정
         */
        function setupEventListeners() {
            // 필터 버튼 이벤트
            var filterBtns = document.querySelectorAll('.filter-btn');
            for (var i = 0; i < filterBtns.length; i++) {
                filterBtns[i].addEventListener('click', function() {
                    setActiveFilter(this);
                    filterAds(this.getAttribute('data-filter'));
                });
            }

            // 검색 입력 이벤트
            var searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchAds();
                    }
                });
                searchInput.addEventListener('input', debounce(searchAds, 300));
            }
            
            console.log('이벤트 리스너 설정 완료');
        }

        /**
         * 광고 삭제
         */
        function deleteAd(adId) {
            if (confirm('정말로 이 광고를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
                // 실제 삭제 요청
                window.location.href = '${path}/Admin_servlet/admin_ads_delete.do?adNo=' + adId;
            }
        }

        /**
         * 활성 필터 설정
         */
        function setActiveFilter(activeBtn) {
            var filterBtns = document.querySelectorAll('.filter-btn');
            for (var i = 0; i < filterBtns.length; i++) {
                filterBtns[i].classList.remove('active');
            }
            activeBtn.classList.add('active');
        }

        /**
         * 필터링
         */
        function filterAds(filter) {
            console.log('filterAds 호출됨, filter:', filter);
            var rows = document.querySelectorAll('#adsTableBody tr[data-ad-id]');
            
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var endDateCell = row.querySelector('td:nth-child(6)');
                
                if (filter === 'all') {
                    row.style.display = '';
                } else if (endDateCell) {
                    var endDate = endDateCell.textContent.trim();
                    var status = getAdStatus(endDate);
                    row.style.display = (status === filter) ? '' : 'none';
                }
            }
            
            updateTableInfo();
            selectedAds.clear();
            updateBulkActions();
        }

        /**
         * 검색
         */
        function searchAds() {
            var searchTypeEl = document.getElementById('searchType');
            var searchInputEl = document.getElementById('searchInput');
            var searchType = searchTypeEl ? searchTypeEl.value : 'all';
            var searchTerm = searchInputEl ? searchInputEl.value.toLowerCase().trim() : '';
            
            console.log('searchAds 호출됨, 검색어:', searchTerm, '타입:', searchType);
            
            var rows = document.querySelectorAll('#adsTableBody tr[data-ad-id]');
            
            if (!searchTerm) {
                // 검색어가 없으면 현재 활성 필터 적용
                var activeFilterEl = document.querySelector('.filter-btn.active');
                var activeFilter = activeFilterEl ? activeFilterEl.getAttribute('data-filter') : 'all';
                filterAds(activeFilter);
                return;
            }

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var cells = row.querySelectorAll('td');
                if (cells.length < 6) continue;
                
                var title = cells[3].textContent.toLowerCase();
                var regiDate = cells[4].textContent.toLowerCase();
                var endDate = cells[5].textContent.toLowerCase();
                
                var shouldShow = false;
                
                switch (searchType) {
                    case 'title':
                        shouldShow = title.indexOf(searchTerm) !== -1;
                        break;
                    case 'period':
                        shouldShow = regiDate.indexOf(searchTerm) !== -1 || 
                                   endDate.indexOf(searchTerm) !== -1;
                        break;
                    case 'all':
                    default:
                        shouldShow = title.indexOf(searchTerm) !== -1 ||
                                   regiDate.indexOf(searchTerm) !== -1 ||
                                   endDate.indexOf(searchTerm) !== -1;
                        break;
                }
                
                row.style.display = shouldShow ? '' : 'none';
            }
            
            updateTableInfo();
            selectedAds.clear();
            updateBulkActions();
        }

        /**
         * 전체 선택 토글
         */
        function toggleSelectAll() {
            var selectAll = document.getElementById('selectAll');
            var checkboxes = document.querySelectorAll('.ad-checkbox');
            
            for (var i = 0; i < checkboxes.length; i++) {
                var checkbox = checkboxes[i];
                var row = checkbox.closest('tr');
                if (row && row.style.display !== 'none') {
                    checkbox.checked = selectAll.checked;
                    var adId = parseInt(checkbox.value);
                    if (selectAll.checked) {
                        selectedAds.add(adId);
                    } else {
                        selectedAds.delete(adId);
                    }
                }
            }
            
            updateBulkActions();
        }

        /**
         * 광고 선택 토글
         */
        function toggleAdSelection(adId) {
            if (selectedAds.has(adId)) {
                selectedAds.delete(adId);
            } else {
                selectedAds.add(adId);
            }
            updateBulkActions();
            updateSelectAllState();
        }

        /**
         * 전체 선택 상태 업데이트
         */
        function updateSelectAllState() {
            var selectAll = document.getElementById('selectAll');
            var checkboxes = document.querySelectorAll('.ad-checkbox');
            var visibleCheckboxes = [];
            
            for (var i = 0; i < checkboxes.length; i++) {
                var checkbox = checkboxes[i];
                var row = checkbox.closest('tr');
                if (row && row.style.display !== 'none') {
                    visibleCheckboxes.push(checkbox);
                }
            }
            
            var checkedCount = 0;
            for (var i = 0; i < visibleCheckboxes.length; i++) {
                if (visibleCheckboxes[i].checked) {
                    checkedCount++;
                }
            }
            
            if (selectAll) {
                selectAll.checked = checkedCount > 0 && checkedCount === visibleCheckboxes.length;
                selectAll.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
            }
        }

        /**
         * 일괄 작업 UI 업데이트
         */
        function updateBulkActions() {
            var bulkActions = document.getElementById('bulkActions');
            var selectedCount = document.getElementById('selectedCount');
            
            if (selectedAds.size > 0) {
                if (bulkActions) bulkActions.style.display = 'flex';
                if (selectedCount) selectedCount.textContent = selectedAds.size;
            } else {
                if (bulkActions) bulkActions.style.display = 'none';
            }
        }

        /**
         * 테이블 정보 업데이트
         */
        function updateTableInfo() {
            var visibleRows = document.querySelectorAll('#adsTableBody tr[data-ad-id]:not([style*="display: none"])');
            var totalCountEl = document.getElementById('totalCount');
            if (totalCountEl) {
                totalCountEl.textContent = visibleRows.length;
            }
        }

        /**
         * 일괄 기간 연장
         */
        function bulkExtend() {
            if (selectedAds.size === 0) {
                showNotification('연장할 광고를 선택해주세요.', 'warning');
                return;
            }
            
            var days = prompt('연장할 일수를 입력하세요 (최대 365일):', '30');
            if (days && !isNaN(days) && parseInt(days) > 0 && parseInt(days) <= 365) {
                var count = selectedAds.size;
                selectedAds.clear();
                updateBulkActions();
                showNotification('선택된 ' + count + '개 광고의 기간이 ' + days + '일 연장되었습니다.', 'success');
                setTimeout(function() { location.reload(); }, 2000);
            } else if (days !== null) {
                showNotification('올바른 일수를 입력해주세요 (1-365).', 'warning');
            }
        }

        /**
         * 일괄 삭제
         */
        function bulkDelete() {
            if (selectedAds.size === 0) {
                showNotification('삭제할 광고를 선택해주세요.', 'warning');
                return;
            }
            
            if (confirm('선택된 ' + selectedAds.size + '개의 광고를 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
                var deletedCount = selectedAds.size;
                selectedAds.clear();
                updateBulkActions();
                showNotification(deletedCount + '개의 광고가 삭제되었습니다.', 'success');
                setTimeout(function() { location.reload(); }, 2000);
            }
        }

        /**
         * 데이터 내보내기
         */
        function exportAds() {
            var visibleRows = document.querySelectorAll('#adsTableBody tr[data-ad-id]:not([style*="display: none"])');
            
            if (visibleRows.length === 0) {
                showNotification('내보낼 데이터가 없습니다.', 'warning');
                return;
            }

            try {
                var csvRows = ['광고번호,광고제목,등록일,종료일,남은기간'];
                
                for (var i = 0; i < visibleRows.length; i++) {
                    var row = visibleRows[i];
                    var cells = row.querySelectorAll('td');
                    
                    if (cells.length >= 7) {
                        var adNo = cells[1].textContent.trim();
                        var title = cells[3].textContent.trim().replace(/"/g, '""'); // CSV 이스케이프
                        var regiDate = cells[4].textContent.trim();
                        var endDate = cells[5].textContent.trim();
                        var remaining = cells[6].textContent.trim();
                        
                        var rowData = '"' + adNo + '","' + title + '","' + regiDate + 
                                     '","' + endDate + '","' + remaining + '"';
                        csvRows.push(rowData);
                    }
                }
                
                var csvContent = "data:text/csv;charset=utf-8,\ufeff" + csvRows.join('\n');
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "광고목록_" + new Date().toISOString().split('T')[0] + ".csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification(visibleRows.length + '개의 광고 데이터를 내보냈습니다.', 'success');
            } catch (error) {
                showNotification('데이터 내보내기에 실패했습니다.', 'error');
                console.error('Export error:', error);
            }
        }

        /**
         * 페이지 크기 변경
         */
        function changePageSize() {
            var pageSizeSelect = document.getElementById('pageSize');
            if (pageSizeSelect) {
                var pageSize = parseInt(pageSizeSelect.value);
                console.log('페이지 크기 변경:', pageSize);
                showNotification('페이지 크기가 ' + pageSize + '개로 변경되었습니다.', 'info');
                // 실제로는 페이지네이션 로직 구현 필요
            }
        }

        /**
         * 테이블 정렬
         */
        function sortTable(column) {
            console.log('sortTable 호출됨, column:', column);
            
            // 정렬 아이콘 업데이트
            var sortIcons = document.querySelectorAll('.sort-icon');
            for (var i = 0; i < sortIcons.length; i++) {
                sortIcons[i].className = 'fas fa-sort sort-icon';
            }
            
            var currentSortIcon = document.querySelector('[onclick="sortTable(\'' + column + '\')"] .sort-icon');
            if (currentSortIcon) {
                currentSortIcon.className = 'fas fa-sort-up sort-icon'; // 임시로 올림차순 표시
            }
            
            showNotification('테이블 정렬: ' + column, 'info');
            // 실제로는 정렬 로직 구현 필요
        }

        /**
         * JSP에서 렌더링된 데이터의 남은 기간 초기화
         */
        function initializeRemainingPeriods() {
            var remainingElements = document.querySelectorAll('.remaining-period');
            for (var i = 0; i < remainingElements.length; i++) {
                var element = remainingElements[i];
                var endDate = element.getAttribute('data-end-date');
                if (endDate && endDate !== '정보 없음') {
                    var remainingDays = calculateRemainingDays(endDate);
                    element.innerHTML = getRemainingPeriodHTML(remainingDays);
                }
            }
        }

        /**
         * 알림 표시
         */
        function showNotification(message, type) {
            type = type || 'info';
            
            // 기존 알림 제거
            var existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            var notification = document.createElement('div');
            notification.className = 'notification notification-' + type;
            notification.innerHTML = 
                '<div class="notification-content">' +
                    '<i class="fas fa-' + getNotificationIcon(type) + '"></i>' +
                    '<span>' + escapeHtml(message) + '</span>' +
                '</div>' +
                '<button class="notification-close" onclick="this.parentElement.remove()">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';

            notification.style.cssText = 
                'position: fixed;' +
                'top: 90px;' +
                'right: 20px;' +
                'background: white;' +
                'border: 1px solid #dee2e6;' +
                'border-left: 4px solid ' + getNotificationColor(type) + ';' +
                'border-radius: 8px;' +
                'padding: 15px 20px;' +
                'box-shadow: 0 4px 8px rgba(0,0,0,0.15);' +
                'z-index: 10000;' +
                'max-width: 400px;' +
                'animation: slideInRight 0.3s ease;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: space-between;' +
                'gap: 15px;';

            document.body.appendChild(notification);

            // 3초 후 자동 제거
            setTimeout(function() {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(function() { 
                        if (notification.parentElement) {
                            notification.remove(); 
                        }
                    }, 300);
                }
            }, 3000);
        }

        /**
         * 남은 일수 계산
         */
        function calculateRemainingDays(endDate) {
            if (!endDate || endDate === '정보 없음') return 0;
            
            try {
                var today = new Date();
                var end = new Date(endDate);
                var timeDiff = end.getTime() - today.getTime();
                return Math.ceil(timeDiff / (1000 * 3600 * 24));
            } catch (e) {
                console.error('날짜 계산 오류:', e);
                return 0;
            }
        }

        /**
         * 광고 상태 반환
         */
        function getAdStatus(endDate) {
            var remainingDays = calculateRemainingDays(endDate);
            
            if (remainingDays < 0) {
                return 'expired';
            } else if (remainingDays <= 7) {
                return 'ending';
            } else {
                return 'active';
            }
        }

        /**
         * 남은 기간 HTML 반환
         */
        function getRemainingPeriodHTML(remainingDays) {
            if (remainingDays < 0) {
                return '<span style="color: #dc3545; font-weight: 500;">' + 
                       Math.abs(remainingDays) + '일 전 만료</span>';
            } else if (remainingDays === 0) {
                return '<span style="color: #dc3545; font-weight: 500;">오늘 만료</span>';
            } else if (remainingDays <= 7) {
                return '<span style="color: #ffc107; font-weight: 500;">' + 
                       remainingDays + '일 남음</span>';
            } else {
                return '<span style="color: #28a745; font-weight: 500;">' + 
                       remainingDays + '일 남음</span>';
            }
        }

        /**
         * 디바운스 함수
         */
        function debounce(func, wait) {
            var timeout;
            return function executedFunction() {
                var later = function() {
                    clearTimeout(timeout);
                    func();
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        /**
         * 알림 아이콘 반환
         */
        function getNotificationIcon(type) {
            switch(type) {
                case 'success': return 'check-circle';
                case 'error': return 'exclamation-circle';
                case 'warning': return 'exclamation-triangle';
                default: return 'info-circle';
            }
        }

        /**
         * 알림 색상 반환
         */
        function getNotificationColor(type) {
            switch(type) {
                case 'success': return '#28a745';
                case 'error': return '#dc3545';
                case 'warning': return '#ffc107';
                default: return '#17a2b8';
            }
        }

        /**
         * HTML 이스케이프
         */
        function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }
    </script>
</body>
</html>