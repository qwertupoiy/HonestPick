// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeStoreList();
    initializeFilters();
});

// 매장 리스트 초기화
function initializeStoreList() {
    // 드롭다운 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.store-actions-dropdown')) {
            closeAllDropdowns();
        }
    });
}

// 필터링 기능 초기화
function initializeFilters() {
    var sortFilter = document.getElementById('sortFilter');
    var statusFilter = document.getElementById('statusFilter');
    var searchInput = document.querySelector('.search-input');
    var searchBtn = document.querySelector('.search-btn');

    // 정렬 필터 이벤트
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            applyFilters();
        });
    }

    // 상태 필터 이벤트
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }

    // 검색 기능
    if (searchInput) {
        var timeoutId;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                applyFilters();
            }, 300);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
}

// 필터 적용
function applyFilters() {
    var sortFilter = document.getElementById('sortFilter');
    var statusFilter = document.getElementById('statusFilter');
    var searchInput = document.querySelector('.search-input');
    
    var sortValue = sortFilter ? sortFilter.value : 'recent';
    var statusValue = statusFilter ? statusFilter.value : 'all';
    var searchValue = searchInput ? searchInput.value.toLowerCase() : '';

    var storeCards = document.querySelectorAll('.store-card');
    var visibleCards = [];

    storeCards.forEach(function(card) {
        var storeTitle = card.querySelector('.store-title');
        var storeCategory = card.querySelector('.store-category');
        var storeLocation = card.querySelector('.store-location');
        
        var storeName = storeTitle ? storeTitle.textContent.toLowerCase() : '';
        var categoryText = storeCategory ? storeCategory.textContent.toLowerCase() : '';
        var locationText = storeLocation ? storeLocation.textContent.toLowerCase() : '';
        var cardStatus = card.getAttribute('data-status') || 'open';

        // 검색 필터
        var matchesSearch = searchValue === '' || 
            storeName.indexOf(searchValue) !== -1 || 
            categoryText.indexOf(searchValue) !== -1 || 
            locationText.indexOf(searchValue) !== -1;

        // 상태 필터
        var matchesStatus = statusValue === 'all' || cardStatus === statusValue;

        if (matchesSearch && matchesStatus) {
            card.style.display = 'block';
            visibleCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });

    // 정렬 적용
    sortCards(visibleCards, sortValue);

    // 결과 수 업데이트
    updateResultCount(visibleCards.length);
}

// 카드 정렬
function sortCards(cards, sortType) {
    var container = document.querySelector('.store-cards');
    if (!container) return;
    
    cards.sort(function(a, b) {
        switch (sortType) {
            case 'name':
                var titleA = a.querySelector('.store-title');
                var titleB = b.querySelector('.store-title');
                var nameA = titleA ? titleA.textContent : '';
                var nameB = titleB ? titleB.textContent : '';
                return nameA.localeCompare(nameB);
            
            case 'rating':
                var ratingA = a.querySelector('.store-rating span');
                var ratingB = b.querySelector('.store-rating span');
                var scoreA = ratingA ? parseFloat(ratingA.textContent) || 0 : 0;
                var scoreB = ratingB ? parseFloat(ratingB.textContent) || 0 : 0;
                return scoreB - scoreA;
            
            case 'status':
                var statusA = a.getAttribute('data-status') || '';
                var statusB = b.getAttribute('data-status') || '';
                return statusA.localeCompare(statusB);
            
            case 'recent':
            default:
                return 0;
        }
    });

    // 정렬된 순서로 DOM에 다시 추가
    cards.forEach(function(card) {
        container.appendChild(card);
    });
}

// 결과 수 업데이트
function updateResultCount(count) {
    var countElement = document.querySelector('.count-number');
    if (countElement) {
        countElement.textContent = count;
    }
}

// 드롭다운 토글
function toggleDropdown(button) {
    var dropdown = button.nextElementSibling;
    var isVisible = dropdown.classList.contains('show');
    
    // 모든 드롭다운 닫기
    closeAllDropdowns();
    
    // 클릭한 드롭다운만 열기
    if (!isVisible) {
        dropdown.classList.add('show');
    }
}

// 모든 드롭다운 닫기
function closeAllDropdowns() {
    var dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('show');
    });
}

// 매장 삭제
function deleteStore(storeNo) {
    if (confirm('정말로 이 매장을 삭제하시겠습니까?\n삭제된 매장은 복구할 수 없습니다.')) {
        // 로딩 상태 표시
        showLoading();
        
        // 전역 변수들이 정의되어 있는지 확인
        var basePath = '';
        var memberNo = '';
        
        if (typeof path !== 'undefined') {
            basePath = path;
        }
        
        if (typeof sessionScope !== 'undefined' && sessionScope.MemberNo) {
            memberNo = sessionScope.MemberNo;
        }
        
        // 서버에 삭제 요청
        window.location.href = basePath + '/Store_servlet/storeDelete.do?StoreNo=' + storeNo + '&MemberNo=' + memberNo;
    }
}

// 로딩 상태 표시
function showLoading() {
    // 기존 로딩 오버레이가 있으면 제거
    var existingOverlay = document.getElementById('loadingOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // 로딩 오버레이 생성
    var loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.zIndex = '9999';
    
    var spinner = document.createElement('div');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid #4a90e2';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#spinnerStyle')) {
        var style = document.createElement('style');
        style.id = 'spinnerStyle';
        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
    
    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
}

// 로딩 상태 제거
function hideLoading() {
    var loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// ESC 키로 드롭다운 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllDropdowns();
    }
});

// 페이지 언로드 시 로딩 제거
window.addEventListener('beforeunload', function() {
    hideLoading();
});