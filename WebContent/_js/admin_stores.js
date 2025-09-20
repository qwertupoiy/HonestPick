/**
 * 가게 관리 페이지 JavaScript - 완전히 수정된 버전
 * HonestPick 관리자 시스템
 */

// ===== 전역 변수 =====
var currentSection = 'all';
var selectedStores = new Set();
var currentPage = 1;
var pageSize = 25;
var totalItems = 0;
var isEditMode = false;

// ===== 메인 초기화 함수 =====
function initializeAdminStores() {
    console.log('가게 관리 시스템 초기화 시작');
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 통계 계산
    calculateInitialStats();
    
    // URL 파라미터 확인
    checkUrlParams();
    
    console.log('가게 관리 시스템 초기화 완료');
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    // 서브 네비게이션 버튼
    document.querySelectorAll('.sub-nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var section = this.getAttribute('data-section');
            switchSection(section);
        });
    });

    // 필터 버튼
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            setActiveFilter(this);
            applyFilter(this.getAttribute('data-filter'));
        });
    });

    // 검색 입력
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 실시간 검색 (300ms 지연)
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }

    // 전체 선택 체크박스
    var selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', toggleSelectAll);
    }

    // 모달 관련 이벤트
    setupModalEvents();
    
    // 파일 업로드 이벤트
    setupFileUploadEvents();
}

// ===== 모달 이벤트 설정 =====
function setupModalEvents() {
    var modal = document.getElementById('storeModal');
    if (modal) {
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
}

// ===== 파일 업로드 이벤트 설정 =====
function setupFileUploadEvents() {
    var fileInput = document.getElementById('modalStoreImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var preview = document.getElementById('modalStoreImagePreview');
                    if (preview) {
                        preview.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ===== 초기 통계 계산 =====
function calculateInitialStats() {
    var tableRows = document.querySelectorAll('#storesTable tbody tr.table-row');
    var totalCount = tableRows.length;
    var newCount = 0;
    
    // 최근 7일 내 등록된 가게 계산
    var now = new Date();
    var sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    tableRows.forEach(function(row) {
        var dateCell = row.querySelector('[data-register-date]');
        if (dateCell) {
            var registerDate = new Date(dateCell.getAttribute('data-register-date'));
            if (registerDate >= sevenDaysAgo) {
                newCount++;
            }
        }
    });
    
    // 배지 업데이트
    updateElementText('newBadge', newCount);
    updateElementText('totalCount', totalCount);
    
    console.log('초기 통계 계산 완료:', { total: totalCount, new: newCount });
}

// ===== URL 파라미터 확인 =====
function checkUrlParams() {
    var urlParams = new URLSearchParams(window.location.search);
    var section = urlParams.get('section') || 'all';
    switchSection(section);
}

// ===== 섹션 전환 =====
function switchSection(section) {
    currentSection = section;
    
    // 네비게이션 업데이트
    document.querySelectorAll('.sub-nav-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-section') === section);
    });
    
    // 콘텐츠 섹션 표시/숨김
    document.querySelectorAll('.content-section').forEach(function(sec) {
        sec.classList.toggle('active', sec.id === section + '-section');
    });
    
    // 섹션별 처리
    switch (section) {
        case 'all':
            showAllStores();
            break;
        case 'pending':
            showPendingStores();
            break;
        case 'new':
            showNewStores();
            break;
        case 'suspended':
            showSuspendedStores();
            break;
    }
    
    // URL 업데이트
    var newUrl = window.location.pathname + '?section=' + section;
    window.history.pushState({ section: section }, '', newUrl);
}

// ===== 전체 가게 표시 =====
function showAllStores() {
    // 모든 행 표시
    document.querySelectorAll('#storesTable tbody tr').forEach(function(row) {
        row.style.display = '';
    });
    
    // 필터 초기화
    setActiveFilter(document.querySelector('.filter-btn[data-filter="all"]'));
    
    // 검색 초기화
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

// ===== 승인 대기 가게 표시 =====
function showPendingStores() {
    var container = document.getElementById('pendingStoresGrid');
    if (container) {
        container.innerHTML = '<div class="no-data-message">' +
            '<i class="fas fa-clock"></i>' +
            '<p>승인 대기 중인 가게가 없습니다.</p>' +
            '<p>모든 가게가 승인 처리되었습니다.</p>' +
            '</div>';
    }
}

// ===== 신규 등록 가게 표시 =====
function showNewStores() {
    var container = document.getElementById('newStoresTimeline');
    if (!container) return;
    
    var tableRows = document.querySelectorAll('#storesTable tbody tr.table-row');
    var newStores = [];
    var now = new Date();
    var sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    tableRows.forEach(function(row) {
        var dateCell = row.querySelector('[data-register-date]');
        if (dateCell) {
            var registerDate = new Date(dateCell.getAttribute('data-register-date'));
            if (registerDate >= sevenDaysAgo) {
                var storeData = extractStoreDataFromRow(row);
                if (storeData) {
                    newStores.push(storeData);
                }
            }
        }
    });
    
    if (newStores.length === 0) {
        container.innerHTML = '<div class="no-data-message">' +
            '<i class="fas fa-plus-circle"></i>' +
            '<p>최근 일주일간 새로 등록된 가게가 없습니다.</p>' +
            '</div>';
    } else {
        var timelineHTML = newStores.map(createTimelineItem).join('');
        container.innerHTML = timelineHTML;
    }
}

// ===== 정지된 가게 표시 =====
function showSuspendedStores() {
    var container = document.getElementById('suspendedStoresList');
    if (container) {
        container.innerHTML = '<div class="no-data-message">' +
            '<i class="fas fa-ban"></i>' +
            '<p>정지된 가게가 없습니다.</p>' +
            '<p>모든 가게가 정상 운영 중입니다.</p>' +
            '</div>';
    }
}

// ===== 타임라인 아이템 생성 =====
function createTimelineItem(store) {
    return '<div class="timeline-item">' +
        '<div class="timeline-marker"></div>' +
        '<div class="timeline-content">' +
            '<div class="timeline-header">' +
                '<h4>' + escapeHtml(store.name) + '</h4>' +
                '<span class="timeline-date">' + formatDate(store.registerDate) + '</span>' +
            '</div>' +
            '<div class="timeline-body">' +
                '<div class="store-info">' +
                    '<div class="store-details">' +
                        '<p><i class="fas fa-utensils"></i> ' + getCategoryText(store.category) + '</p>' +
                        '<p><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(store.location) + '</p>' +
                        '<p><i class="fas fa-user"></i> ' + escapeHtml(store.owner) + '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="timeline-actions">' +
                    '<button class="btn btn-sm btn-outline" onclick="viewStoreDetail(' + store.id + ')">상세보기</button>' +
                    '<span class="status-badge status-active">운영중</span>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ===== 행에서 가게 데이터 추출 =====
function extractStoreDataFromRow(row) {
    var nameLink = row.querySelector('.store-name-link');
    if (!nameLink) return null;
    
    return {
        id: row.getAttribute('data-store-id'),
        name: nameLink.getAttribute('data-name') || '',
        category: nameLink.getAttribute('data-category') || '',
        location: nameLink.getAttribute('data-location') || '',
        owner: nameLink.getAttribute('data-owner') || '',
        registerDate: nameLink.getAttribute('data-register-date') || ''
    };
}

// ===== 필터 관련 함수들 =====
function setActiveFilter(activeBtn) {
    if (!activeBtn) return;
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

function applyFilter(filter) {
    var tableRows = document.querySelectorAll('#storesTable tbody tr.table-row');
    var visibleCount = 0;
    
    tableRows.forEach(function(row) {
        var shouldShow = true;
        
        if (filter !== 'all') {
            var categoryCell = row.querySelector('[data-category]');
            if (categoryCell) {
                var category = categoryCell.getAttribute('data-category');
                shouldShow = category === filter;
            }
        }
        
        row.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    updateElementText('totalCount', visibleCount);
    updatePagination();
}

// ===== 검색 함수 =====
function performSearch() {
    var searchInput = document.getElementById('searchInput');
    var searchType = document.getElementById('searchType');
    var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var searchTypeValue = searchType ? searchType.value : 'all';
    
    var tableRows = document.querySelectorAll('#storesTable tbody tr.table-row');
    var visibleCount = 0;
    
    tableRows.forEach(function(row) {
        var shouldShow = true;
        
        if (searchTerm) {
            var searchTargets = [];
            
            switch (searchTypeValue) {
                case 'name':
                    var nameEl = row.querySelector('[data-name]');
                    if (nameEl) searchTargets.push(nameEl.getAttribute('data-name'));
                    break;
                case 'owner':
                    var ownerEl = row.querySelector('[data-owner]');
                    if (ownerEl) searchTargets.push(ownerEl.getAttribute('data-owner'));
                    break;
                case 'location':
                    var locationEl = row.querySelector('[data-location]');
                    if (locationEl) searchTargets.push(locationEl.getAttribute('data-location'));
                    break;
                case 'all':
                default:
                    var nameEl = row.querySelector('[data-name]');
                    var ownerEl = row.querySelector('[data-owner]');
                    var locationEl = row.querySelector('[data-location]');
                    if (nameEl) searchTargets.push(nameEl.getAttribute('data-name'));
                    if (ownerEl) searchTargets.push(ownerEl.getAttribute('data-owner'));
                    if (locationEl) searchTargets.push(locationEl.getAttribute('data-location'));
                    break;
            }
            
            shouldShow = searchTargets.some(function(target) {
                return target && target.toLowerCase().includes(searchTerm);
            });
        }
        
        row.style.display = shouldShow ? '' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    updateElementText('totalCount', visibleCount);
    updatePagination();
}

// ===== 체크박스 관련 함수들 =====
function toggleSelectAll() {
    var selectAll = document.getElementById('selectAll');
    var checkboxes = document.querySelectorAll('.store-checkbox');
    var isChecked = selectAll.checked;
    
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked;
        var storeId = parseInt(checkbox.value);
        if (isChecked) {
            selectedStores.add(storeId);
        } else {
            selectedStores.delete(storeId);
        }
    });
    
    updateBulkActions();
}

function toggleStoreSelection(storeId) {
    if (selectedStores.has(storeId)) {
        selectedStores.delete(storeId);
    } else {
        selectedStores.add(storeId);
    }
    
    updateBulkActions();
    updateSelectAllState();
}

function updateSelectAllState() {
    var selectAll = document.getElementById('selectAll');
    var checkboxes = document.querySelectorAll('.store-checkbox:not([style*="display: none"])');
    var checkedCount = 0;
    
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) checkedCount++;
    });
    
    if (selectAll) {
        selectAll.checked = checkedCount > 0 && checkedCount === checkboxes.length;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }
}

function updateBulkActions() {
    var bulkActions = document.getElementById('bulkActions');
    var selectedCount = document.getElementById('selectedCount');
    
    if (selectedStores.size > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = selectedStores.size;
    } else {
        bulkActions.style.display = 'none';
    }
}

// ===== data 속성으로부터 가게 상세 모달 열기 =====
function openStoreDetailFromData(element) {
    console.log('모달 열기 시작:', element);
    
    var storeData = {
        storeNo: element.getAttribute('data-store-no'),
        memberNo: element.getAttribute('data-member-no'),
        storeName: element.getAttribute('data-store-name'),
        storeCategory: element.getAttribute('data-store-category'),
        officeName: element.getAttribute('data-office-name'),
        storeContact: element.getAttribute('data-store-contact'),
        storePostalCode: element.getAttribute('data-store-postal-code'),
        storeAddr: element.getAttribute('data-store-addr'),
        storeStreetAddr: element.getAttribute('data-store-street-addr'),
        storeAdditionalInfo: element.getAttribute('data-store-additional-info'),
        storeBusinessNum: element.getAttribute('data-store-business-num'),
        storeImage: element.getAttribute('data-store-image'),
        storeSchedule: element.getAttribute('data-store-schedule'),
        storeComment: element.getAttribute('data-store-comment'),
        storeFacilities: element.getAttribute('data-store-facilities'),
        storeRegidate: element.getAttribute('data-store-regidate'),
        storeUpdate: element.getAttribute('data-store-update'),
        ownerName: element.getAttribute('data-owner-name')
    };
    
    console.log('추출된 가게 데이터:', storeData);
    openStoreDetailModal(storeData);
}

// ===== 모달 관련 함수들 =====
function openStoreDetailModal(storeData) {
    console.log('모달 데이터 설정 시작:', storeData);
    
    if (!storeData) {
        console.error('가게 데이터가 없습니다.');
        return;
    }
    
    // Hidden 필드 설정
    setElementValue('storeNoHidden', storeData.storeNo);
    setElementValue('hiddenMemberNo', storeData.memberNo);
    
    // 기본 정보 설정
    setElementValue('modalStoreName', storeData.storeName);
    setElementValue('modalStoreCategory', storeData.storeCategory);
    setElementValue('modalOfficeName', storeData.officeName);
    setElementValue('modalStoreContact', storeData.storeContact);
    setElementValue('modalStoreBusinessNum', storeData.storeBusinessNum);
    
    // 주소 정보 설정
    setElementValue('modalStorePostcode', storeData.storePostalCode);
    setElementValue('modalStoreAddress', storeData.storeAddr);
    setElementValue('modalStoreDetailAddress', storeData.storeStreetAddr);
    setElementValue('modalStoreExtraAddress', storeData.storeAdditionalInfo);
    
    // 운영 정보 설정
    setElementValue('modalStoreSchedule', storeData.storeSchedule);
    setElementValue('modalStoreFacilities', storeData.storeFacilities);
    setElementValue('modalStoreComment', storeData.storeComment);
    
    // 등록 정보 설정
    setElementValue('modalStoreRegidate', storeData.storeRegidate);
    setElementValue('modalStoreUpdate', storeData.storeUpdate);
    
    // 이미지 설정
    var imagePreview = document.getElementById('modalStoreImagePreview');
    if (imagePreview && storeData.storeImage) {
        imagePreview.src = storeData.storeImage;
        console.log('이미지 설정:', storeData.storeImage);
    }
    
    // 읽기 전용 모드로 설정
    setFormReadonly(true);
    
    // 모달 표시
    showModal();
    console.log('모달 표시 완료');
}

function showModal() {
    var modal = document.getElementById('storeModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('모달 표시됨');
    } else {
        console.error('모달 요소를 찾을 수 없습니다.');
    }
}

function closeModal() {
    var modal = document.getElementById('storeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('모달 닫힘');
    }
    
    // 폼 초기화
    resetForm();
}

function resetForm() {
    var form = document.getElementById('storeDetailForm');
    if (form) {
        form.reset();
    }
    
    // 편집 모드 해제
    isEditMode = false;
    setFormReadonly(true);
    
    // 버튼 상태 복원
    var editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> 정보 수정';
        editBtn.setAttribute('onclick', 'enableStoreEdit()');
    }
}

// ===== 편집 관련 함수들 =====
function enableStoreEdit() {
    isEditMode = true;
    setFormReadonly(false);
    
    var editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-save"></i> 저장';
        editBtn.setAttribute('onclick', 'saveStoreInfo()');
    }
    
    showNotification('가게 정보를 수정할 수 있습니다.', 'info');
}

function setFormReadonly(readonly) {
    var formElements = [
        'modalStoreName', 'modalStoreCategory', 'modalOfficeName',
        'modalStoreContact', 'modalStoreBusinessNum', 'modalStorePostcode',
        'modalStoreAddress', 'modalStoreDetailAddress', 'modalStoreExtraAddress',
        'modalStoreSchedule', 'modalStoreFacilities', 'modalStoreComment'
    ];
    
    formElements.forEach(function(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            if (element.tagName === 'SELECT') {
                element.disabled = readonly;
            } else {
                element.readOnly = readonly;
            }
            
            // 스타일 적용
            element.style.backgroundColor = readonly ? '#f8f9fa' : '#fff';
            element.style.cursor = readonly ? 'default' : 'text';
        }
    });
    
    // 파일 업로드 버튼
    var imagePreview = document.querySelector('.store-image-preview');
    if (imagePreview) {
        imagePreview.style.pointerEvents = readonly ? 'none' : 'auto';
        imagePreview.style.cursor = readonly ? 'default' : 'pointer';
    }
    
    // 편집 모드일 때 포맷팅 이벤트 추가
    if (!readonly) {
        setupFormattingEvents();
    }
}

// ===== 포맷팅 이벤트 설정 =====
function setupFormattingEvents() {
    // 전화번호 포맷팅
    var phoneInput = document.getElementById('modalStoreContact');
    if (phoneInput) {
        // 기존 이벤트 리스너 제거 (있다면)
        phoneInput.removeEventListener('input', handlePhoneInput);
        phoneInput.removeEventListener('keydown', handlePhoneKeydown);
        
        // 새 이벤트 리스너 추가
        phoneInput.addEventListener('input', handlePhoneInput);
        phoneInput.addEventListener('keydown', handlePhoneKeydown);
    }
    
    // 사업자번호 포맷팅
    var businessInput = document.getElementById('modalStoreBusinessNum');
    if (businessInput) {
        // 기존 이벤트 리스너 제거 (있다면)
        businessInput.removeEventListener('input', handleBusinessInput);
        businessInput.removeEventListener('keydown', handleBusinessKeydown);
        
        // 새 이벤트 리스너 추가
        businessInput.addEventListener('input', handleBusinessInput);
        businessInput.addEventListener('keydown', handleBusinessKeydown);
    }
}

// 전화번호 입력 처리
function handlePhoneInput(e) {
    formatPhoneNumber(e.target);
}

// 전화번호 키 입력 처리
function handlePhoneKeydown(e) {
    // 백스페이스와 Delete 키 허용
    if (e.key === 'Backspace' || e.key === 'Delete') {
        return;
    }
    
    // 숫자와 네비게이션 키만 허용
    if (!/[0-9]/.test(e.key) && !['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
    }
}

// 사업자번호 입력 처리
function handleBusinessInput(e) {
    formatBusinessNumber(e.target);
}

// 사업자번호 키 입력 처리
function handleBusinessKeydown(e) {
    // 백스페이스와 Delete 키 허용
    if (e.key === 'Backspace' || e.key === 'Delete') {
        return;
    }
    
    // 숫자와 네비게이션 키만 허용
    if (!/[0-9]/.test(e.key) && !['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
    }
}

function saveStoreInfo() {
    if (!validateStoreForm()) {
        return;
    }
    
    if (confirm('가게 정보를 저장하시겠습니까?')) {
        var form = document.getElementById('storeDetailForm');
        if (form) {
            showLoading();
            form.submit();
        }
    }
}

function validateStoreForm() {
    var storeName = getElementValue('modalStoreName').trim();
    var storeContact = getElementValue('modalStoreContact').trim();
    var storeBusinessNum = getElementValue('modalStoreBusinessNum').trim();
    
    if (!storeName) {
        showNotification('가게명을 입력해주세요.', 'error');
        focusElement('modalStoreName');
        return false;
    }
    
    if (storeName.length < 2 || storeName.length > 20) {
        showNotification('가게명은 2-20자 이내로 입력해주세요.', 'error');
        focusElement('modalStoreName');
        return false;
    }
    
    if (!storeContact) {
        showNotification('전화번호를 입력해주세요.', 'error');
        focusElement('modalStoreContact');
        return false;
    }
    
    // 전화번호 유효성 검사
    if (!isValidPhoneFormat(storeContact)) {
        showNotification('올바른 전화번호 형식이 아닙니다.', 'error');
        focusElement('modalStoreContact');
        return false;
    }
    
    if (!storeBusinessNum) {
        showNotification('사업자번호를 입력해주세요.', 'error');
        focusElement('modalStoreBusinessNum');
        return false;
    }
    
    // 사업자번호 유효성 검사
    if (!/^\d{3}-\d{2}-\d{5}$/.test(storeBusinessNum)) {
        showNotification('올바른 사업자번호 형식이 아닙니다. (000-00-00000)', 'error');
        focusElement('modalStoreBusinessNum');
        return false;
    }
    
    return true;
}

// ===== 액션 함수들 =====
function viewStoreDetail(storeId) {
    // 테이블에서 해당 가게의 링크를 찾아 클릭
    var storeLink = document.querySelector('[data-store-id="' + storeId + '"] .store-name-link');
    if (storeLink) {
        storeLink.click();
    }
}

function editStoreInfo(storeId) {
    viewStoreDetail(storeId);
    setTimeout(function() {
        enableStoreEdit();
    }, 100);
}

function deleteStoreConfirm(storeId, storeName) {
    if (confirm('정말로 \'' + storeName + '\' 가게를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
        deleteStoreById(storeId);
    }
}

function deleteStoreFromModal() {
    var storeNo = getElementValue('storeNoHidden');
    var storeName = getElementValue('modalStoreName');
    
    if (!storeNo) {
        showNotification('가게 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    deleteStoreConfirm(storeNo, storeName);
}

function deleteStoreById(storeId) {
    showLoading();
    
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = path + '/Admin_servlet/storeRemove.do';
    
    var storeNoInput = document.createElement('input');
    storeNoInput.type = 'hidden';
    storeNoInput.name = 'StoreNo';
    storeNoInput.value = storeId;
    
    form.appendChild(storeNoInput);
    document.body.appendChild(form);
    form.submit();
}

// ===== 일괄 작업 함수들 =====
function bulkApprove() {
    if (selectedStores.size === 0) {
        showNotification('승인할 가게를 선택해주세요.', 'warning');
        return;
    }
    
    if (confirm('선택된 ' + selectedStores.size + '개의 가게를 승인하시겠습니까?')) {
        showNotification('일괄 승인 기능은 구현 예정입니다.', 'info');
    }
}

function bulkSuspend() {
    if (selectedStores.size === 0) {
        showNotification('정지할 가게를 선택해주세요.', 'warning');
        return;
    }
    
    var reason = prompt('정지 사유를 입력하세요:');
    if (reason && reason.trim()) {
        showNotification('일괄 정지 기능은 구현 예정입니다.', 'info');
    }
}

function bulkDelete() {
    if (selectedStores.size === 0) {
        showNotification('삭제할 가게를 선택해주세요.', 'warning');
        return;
    }
    
    if (confirm('선택된 ' + selectedStores.size + '개의 가게를 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
        showNotification('일괄 삭제 기능은 구현 예정입니다.', 'info');
    }
}

// ===== 기타 액션 함수들 =====
function exportStores() {
    var visibleRows = document.querySelectorAll('#storesTable tbody tr.table-row:not([style*="display: none"])');
    
    if (visibleRows.length === 0) {
        showNotification('내보낼 데이터가 없습니다.', 'warning');
        return;
    }
    
    try {
        var csvContent = 'data:text/csv;charset=utf-8,\ufeff';
        csvContent += 'ID,가게명,카테고리,지역,점주,등록일\n';
        
        visibleRows.forEach(function(row) {
            var storeData = extractStoreDataFromRow(row);
            if (storeData) {
                csvContent += storeData.id + ',"' + storeData.name + '","' + 
                    getCategoryText(storeData.category) + '","' + storeData.location + 
                    '","' + storeData.owner + '","' + storeData.registerDate + '"\n';
            }
        });
        
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', '가게목록_' + formatDateForFile(new Date()) + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(visibleRows.length + '개의 가게 데이터를 내보냈습니다.', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('데이터 내보내기에 실패했습니다.', 'error');
    }
}

function openAddStoreModal() {
    showNotification('가게 추가 기능은 구현 예정입니다.', 'info');
}

// ===== 페이지네이션 관련 =====
function updatePagination() {
    var visibleRows = document.querySelectorAll('#storesTable tbody tr.table-row:not([style*="display: none"])');
    totalItems = visibleRows.length;
    var totalPages = Math.ceil(totalItems / pageSize);
    
    // 페이지네이션 HTML 생성
    var paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        updatePaginationInfo();
        return;
    }
    
    var paginationHTML = '';
    
    // 이전 버튼
    if (currentPage > 1) {
        paginationHTML += '<button onclick="changePage(' + (currentPage - 1) + ')" class="pagination-btn">' +
            '<i class="fas fa-chevron-left"></i></button>';
    }
    
    // 페이지 번호들
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);
    
    for (var i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += '<button class="pagination-btn active">' + i + '</button>';
        } else {
            paginationHTML += '<button onclick="changePage(' + i + ')" class="pagination-btn">' + i + '</button>';
        }
    }
    
    // 다음 버튼
    if (currentPage < totalPages) {
        paginationHTML += '<button onclick="changePage(' + (currentPage + 1) + ')" class="pagination-btn">' +
            '<i class="fas fa-chevron-right"></i></button>';
    }
    
    paginationContainer.innerHTML = paginationHTML;
    updatePaginationInfo();
}

function changePage(page) {
    if (page < 1 || page > Math.ceil(totalItems / pageSize)) return;
    
    currentPage = page;
    updatePagination();
    scrollToTop();
}

function changePageSize() {
    var pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSize = parseInt(pageSizeSelect.value);
        currentPage = 1;
        updatePagination();
    }
}

function updatePaginationInfo() {
    var startIndex = Math.min((currentPage - 1) * pageSize + 1, totalItems);
    var endIndex = Math.min(currentPage * pageSize, totalItems);
    
    var paginationInfo = document.getElementById('paginationInfo');
    if (paginationInfo) {
        if (totalItems === 0) {
            paginationInfo.textContent = '0개의 가게';
        } else {
            paginationInfo.textContent = startIndex + '-' + endIndex + ' of ' + totalItems + ' 가게';
        }
    }
}

// ===== 정렬 관련 =====
function sortTable(column) {
    console.log('테이블 정렬:', column);
    showNotification('정렬 기능은 구현 예정입니다.', 'info');
}

// ===== 전화번호 포맷팅 함수 =====
function formatPhoneNumber(input) {
    // 숫자만 추출
    var numbers = input.value.replace(/\D/g, '');
    var formattedNumber = '';
    
    if (numbers.length === 0) {
        input.value = '';
        return;
    }
    
    // 010으로 시작하는 휴대폰 번호 포맷팅
    if (numbers.startsWith('01')) {
        if (numbers.length <= 3) {
            formattedNumber = numbers;
        } else if (numbers.length <= 7) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3);
        } else if (numbers.length <= 11) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        } else {
            // 11자리 초과시 자름
            numbers = numbers.slice(0, 11);
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        }
    }
    // 02로 시작하는 서울 지역번호 (02-0000-0000 또는 02-000-0000)
    else if (numbers.startsWith('02')) {
        if (numbers.length <= 2) {
            formattedNumber = numbers;
        } else if (numbers.length <= 5) {
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2);
        } else if (numbers.length <= 9) {
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2, 5) + '-' + numbers.slice(5);
        } else if (numbers.length <= 10) {
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6);
        } else {
            // 10자리 초과시 자름
            numbers = numbers.slice(0, 10);
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6);
        }
    }
    // 기타 지역번호 (031, 032 등 - 0XX-000-0000 또는 0XX-0000-0000)
    else if (numbers.startsWith('0') && numbers.length >= 3) {
        if (numbers.length <= 3) {
            formattedNumber = numbers;
        } else if (numbers.length <= 6) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3);
        } else if (numbers.length <= 10) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 6) + '-' + numbers.slice(6);
        } else if (numbers.length <= 11) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        } else {
            // 11자리 초과시 자름
            numbers = numbers.slice(0, 11);
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        }
    }
    // 그 외의 경우는 숫자만 표시
    else {
        formattedNumber = numbers;
    }
    
    input.value = formattedNumber;
    
    // 포맷팅 상태에 따라 클래스 추가/제거
    if (isValidPhoneFormat(formattedNumber)) {
        input.classList.add('phone-input');
        input.style.color = 'var(--success-color)';
    } else {
        input.classList.remove('phone-input');
        input.style.color = 'var(--admin-text-dark)';
    }
}

// ===== 전화번호 유효성 검사 =====
function isValidPhoneFormat(phoneNumber) {
    // 휴대폰: 010-0000-0000
    var mobilePattern = /^01[0-9]-\d{4}-\d{4}$/;
    // 서울: 02-000-0000 또는 02-0000-0000
    var seoulPattern = /^02-\d{3,4}-\d{4}$/;
    // 기타 지역: 0XX-000-0000 또는 0XX-0000-0000
    var localPattern = /^0\d{2}-\d{3,4}-\d{4}$/;
    
    return mobilePattern.test(phoneNumber) || seoulPattern.test(phoneNumber) || localPattern.test(phoneNumber);
}

// ===== 사업자번호 포맷팅 함수 =====
function formatBusinessNumber(input) {
    // 숫자만 추출
    var numbers = input.value.replace(/\D/g, '');
    
    if (numbers.length === 0) {
        input.value = '';
        return;
    }
    
    // 사업자번호는 10자리: 000-00-00000
    if (numbers.length <= 3) {
        input.value = numbers;
    } else if (numbers.length <= 5) {
        input.value = numbers.slice(0, 3) + '-' + numbers.slice(3);
    } else if (numbers.length <= 10) {
        input.value = numbers.slice(0, 3) + '-' + numbers.slice(3, 5) + '-' + numbers.slice(5);
    } else {
        // 10자리 초과시 자름
        numbers = numbers.slice(0, 10);
        input.value = numbers.slice(0, 3) + '-' + numbers.slice(3, 5) + '-' + numbers.slice(5);
    }
    
    // 유효한 형식인지 확인
    if (/^\d{3}-\d{2}-\d{5}$/.test(input.value)) {
        input.style.color = 'var(--success-color)';
    } else {
        input.style.color = 'var(--admin-text-dark)';
    }
}

// ===== 유틸리티 함수들 =====
function updateElementText(id, text) {
    var element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function setElementValue(id, value) {
    var element = document.getElementById(id);
    if (element) {
        element.value = value || '';
        console.log('설정됨:', id, '=', value);
    } else {
        console.warn('요소를 찾을 수 없음:', id);
    }
}

function getElementValue(id) {
    var element = document.getElementById(id);
    return element ? element.value : '';
}

function focusElement(id) {
    var element = document.getElementById(id);
    if (element) {
        element.focus();
    }
}

function getCategoryText(category) {
    var categories = {
        'korean': '한식',
        'chinese': '중식',
        'japanese': '일식',
        'western': '양식',
        'cafe': '카페'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        var date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    } catch (error) {
        return dateString;
    }
}

function formatDateForFile(date) {
    return date.toISOString().split('T')[0];
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
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

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== 로딩 및 알림 관련 =====
function showLoading() {
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideLoading() {
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showNotification(message, type) {
    type = type || 'info';
    
    // 기존 알림 제거
    var existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    
    var iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    var colorMap = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    
    notification.innerHTML = 
        '<div class="notification-content">' +
            '<i class="fas fa-' + iconMap[type] + '"></i>' +
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
        'background: white;' +
        'border: 1px solid #e0e0e0;' +
        'border-left: 4px solid ' + colorMap[type] + ';' +
        'border-radius: 8px;' +
        'padding: 15px 20px;' +
        'box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
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

// ===== CSS 애니메이션 추가 =====
(function() {
    if (document.getElementById('admin-notification-styles')) return;
    
    var style = document.createElement('style');
    style.id = 'admin-notification-styles';
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
            'color: #666; padding: 5px; border-radius: 4px;' +
            'transition: all 0.2s ease;' +
        '}' +
        '.notification-close:hover {' +
            'background-color: #f5f5f5; color: #333;' +
        '}' +
        '.no-data-message {' +
            'text-align: center; padding: 60px 20px; color: #666;' +
        '}' +
        '.no-data-message i {' +
            'font-size: 4rem; margin-bottom: 20px; opacity: 0.3;' +
        '}' +
        '.no-data-message p {' +
            'font-size: 1.1rem; margin-bottom: 10px;' +
        '}' +
        '.no-data-message p:last-child {' +
            'font-size: 0.9rem; opacity: 0.8;' +
        '}' +
        '.pagination-btn {' +
            'background: white; border: 1px solid #ddd; padding: 8px 12px;' +
            'margin: 0 2px; cursor: pointer; border-radius: 4px;' +
            'transition: all 0.2s ease;' +
        '}' +
        '.pagination-btn:hover {' +
            'background: #f8f9fa; border-color: #adb5bd;' +
        '}' +
        '.pagination-btn.active {' +
            'background: #007bff; color: white; border-color: #007bff;' +
        '}' +
        '.pagination-btn:disabled {' +
            'opacity: 0.5; cursor: not-allowed;' +
        '}' +
        '.timeline-item {' +
            'display: flex; margin-bottom: 30px; position: relative;' +
        '}' +
        '.timeline-marker {' +
            'width: 12px; height: 12px; background: #007bff;' +
            'border-radius: 50%; margin-right: 20px; margin-top: 6px;' +
            'position: relative; z-index: 1;' +
        '}' +
        '.timeline-marker::after {' +
            'content: ""; position: absolute; top: 12px; left: 50%;' +
            'width: 2px; height: 50px; background: #e9ecef;' +
            'transform: translateX(-50%);' +
        '}' +
        '.timeline-content {' +
            'flex: 1; background: white; padding: 20px;' +
            'border: 1px solid #e9ecef; border-radius: 8px;' +
            'box-shadow: 0 2px 4px rgba(0,0,0,0.1);' +
        '}' +
        '.timeline-header {' +
            'display: flex; justify-content: space-between;' +
            'align-items: center; margin-bottom: 15px;' +
        '}' +
        '.timeline-header h4 {' +
            'margin: 0; color: #333; font-size: 1.1rem;' +
        '}' +
        '.timeline-date {' +
            'color: #666; font-size: 0.9rem;' +
        '}' +
        '.timeline-body {' +
            'display: flex; justify-content: space-between;' +
            'align-items: center;' +
        '}' +
        '.timeline-actions {' +
            'display: flex; gap: 10px; align-items: center;' +
        '}' +
        '.status-badge {' +
            'padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;' +
            'font-weight: 500;' +
        '}' +
        '.status-badge.status-active {' +
            'background: #d4edda; color: #155724;' +
        '}';
    
    document.head.appendChild(style);
})();

// ===== 전역 함수 노출 (JSP에서 호출 가능) =====
window.initializeAdminStores = initializeAdminStores;
window.openStoreDetailFromData = openStoreDetailFromData;
window.openStoreDetailModal = openStoreDetailModal;
window.viewStoreDetail = viewStoreDetail;
window.editStoreInfo = editStoreInfo;
window.deleteStoreConfirm = deleteStoreConfirm;
window.deleteStoreFromModal = deleteStoreFromModal;
window.toggleStoreSelection = toggleStoreSelection;
window.toggleSelectAll = toggleSelectAll;
window.performSearch = performSearch;
window.applyFilter = applyFilter;
window.changePage = changePage;
window.changePageSize = changePageSize;
window.sortTable = sortTable;
window.exportStores = exportStores;
window.openAddStoreModal = openAddStoreModal;
window.bulkApprove = bulkApprove;
window.bulkSuspend = bulkSuspend;
window.bulkDelete = bulkDelete;
window.enableStoreEdit = enableStoreEdit;
window.saveStoreInfo = saveStoreInfo;
window.closeModal = closeModal;

console.log('가게 관리 JavaScript 모듈 로드 완료');