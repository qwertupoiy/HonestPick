/**
 * 광고 관리 페이지 JavaScript
 * HonestPick 관리자 시스템
 */

// 전역 변수
var adsData = [];
var filteredData = [];
var currentPage = 1;
var pageSize = 25;
var sortColumn = '';
var sortDirection = 'asc';
var selectedAds = new Set();
var currentView = 'table';
var isLoading = false;

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * 페이지 초기화
 */
function initializePage() {
    loadSampleData();
    setupEventListeners();
    renderData();
    renderTopPerformers();
    updateStats();
}

/**
 * 샘플 데이터 로드
 */
function loadSampleData() {
    adsData = [
        {
            id: 1,
            title: "신메뉴 런칭 이벤트",
            advertiser: "성수 맛집",
            category: "한식",
            startDate: "2025-05-20",
            endDate: "2025-06-20",
            views: 1234,
            clicks: 89,
            ctr: 7.2,
            budget: 500000,
            spent: 245000,
            status: "active",
            adImg: "assets/placeholder-ad.jpg",
            description: "새로운 시그니처 메뉴 출시 기념 할인 이벤트입니다.",
            targetAge: "20-40",
            targetGender: "전체"
        },
        {
            id: 2,
            title: "그랜드 오픈 할인",
            advertiser: "강남 파스타",
            category: "양식",
            startDate: "2025-05-15",
            endDate: "2025-05-31",
            views: 2567,
            clicks: 234,
            ctr: 9.1,
            budget: 800000,
            spent: 456000,
            status: "active",
            adImg: "assets/placeholder-ad2.jpg",
            description: "그랜드 오픈 기념 50% 할인 이벤트입니다.",
            targetAge: "25-45",
            targetGender: "전체"
        },
        {
            id: 3,
            title: "여름 시즌 메뉴",
            advertiser: "홍대 카페",
            category: "카페",
            startDate: "2025-05-10",
            endDate: "2025-06-10",
            views: 856,
            clicks: 42,
            ctr: 4.9,
            budget: 300000,
            spent: 150000,
            status: "paused",
            adImg: "assets/placeholder-ad3.jpg",
            description: "시원한 여름 음료 신메뉴를 소개합니다.",
            targetAge: "18-35",
            targetGender: "전체"
        },
        {
            id: 4,
            title: "점심 특가 메뉴",
            advertiser: "성수 맛집",
            category: "한식",
            startDate: "2025-05-25",
            endDate: "2025-06-25",
            views: 0,
            clicks: 0,
            ctr: 0,
            budget: 400000,
            spent: 0,
            status: "scheduled",
            adImg: "assets/placeholder-ad4.jpg",
            description: "점심시간 특가 메뉴 프로모션입니다.",
            targetAge: "25-50",
            targetGender: "전체"
        },
        {
            id: 5,
            title: "종료된 이벤트",
            advertiser: "강남 파스타", 
            category: "양식",
            startDate: "2025-04-01",
            endDate: "2025-04-30",
            views: 3421,
            clicks: 298,
            ctr: 8.7,
            budget: 600000,
            spent: 600000,
            status: "ended",
            adImg: "assets/placeholder-ad5.jpg",
            description: "봄맞이 특별 메뉴 이벤트였습니다.",
            targetAge: "20-40",
            targetGender: "전체"
        }
    ];

    // 더 많은 샘플 데이터 생성 (테스트용)
    for (var i = 6; i <= 50; i++) {
        var categories = ['한식', '중식', '일식', '양식', '카페'];
        var statuses = ['active', 'paused', 'ended', 'scheduled'];
        var advertisers = ['성수 맛집', '강남 파스타', '홍대 카페', '신촌 일식', '송파 중국집'];
        
        var randomViews = Math.floor(Math.random() * 5000);
        var randomClicks = Math.floor(randomViews * Math.random() * 0.15);
        var randomCTR = randomViews > 0 ? Math.round((randomClicks / randomViews) * 1000) / 10 : 0;
        var randomBudget = Math.floor(Math.random() * 1000000) + 100000;
        var randomSpent = Math.floor(randomBudget * Math.random());
        
        adsData.push({
            id: i,
            title: "광고 " + i,
            advertiser: advertisers[Math.floor(Math.random() * advertisers.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            startDate: getRandomDate(),
            endDate: getRandomFutureDate(),
            views: randomViews,
            clicks: randomClicks,
            ctr: randomCTR,
            budget: randomBudget,
            spent: randomSpent,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            adImg: "assets/placeholder-ad" + ((i % 5) + 1) + ".jpg",
            description: "광고 " + i + " 설명입니다.",
            targetAge: "20-50",
            targetGender: "전체"
        });
    }

    filteredData = adsData.slice();
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 필터 버튼
    var filterBtns = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < filterBtns.length; i++) {
        filterBtns[i].addEventListener('click', function() {
            setActiveFilter(this);
            filterAds(this.getAttribute('data-filter'));
        });
    }

    // 검색 입력
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAds();
            }
        });

        // 실시간 검색 (debounce 적용)
        searchInput.addEventListener('input', debounce(searchAds, 300));
    }

    // 광고 폼 제출
    var adForm = document.getElementById('adForm');
    if (adForm) {
        adForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAd();
        });
    }

    // 이미지 미리보기
    var adImage = document.getElementById('adImage');
    if (adImage) {
        adImage.addEventListener('change', function(e) {
            previewImage(e);
        });
    }

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        var modal = document.getElementById('adModal');
        var editModal = document.getElementById('adEditModal');
        
        if (event.target === modal) {
            closeModal();
        }
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
            closeEditModal();
        }
    });
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
 * 뷰 전환 (테이블/카드) (HTML에서 호출)
 */
function toggleView(view) {
    currentView = view;
    
    var viewBtns = document.querySelectorAll('.view-btn');
    for (var i = 0; i < viewBtns.length; i++) {
        var btn = viewBtns[i];
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    var tableView = document.getElementById('tableView');
    var cardView = document.getElementById('cardView');
    
    if (view === 'table') {
        tableView.style.display = 'block';
        cardView.style.display = 'none';
        renderTable();
    } else {
        tableView.style.display = 'none';
        cardView.style.display = 'block';
        renderCards();
    }
}

/**
 * 데이터 렌더링
 */
function renderData() {
    if (currentView === 'table') {
        renderTable();
    } else {
        renderCards();
    }
}

/**
 * 테이블 렌더링
 */
function renderTable() {
    if (isLoading) return;
    
    showLoading();
    
    setTimeout(function() {
        var tbody = document.getElementById('adsTableBody');
        if (!tbody) {
            hideLoading();
            return;
        }

        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize, filteredData.length);
        var currentData = filteredData.slice(startIndex, endIndex);

        if (currentData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="13" class="no-data">' +
                '<div style="text-align: center; padding: 40px; color: var(--admin-text-light);">' +
                '<i class="fas fa-bullhorn" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>' +
                '<p style="font-size: 1.1rem; margin-bottom: 5px;">광고가 없습니다</p>' +
                '<p style="font-size: 0.9rem;">다른 필터를 시도해보세요.</p>' +
                '</div></td></tr>';
        } else {
            var rows = [];
            for (var i = 0; i < currentData.length; i++) {
                rows.push(createTableRow(currentData[i]));
            }
            tbody.innerHTML = rows.join('');
        }

        renderPagination();
        updateTableInfo();
        updateSelectAllState();
        hideLoading();
    }, 200);
}

/**
 * 테이블 행 생성
 */
function createTableRow(ad) {
    var isChecked = selectedAds.has(ad.id) ? 'checked' : '';
    
    var statusButton = '';
    if (ad.status === 'active') {
        statusButton = '<button class="action-btn pause" onclick="pauseAd(' + ad.id + ')" title="일시정지">' +
            '<i class="fas fa-pause"></i></button>';
    } else {
        statusButton = '<button class="action-btn play" onclick="activateAd(' + ad.id + ')" title="활성화">' +
            '<i class="fas fa-play"></i></button>';
    }
    
    return '<tr data-ad-id="' + ad.id + '" class="table-row">' +
        '<td class="checkbox-col">' +
            '<input type="checkbox" class="ad-checkbox" ' +
                   'value="' + ad.id + '" ' + isChecked + ' ' +
                   'onchange="toggleAdSelection(' + ad.id + ')">' +
        '</td>' +
        '<td class="image-col">' +
            '<img src="' + ad.adImg + '" alt="광고" class="ad-thumbnail" ' +
                 'onerror="this.src=\'assets/default-ad.png\'" title="' + ad.title + '">' +
        '</td>' +
        '<td><strong style="color: var(--admin-text-dark);">' + escapeHtml(ad.title) + '</strong></td>' +
        '<td>' + escapeHtml(ad.advertiser) + '</td>' +
        '<td>' +
            '<span class="category-badge ' + ad.category + '">' + ad.category + '</span>' +
        '</td>' +
        '<td>' + formatDate(ad.startDate) + '</td>' +
        '<td>' + formatDate(ad.endDate) + '</td>' +
        '<td>' + ad.views.toLocaleString() + '</td>' +
        '<td>' + ad.clicks.toLocaleString() + '</td>' +
        '<td>' + ad.ctr + '%</td>' +
        '<td>' + ad.budget.toLocaleString() + '원</td>' +
        '<td>' +
            '<span class="status-badge status-' + ad.status + '">' +
                '<i class="fas fa-' + getStatusIcon(ad.status) + '"></i>' +
                getStatusText(ad.status) +
            '</span>' +
        '</td>' +
        '<td class="action-col">' +
            '<div class="action-buttons">' +
                '<button class="action-btn view" onclick="viewAd(' + ad.id + ')" title="상세보기">' +
                    '<i class="fas fa-eye"></i>' +
                '</button>' +
                '<button class="action-btn edit" onclick="editAd(' + ad.id + ')" title="편집">' +
                    '<i class="fas fa-edit"></i>' +
                '</button>' +
                statusButton +
                '<button class="action-btn delete" onclick="deleteAd(' + ad.id + ')" title="삭제">' +
                    '<i class="fas fa-trash"></i>' +
                '</button>' +
            '</div>' +
        '</td>' +
    '</tr>';
}

/**
 * 카드 렌더링
 */
function renderCards() {
    if (isLoading) return;
    
    showLoading();
    
    setTimeout(function() {
        var container = document.getElementById('adsGrid');
        if (!container) {
            hideLoading();
            return;
        }

        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize, filteredData.length);
        var currentData = filteredData.slice(startIndex, endIndex);

        if (currentData.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 60px; color: var(--admin-text-light); grid-column: 1 / -1;">' +
                '<i class="fas fa-bullhorn" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;"></i>' +
                '<p style="font-size: 1.2rem; margin-bottom: 10px;">광고가 없습니다</p>' +
                '<p style="font-size: 1rem;">다른 필터를 시도해보세요.</p>' +
                '</div>';
        } else {
            var cards = [];
            for (var i = 0; i < currentData.length; i++) {
                cards.push(createAdCard(currentData[i]));
            }
            container.innerHTML = cards.join('');
        }

        renderPagination();
        updateTableInfo();
        updateSelectAllState();
        hideLoading();
    }, 200);
}

/**
 * 광고 카드 생성
 */
function createAdCard(ad) {
    var isChecked = selectedAds.has(ad.id) ? 'checked' : '';
    
    var statusButton = '';
    if (ad.status === 'active') {
        statusButton = '<button class="btn btn-warning btn-sm" onclick="pauseAd(' + ad.id + ')">' +
            '<i class="fas fa-pause"></i> 일시정지</button>';
    } else {
        statusButton = '<button class="btn btn-success btn-sm" onclick="activateAd(' + ad.id + ')">' +
            '<i class="fas fa-play"></i> 활성화</button>';
    }
    
    var progressWidth = ad.budget > 0 ? (ad.spent / ad.budget) * 100 : 0;
    
    return '<div class="ad-card">' +
        '<div class="card-header">' +
            '<input type="checkbox" class="ad-checkbox" ' +
                   'value="' + ad.id + '" ' + isChecked + ' ' +
                   'onchange="toggleAdSelection(' + ad.id + ')">' +
            '<span class="status-badge status-' + ad.status + '">' +
                '<i class="fas fa-' + getStatusIcon(ad.status) + '"></i>' +
                getStatusText(ad.status) +
            '</span>' +
        '</div>' +
        '<div class="card-image">' +
            '<img src="' + ad.adImg + '" alt="' + ad.title + '" ' +
                 'onerror="this.src=\'assets/default-ad.png\'">' +
            '<div class="card-overlay">' +
                '<button class="overlay-btn" onclick="viewAd(' + ad.id + ')" title="상세보기">' +
                    '<i class="fas fa-eye"></i>' +
                '</button>' +
                '<button class="overlay-btn" onclick="editAd(' + ad.id + ')" title="편집">' +
                    '<i class="fas fa-edit"></i>' +
                '</button>' +
            '</div>' +
        '</div>' +
        '<div class="card-content">' +
            '<h4>' + escapeHtml(ad.title) + '</h4>' +
            '<p class="advertiser">' + escapeHtml(ad.advertiser) + '</p>' +
            '<div class="ad-stats">' +
                '<div class="stat-item">' +
                    '<i class="fas fa-eye"></i>' +
                    '<span>' + ad.views.toLocaleString() + '</span>' +
                '</div>' +
                '<div class="stat-item">' +
                    '<i class="fas fa-mouse-pointer"></i>' +
                    '<span>' + ad.clicks.toLocaleString() + '</span>' +
                '</div>' +
                '<div class="stat-item">' +
                    '<i class="fas fa-percentage"></i>' +
                    '<span>' + ad.ctr + '%</span>' +
                '</div>' +
            '</div>' +
            '<div class="ad-period">' +
                formatDate(ad.startDate) + ' ~ ' + formatDate(ad.endDate) +
            '</div>' +
            '<div class="ad-budget">' +
                '<div class="budget-info">' +
                    '<span class="spent">' + ad.spent.toLocaleString() + '</span>' +
                    '<span class="total">/ ' + ad.budget.toLocaleString() + '원</span>' +
                '</div>' +
                '<div class="budget-bar">' +
                    '<div class="budget-progress" style="width: ' + progressWidth + '%"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="card-actions">' +
            statusButton +
            '<button class="btn btn-danger btn-sm" onclick="deleteAd(' + ad.id + ')">' +
                '<i class="fas fa-trash"></i> 삭제' +
            '</button>' +
        '</div>' +
    '</div>';
}

/**
 * 상위 성과 광고 렌더링
 */
function renderTopPerformers() {
    var activeAds = [];
    for (var i = 0; i < adsData.length; i++) {
        var ad = adsData[i];
        if (ad.status === 'active' && ad.views > 0) {
            activeAds.push(ad);
        }
    }
    
    // CTR 기준으로 정렬
    activeAds.sort(function(a, b) {
        return b.ctr - a.ctr;
    });
    
    var topAds = activeAds.slice(0, 5);
    var container = document.getElementById('topPerformers');
    
    if (!container) return;
    
    if (topAds.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--admin-text-light);">' +
            '<i class="fas fa-chart-line" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>' +
            '<p>성과 데이터가 있는 활성 광고가 없습니다.</p>' +
            '</div>';
        return;
    }
    
    var items = [];
    for (var i = 0; i < topAds.length; i++) {
        var ad = topAds[i];
        items.push(
            '<div class="performer-item" onclick="viewAd(' + ad.id + ')" style="cursor: pointer;">' +
                '<div class="rank">' + (i + 1) + '</div>' +
                '<img src="' + ad.adImg + '" alt="' + ad.title + '" class="performer-img" ' +
                     'onerror="this.src=\'assets/default-ad.png\'">' +
                '<div class="performer-info">' +
                    '<h5>' + escapeHtml(ad.title) + '</h5>' +
                    '<p>' + escapeHtml(ad.advertiser) + '</p>' +
                    '<div class="performer-stats">' +
                        '<span class="ctr">' + ad.ctr + '% CTR</span>' +
                        '<span class="views">' + ad.views.toLocaleString() + ' 조회</span>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }
    
    container.innerHTML = items.join('');
}

/**
 * 페이지네이션 렌더링
 */
function renderPagination() {
    var totalPages = Math.ceil(filteredData.length / pageSize);
    var pagination = document.getElementById('pagination');
    
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }
    
    var paginationHTML = '';
    
    // 이전 페이지
    if (currentPage > 1) {
        paginationHTML += '<a href="#" onclick="changePage(' + (currentPage - 1) + ')" title="이전 페이지">' +
            '<i class="fas fa-chevron-left"></i></a>';
    }
    
    // 페이지 번호들
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += '<a href="#" onclick="changePage(1)">1</a>';
        if (startPage > 2) {
            paginationHTML += '<span style="padding: 0 8px; color: var(--admin-text-light);">...</span>';
        }
    }
    
    for (var i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += '<span class="current">' + i + '</span>';
        } else {
            paginationHTML += '<a href="#" onclick="changePage(' + i + ')">' + i + '</a>';
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span style="padding: 0 8px; color: var(--admin-text-light);">...</span>';
        }
        paginationHTML += '<a href="#" onclick="changePage(' + totalPages + ')">' + totalPages + '</a>';
    }
    
    // 다음 페이지
    if (currentPage < totalPages) {
        paginationHTML += '<a href="#" onclick="changePage(' + (currentPage + 1) + ')" title="다음 페이지">' +
            '<i class="fas fa-chevron-right"></i></a>';
    }
    
    pagination.innerHTML = paginationHTML;
    
    // 페이지 정보 업데이트
    var startIndex = (currentPage - 1) * pageSize + 1;
    var endIndex = Math.min(currentPage * pageSize, filteredData.length);
    var paginationInfo = document.getElementById('paginationInfo');
    if (paginationInfo) {
        paginationInfo.innerHTML = '<i class="fas fa-info-circle"></i>' +
            '<span>' + startIndex.toLocaleString() + '-' + endIndex.toLocaleString() + 
            ' of ' + filteredData.length.toLocaleString() + ' 광고</span>';
    }
}

/**
 * 페이지 변경 (HTML에서 호출)
 */
function changePage(page) {
    if (page !== currentPage && page >= 1) {
        currentPage = page;
        renderData();
        scrollToTop();
    }
}

/**
 * 페이지 사이즈 변경 (HTML에서 호출)
 */
function changePageSize() {
    var pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSize = parseInt(pageSizeSelect.value);
        currentPage = 1;
        renderData();
    }
}

/**
 * 테이블 정렬 (HTML에서 호출)
 */
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredData.sort(function(a, b) {
        var valueA = a[column];
        var valueB = b[column];

        // 날짜 컬럼 처리
        if (column === 'startDate' || column === 'endDate') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        // 문자열 컬럼 처리 (대소문자 무시)
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        var result = 0;
        if (valueA < valueB) result = -1;
        else if (valueA > valueB) result = 1;

        return sortDirection === 'asc' ? result : -result;
    });

    currentPage = 1;
    renderData();
    updateSortIcons(column, sortDirection);
}

/**
 * 정렬 아이콘 업데이트
 */
function updateSortIcons(activeColumn, direction) {
    var sortIcons = document.querySelectorAll('.sort-icon');
    for (var i = 0; i < sortIcons.length; i++) {
        var icon = sortIcons[i];
        var th = icon.closest('th');
        var onclickAttr = th.getAttribute('onclick');
        var columnMatch = onclickAttr ? onclickAttr.match(/sortTable\('(\w+)'\)/) : null;
        var column = columnMatch ? columnMatch[1] : null;
        
        if (column === activeColumn) {
            icon.className = 'fas fa-sort-' + (direction === 'asc' ? 'up' : 'down') + ' sort-icon';
        } else {
            icon.className = 'fas fa-sort sort-icon';
        }
    }
}

/**
 * 필터링 (HTML에서 호출)
 */
function filterAds(filter) {
    if (filter === 'all') {
        filteredData = adsData.slice();
    } else {
        filteredData = [];
        for (var i = 0; i < adsData.length; i++) {
            if (adsData[i].status === filter) {
                filteredData.push(adsData[i]);
            }
        }
    }
    
    currentPage = 1;
    selectedAds.clear();
    renderData();
    updateBulkActions();
}

/**
 * 검색 (HTML에서 호출)
 */
function searchAds() {
    var searchTypeEl = document.getElementById('searchType');
    var searchInputEl = document.getElementById('searchInput');
    var searchType = searchTypeEl ? searchTypeEl.value : 'all';
    var searchTerm = searchInputEl ? searchInputEl.value.toLowerCase().trim() : '';
    
    if (!searchTerm) {
        // 현재 활성 필터 다시 적용
        var activeFilterEl = document.querySelector('.filter-btn.active');
        var activeFilter = activeFilterEl ? activeFilterEl.getAttribute('data-filter') : 'all';
        filterAds(activeFilter);
        return;
    }

    filteredData = [];
    for (var i = 0; i < adsData.length; i++) {
        var ad = adsData[i];
        var shouldInclude = false;
        
        switch (searchType) {
            case 'title':
                shouldInclude = ad.title.toLowerCase().indexOf(searchTerm) !== -1;
                break;
            case 'advertiser':
                shouldInclude = ad.advertiser.toLowerCase().indexOf(searchTerm) !== -1;
                break;
            case 'category':
                shouldInclude = ad.category.toLowerCase().indexOf(searchTerm) !== -1;
                break;
            case 'all':
            default:
                shouldInclude = ad.title.toLowerCase().indexOf(searchTerm) !== -1 ||
                              ad.advertiser.toLowerCase().indexOf(searchTerm) !== -1 ||
                              ad.category.toLowerCase().indexOf(searchTerm) !== -1;
                break;
        }
        
        if (shouldInclude) {
            filteredData.push(ad);
        }
    }
    
    currentPage = 1;
    selectedAds.clear();
    renderData();
    updateBulkActions();
}

/**
 * 기간 필터 (HTML에서 호출)
 */
function filterByDate() {
    var startDateEl = document.getElementById('startDate');
    var endDateEl = document.getElementById('endDate');
    var startDate = startDateEl ? startDateEl.value : '';
    var endDate = endDateEl ? endDateEl.value : '';
    
    if (!startDate && !endDate) {
        showNotification('시작일 또는 종료일을 선택해주세요.', 'warning');
        return;
    }
    
    filteredData = [];
    for (var i = 0; i < adsData.length; i++) {
        var ad = adsData[i];
        var adStartDate = new Date(ad.startDate);
        var adEndDate = new Date(ad.endDate);
        var filterStartDate = startDate ? new Date(startDate) : null;
        var filterEndDate = endDate ? new Date(endDate) : null;
        
        var shouldInclude = true;
        
        if (filterStartDate && adEndDate < filterStartDate) {
            shouldInclude = false;
        }
        if (filterEndDate && adStartDate > filterEndDate) {
            shouldInclude = false;
        }
        
        if (shouldInclude) {
            filteredData.push(ad);
        }
    }
    
    currentPage = 1;
    selectedAds.clear();
    renderData();
    updateBulkActions();
    
    showNotification(filteredData.length + '개의 광고가 필터링되었습니다.', 'info');
}

/**
 * 전체 선택 토글 (HTML에서 호출)
 */
function toggleSelectAll() {
    var selectAll = document.getElementById('selectAll');
    var checkboxes = document.querySelectorAll('.ad-checkbox');
    
    for (var i = 0; i < checkboxes.length; i++) {
        var checkbox = checkboxes[i];
        checkbox.checked = selectAll.checked;
        var adId = parseInt(checkbox.value);
        if (selectAll.checked) {
            selectedAds.add(adId);
        } else {
            selectedAds.delete(adId);
        }
    }
    
    updateBulkActions();
}

/**
 * 광고 선택 토글 (HTML에서 호출)
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
    var checkedCount = 0;
    
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkedCount++;
        }
    }
    
    if (selectAll) {
        selectAll.checked = checkedCount > 0 && checkedCount === checkboxes.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }
}

/**
 * 일괄 작업 UI 업데이트
 */
function updateBulkActions() {
    var bulkActions = document.getElementById('bulkActions');
    var selectedCount = document.getElementById('selectedCount');
    
    if (selectedAds.size > 0) {
        bulkActions.style.display = 'flex';
        if (selectedCount) {
            selectedCount.textContent = selectedAds.size;
        }
    } else {
        bulkActions.style.display = 'none';
    }
}

/**
 * 광고 상세 보기 (HTML에서 호출)
 */
function viewAd(adId) {
    var ad = null;
    for (var i = 0; i < adsData.length; i++) {
        if (adsData[i].id === adId) {
            ad = adsData[i];
            break;
        }
    }
    
    if (!ad) {
        showNotification('광고를 찾을 수 없습니다.', 'error');
        return;
    }

    var modalTitle = document.getElementById('modalTitle');
    var modalBody = document.getElementById('modalBody');
    
    if (modalTitle) {
        modalTitle.textContent = '광고 상세 정보';
    }
    
    var cpc = ad.clicks > 0 ? Math.round(ad.spent / ad.clicks) : 0;
    var remainingBudget = ad.budget - ad.spent;
    
    if (modalBody) {
        modalBody.innerHTML = 
            '<div class="ad-detail">' +
                '<div class="detail-header">' +
                    '<img src="' + ad.adImg + '" alt="광고" class="detail-ad-img" ' +
                         'onerror="this.src=\'assets/default-ad.png\'">' +
                    '<div class="detail-info">' +
                        '<h4>' + escapeHtml(ad.title) + '</h4>' +
                        '<p class="advertiser-name">' + escapeHtml(ad.advertiser) + '</p>' +
                        '<span class="status-badge status-' + ad.status + '">' +
                            '<i class="fas fa-' + getStatusIcon(ad.status) + '"></i>' +
                            getStatusText(ad.status) +
                        '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="detail-tabs">' +
                    '<button class="tab-btn active" onclick="showTab(\'info\')">기본 정보</button>' +
                    '<button class="tab-btn" onclick="showTab(\'performance\')">성과 분석</button>' +
                    '<button class="tab-btn" onclick="showTab(\'settings\')">설정</button>' +
                '</div>' +
                '<div id="info-tab" class="tab-content active">' +
                    '<div class="detail-section">' +
                        '<h5>광고 정보</h5>' +
                        '<div class="detail-grid">' +
                            '<div class="detail-row">' +
                                '<label>카테고리:</label>' +
                                '<span>' + ad.category + '</span>' +
                            '</div>' +
                            '<div class="detail-row">' +
                                '<label>시작일:</label>' +
                                '<span>' + formatDate(ad.startDate) + '</span>' +
                            '</div>' +
                            '<div class="detail-row">' +
                                '<label>종료일:</label>' +
                                '<span>' + formatDate(ad.endDate) + '</span>' +
                            '</div>' +
                            '<div class="detail-row">' +
                                '<label>예산:</label>' +
                                '<span>' + ad.budget.toLocaleString() + '원</span>' +
                            '</div>' +
                            '<div class="detail-row">' +
                                '<label>사용 예산:</label>' +
                                '<span>' + ad.spent.toLocaleString() + '원</span>' +
                            '</div>' +
                            '<div class="detail-row">' +
                                '<label>잔여 예산:</label>' +
                                '<span>' + remainingBudget.toLocaleString() + '원</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="detail-section">' +
                        '<h5>타겟팅</h5>' +
                        '<div class="detail-grid">' +
                            '<div class="detail-row">' +
                                '<label>연령대:</label>' +
                                '<span>' + ad.targetAge + '세</span>' +
                            '</div>' +
                            '<div class="detail-row">' +
                                '<label>성별:</label>' +
                                '<span>' + ad.targetGender + '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="detail-section">' +
                        '<h5>설명</h5>' +
                        '<p>' + escapeHtml(ad.description) + '</p>' +
                    '</div>' +
                '</div>' +
                '<div id="performance-tab" class="tab-content">' +
                    '<div class="performance-summary">' +
                        '<div class="perf-card">' +
                            '<h6>조회수</h6>' +
                            '<div class="perf-number">' + ad.views.toLocaleString() + '</div>' +
                        '</div>' +
                        '<div class="perf-card">' +
                            '<h6>클릭수</h6>' +
                            '<div class="perf-number">' + ad.clicks.toLocaleString() + '</div>' +
                        '</div>' +
                        '<div class="perf-card">' +
                            '<h6>클릭률</h6>' +
                            '<div class="perf-number">' + ad.ctr + '%</div>' +
                        '</div>' +
                        '<div class="perf-card">' +
                            '<h6>CPC</h6>' +
                            '<div class="perf-number">' + cpc + '원</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="performance-chart">' +
                        '<h6>일별 성과 추이</h6>' +
                        '<div class="chart-placeholder">' +
                            '<p>차트는 실제 데이터 연동 후 표시됩니다.</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="settings-tab" class="tab-content">' +
                    '<div class="settings-section">' +
                        '<h6>광고 상태 관리</h6>' +
                        '<div class="status-controls">' +
                            (ad.status === 'active' ? 
                                '<button class="btn btn-warning" onclick="pauseAd(' + ad.id + ')">일시정지</button>' :
                                '<button class="btn btn-success" onclick="activateAd(' + ad.id + ')">활성화</button>'
                            ) +
                            '<button class="btn btn-primary" onclick="editAd(' + ad.id + ')">편집</button>' +
                            '<button class="btn btn-danger" onclick="deleteAd(' + ad.id + ')">삭제</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }
    
    var modal = document.getElementById('adModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * 탭 표시 (HTML에서 호출)
 */
function showTab(tabName) {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    
    for (var i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove('active');
    }
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    event.target.classList.add('active');
    var targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

/**
 * 광고 편집 (HTML에서 호출)
 */
function editAd(adId) {
    var ad = null;
    if (adId) {
        for (var i = 0; i < adsData.length; i++) {
            if (adsData[i].id === adId) {
                ad = adsData[i];
                break;
            }
        }
    }
    
    var editModalTitle = document.getElementById('editModalTitle');
    var adForm = document.getElementById('adForm');
    
    if (!ad) {
        // 새 광고 생성
        if (editModalTitle) {
            editModalTitle.textContent = '광고 생성';
        }
        if (adForm) {
            adForm.reset();
        }
        document.getElementById('imagePreview').innerHTML = '';
    } else {
        // 기존 광고 편집
        if (editModalTitle) {
            editModalTitle.textContent = '광고 편집';
        }
        document.getElementById('adTitle').value = ad.title;
        document.getElementById('adAdvertiser').value = ad.advertiser;
        document.getElementById('adCategory').value = ad.category;
        document.getElementById('adStartDate').value = ad.startDate;
        document.getElementById('adEndDate').value = ad.endDate;
        document.getElementById('adBudget').value = ad.budget;
        document.getElementById('adDescription').value = ad.description;
        
        // 현재 이미지 미리보기
        document.getElementById('imagePreview').innerHTML = 
            '<img src="' + ad.adImg + '" alt="현재 이미지" style="max-width: 200px; border-radius: 8px;">';
    }
    
    var editModal = document.getElementById('adEditModal');
    if (editModal) {
        editModal.style.display = 'block';
    }
    
    closeModal(); // 상세보기 모달 닫기
}

/**
 * 광고 저장 (폼 제출)
 */
function saveAd() {
    var formData = {
        title: document.getElementById('adTitle').value,
        advertiser: document.getElementById('adAdvertiser').value,
        category: document.getElementById('adCategory').value,
        startDate: document.getElementById('adStartDate').value,
        endDate: document.getElementById('adEndDate').value,
        budget: parseInt(document.getElementById('adBudget').value),
        description: document.getElementById('adDescription').value
    };

    // 유효성 검사
    if (!formData.title || !formData.advertiser || !formData.category || 
        !formData.startDate || !formData.endDate || !formData.budget) {
        showNotification('모든 필수 항목을 입력해주세요.', 'warning');
        return;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        showNotification('종료일은 시작일보다 늦어야 합니다.', 'warning');
        return;
    }

    // 실제로는 서버로 데이터 전송
    showNotification('광고가 저장되었습니다. (백엔드 구현 필요)', 'success');
    closeEditModal();
}

/**
 * 광고 활성화 (HTML에서 호출)
 */
function activateAd(adId) {
    var ad = null;
    for (var i = 0; i < adsData.length; i++) {
        if (adsData[i].id === adId) {
            ad = adsData[i];
            break;
        }
    }
    
    if (!ad) {
        showNotification('광고를 찾을 수 없습니다.', 'error');
        return;
    }

    if (confirm('이 광고를 활성화하시겠습니까?')) {
        ad.status = 'active';
        renderData();
        renderTopPerformers();
        updateStats();
        closeModal();
        showNotification(ad.title + ' 광고가 활성화되었습니다.', 'success');
    }
}

/**
 * 광고 일시정지 (HTML에서 호출)
 */
function pauseAd(adId) {
    var ad = null;
    for (var i = 0; i < adsData.length; i++) {
        if (adsData[i].id === adId) {
            ad = adsData[i];
            break;
        }
    }
    
    if (!ad) {
        showNotification('광고를 찾을 수 없습니다.', 'error');
        return;
    }

    if (confirm('이 광고를 일시정지하시겠습니까?')) {
        ad.status = 'paused';
        renderData();
        renderTopPerformers();
        updateStats();
        closeModal();
        showNotification(ad.title + ' 광고가 일시정지되었습니다.', 'success');
    }
}

/**
 * 광고 삭제 (HTML에서 호출)
 */
function deleteAd(adId) {
    var ad = null;
    for (var i = 0; i < adsData.length; i++) {
        if (adsData[i].id === adId) {
            ad = adsData[i];
            break;
        }
    }
    
    if (!ad) {
        showNotification('광고를 찾을 수 없습니다.', 'error');
        return;
    }

    if (confirm('정말로 \'' + ad.title + '\' 광고를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
        adsData = adsData.filter(function(a) { return a.id !== adId; });
        filteredData = filteredData.filter(function(a) { return a.id !== adId; });
        selectedAds.delete(adId);
        
        renderData();
        renderTopPerformers();
        updateStats();
        updateBulkActions();
        closeModal();
        showNotification(ad.title + ' 광고가 삭제되었습니다.', 'success');
    }
}

/**
 * 일괄 활성화 (HTML에서 호출)
 */
function bulkActivate() {
    if (selectedAds.size === 0) {
        showNotification('활성화할 광고를 선택해주세요.', 'warning');
        return;
    }
    
    if (confirm('선택된 ' + selectedAds.size + '개의 광고를 활성화하시겠습니까?')) {
        var selectedArray = Array.from(selectedAds);
        for (var i = 0; i < selectedArray.length; i++) {
            var adId = selectedArray[i];
            for (var j = 0; j < adsData.length; j++) {
                if (adsData[j].id === adId) {
                    adsData[j].status = 'active';
                    break;
                }
            }
        }
        
        selectedAds.clear();
        updateBulkActions();
        renderData();
        renderTopPerformers();
        updateStats();
        showNotification('선택된 광고들이 활성화되었습니다.', 'success');
    }
}

/**
 * 일괄 일시정지 (HTML에서 호출)
 */
function bulkPause() {
    if (selectedAds.size === 0) {
        showNotification('일시정지할 광고를 선택해주세요.', 'warning');
        return;
    }
    
    if (confirm('선택된 ' + selectedAds.size + '개의 광고를 일시정지하시겠습니까?')) {
        var selectedArray = Array.from(selectedAds);
        for (var i = 0; i < selectedArray.length; i++) {
            var adId = selectedArray[i];
            for (var j = 0; j < adsData.length; j++) {
                if (adsData[j].id === adId) {
                    adsData[j].status = 'paused';
                    break;
                }
            }
        }
        
        selectedAds.clear();
        updateBulkActions();
        renderData();
        renderTopPerformers();
        updateStats();
        showNotification('선택된 광고들이 일시정지되었습니다.', 'success');
    }
}

/**
 * 일괄 삭제 (HTML에서 호출)
 */
function bulkDelete() {
    if (selectedAds.size === 0) {
        showNotification('삭제할 광고를 선택해주세요.', 'warning');
        return;
    }
    
    if (confirm('선택된 ' + selectedAds.size + '개의 광고를 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
        adsData = adsData.filter(function(a) { return !selectedAds.has(a.id); });
        filteredData = filteredData.filter(function(a) { return !selectedAds.has(a.id); });
        
        var deletedCount = selectedAds.size;
        selectedAds.clear();
        updateBulkActions();
        renderData();
        renderTopPerformers();
        updateStats();
        showNotification(deletedCount + '개의 광고가 삭제되었습니다.', 'success');
    }
}

/**
 * 통계 업데이트
 */
function updateStats() {
    var totalAds = adsData.length;
    var activeAds = 0;
    var pausedAds = 0;
    var totalViews = 0;
    
    for (var i = 0; i < adsData.length; i++) {
        var ad = adsData[i];
        if (ad.status === 'active') activeAds++;
        if (ad.status === 'paused') pausedAds++;
        totalViews += ad.views;
    }

    updateElementText('totalAds', totalAds);
    updateElementText('activeAds', activeAds);
    updateElementText('pausedAds', pausedAds);
    updateElementText('totalViews', totalViews.toLocaleString());
}

/**
 * 테이블 정보 업데이트
 */
function updateTableInfo() {
    updateElementText('totalCount', filteredData.length.toLocaleString());
}

/**
 * 엘리먼트 텍스트 업데이트
 */
function updateElementText(id, text) {
    var element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * 데이터 내보내기 (HTML에서 호출)
 */
function exportAds() {
    if (filteredData.length === 0) {
        showNotification('내보낼 데이터가 없습니다.', 'warning');
        return;
    }

    try {
        var csvRows = ['ID,광고명,광고주,카테고리,시작일,종료일,조회수,클릭수,CTR,예산,사용예산,상태'];
        
        for (var i = 0; i < filteredData.length; i++) {
            var ad = filteredData[i];
            var row = ad.id + ',"' + ad.title + '","' + ad.advertiser + '","' + ad.category + 
                     '","' + ad.startDate + '","' + ad.endDate + '",' + ad.views + ',' + ad.clicks + 
                     ',' + ad.ctr + ',' + ad.budget + ',' + ad.spent + ',"' + getStatusText(ad.status) + '"';
            csvRows.push(row);
        }
        
        var csvContent = "data:text/csv;charset=utf-8,\ufeff" + csvRows.join('\n');

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "광고리포트_" + new Date().toISOString().split('T')[0] + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(filteredData.length + '개의 광고 데이터를 내보냈습니다.', 'success');
    } catch (error) {
        showNotification('데이터 내보내기에 실패했습니다.', 'error');
        console.error('Export error:', error);
    }
}

/**
 * 광고 생성 모달 열기 (HTML에서 호출)
 */
function openCreateAdModal() {
    editAd(null);
}

/**
 * 모달 닫기 (HTML에서 호출)
 */
function closeModal() {
    var modal = document.getElementById('adModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 편집 모달 닫기 (HTML에서 호출)
 */
function closeEditModal() {
    var modal = document.getElementById('adEditModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 이미지 미리보기
 */
function previewImage(event) {
    var file = event.target.files[0];
    var preview = document.getElementById('imagePreview');
    
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = '<img src="' + e.target.result + '" alt="미리보기" style="max-width: 200px; border-radius: 8px; box-shadow: var(--admin-shadow-card);">';
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

/**
 * 로딩 표시
 */
function showLoading() {
    isLoading = true;
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

/**
 * 로딩 숨기기
 */
function hideLoading() {
    isLoading = false;
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
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

    // 스타일 적용
    notification.style.cssText = 
        'position: fixed;' +
        'top: 90px;' +
        'right: 20px;' +
        'background: var(--admin-bg-white);' +
        'border: 1px solid var(--admin-border-color);' +
        'border-left: 4px solid ' + getNotificationColor(type) + ';' +
        'border-radius: 8px;' +
        'padding: 15px 20px;' +
        'box-shadow: var(--admin-shadow-hover);' +
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
 * 페이지 상단으로 스크롤
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== 유틸리티 함수들 =====

/**
 * 상태 텍스트 반환
 */
function getStatusText(status) {
    var statuses = {
        'active': '진행중',
        'paused': '일시정지',
        'ended': '종료',
        'scheduled': '예약'
    };
    return statuses[status] || status;
}

/**
 * 상태 아이콘 반환
 */
function getStatusIcon(status) {
    var iconMap = {
        'active': 'play',
        'paused': 'pause',
        'ended': 'stop',
        'scheduled': 'clock'
    };
    return iconMap[status] || 'question-circle';
}

/**
 * 알림 아이콘 반환
 */
function getNotificationIcon(type) {
    var iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return iconMap[type] || 'info-circle';
}

/**
 * 알림 색상 반환
 */
function getNotificationColor(type) {
    var colorMap = {
        'success': 'var(--success-color)',
        'error': 'var(--danger-color)',
        'warning': 'var(--warning-color)',
        'info': 'var(--admin-primary-color)'
    };
    return colorMap[type] || 'var(--admin-primary-color)';
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 디바운스 함수
 */
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 랜덤 날짜 생성 (테스트용)
 */
function getRandomDate() {
    var start = new Date(2025, 4, 1); // 5월 1일
    var end = new Date(2025, 4, 25); // 5월 25일
    var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

/**
 * 랜덤 미래 날짜 생성 (테스트용)
 */
function getRandomFutureDate() {
    var start = new Date(2025, 5, 1); // 6월 1일
    var end = new Date(2025, 7, 31); // 8월 31일
    var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

// CSS 애니메이션 추가 (동적으로)
(function() {
    var style = document.createElement('style');
    style.textContent = 
        '@keyframes slideInRight {' +
            'from { transform: translateX(100%); opacity: 0; }' +
            'to { transform: translateX(0); opacity: 1; }' +
        '}' +
        '@keyframes slideOutRight {' +
            'from { transform: translateX(0); opacity: 1; }' +
            'to { transform: translateX(100%); opacity: 0; }' +
        '}' +
        '.notification-content {' +
            'display: flex; align-items: center; gap: 10px; flex: 1;' +
        '}' +
        '.notification-close {' +
            'background: none; border: none; cursor: pointer;' +
            'color: var(--admin-text-light); padding: 5px; border-radius: 4px;' +
            'transition: var(--transition);' +
        '}' +
        '.notification-close:hover {' +
            'background-color: var(--admin-bg-light); color: var(--admin-text-dark);' +
        '}';
    document.head.appendChild(style);
})();