// 필터 처리를 위한 변수들
let currentFilters = {
    price: [0, 100000], // 기본 가격 범위 설정: 0원 ~ 100,000원
    category: [],
    time: [],
    day: [],
    facility: []
};

let allStores = []; // 전체 매장 데이터
let filteredStores = []; // 필터링된 매장 데이터

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 서버 데이터 로드
    loadStoreData();
    
    // 전체 매장 데이터 초기화
    filteredStores = [...allStores];
    
    // 디버깅: 데이터 확인
    console.log('Loaded stores:', allStores);
    console.log('Sample store data:', allStores[0]);
    
    // 가격 슬라이더 초기화
    initPriceSlider();
    
    // 체크박스 이벤트 리스너 추가
    initFilterListeners();
    
    // 정렬 옵션 변경 시 이벤트
    document.getElementById('sort-select').addEventListener('change', function() {
        applyFiltersAndSort();
    });
    
    // 필터 초기화 버튼 클릭 이벤트
    document.getElementById('reset-filters').addEventListener('click', function() {
        resetFilters();
    });
    
    // 초기 매장 데이터 표시
    displayStores(filteredStores);
    updateResultsCount(filteredStores.length);
});

// 서버에서 전달된 JSON 데이터 로드
function loadStoreData() {
    try {
        const dataScript = document.getElementById('store-data');
        if (dataScript) {
            allStores = JSON.parse(dataScript.textContent);
            console.log('Store data loaded successfully:', allStores.length, 'stores');
        } else {
            console.error('Store data script not found');
            allStores = [];
        }
    } catch (error) {
        console.error('Error parsing store data:', error);
        allStores = [];
    }
}

// 체크박스 이벤트 리스너 초기화
function initFilterListeners() {
    // 카테고리 필터 체크박스
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCategoryFilter();
            applyFiltersAndSort();
        });
    });
    
    // 영업시간 필터 체크박스
    const timeCheckboxes = document.querySelectorAll('input[name="time"]');
    timeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTimeFilter();
            applyFiltersAndSort();
        });
    });
    
    // 영업일 필터 체크박스
    const dayCheckboxes = document.querySelectorAll('input[name="day"]');
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateDayFilter();
            applyFiltersAndSort();
        });
    });
    
    // 편의시설 필터 체크박스
    const facilityCheckboxes = document.querySelectorAll('input[name="facility"]');
    facilityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateFacilityFilter();
            applyFiltersAndSort();
        });
    });
}

// 카테고리 필터 업데이트
function updateCategoryFilter() {
    currentFilters.category = getCheckedValues('category');
}

// 영업시간 필터 업데이트
function updateTimeFilter() {
    currentFilters.time = getCheckedValues('time');
}

// 영업일 필터 업데이트
function updateDayFilter() {
    currentFilters.day = getCheckedValues('day');
}

// 편의시설 필터 업데이트
function updateFacilityFilter() {
    currentFilters.facility = getCheckedValues('facility');
}

// 체크된 값들 배열로 가져오기
function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 가격 슬라이더 초기화
function initPriceSlider() {
    const track = document.querySelector('.price-slider-track');
    const range = document.querySelector('.price-slider-range');
    const thumbMin = document.querySelector('.price-slider-thumb-min');
    const thumbMax = document.querySelector('.price-slider-thumb-max');
    const minValueDisplay = document.getElementById('price-min-value');
    const maxValueDisplay = document.getElementById('price-max-value');
    
    // 최소 및 최대 값 (원)
    const minPrice = 0;
    const maxPrice = 100000;
    
    // 초기 위치 설정
    let minPos = 0;
    let maxPos = 100;
    
    updateSliderDisplay();
    
    // 최소값 슬라이더 드래그 이벤트
    thumbMin.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        document.addEventListener('mousemove', moveMin);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', moveMin);
        });
    });
    
    // 최대값 슬라이더 드래그 이벤트
    thumbMax.addEventListener('mousedown', function(e) {
        e.preventDefault();
        
        document.addEventListener('mousemove', moveMax);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', moveMax);
        });
    });
    
    // 최소값 슬라이더 이동 함수
    function moveMin(e) {
        const trackRect = track.getBoundingClientRect();
        let newPos = ((e.clientX - trackRect.left) / trackRect.width) * 100;
        
        // 범위 제한
        newPos = Math.max(0, Math.min(newPos, maxPos - 5));
        minPos = newPos;
        
        updateSliderDisplay();
    }
    
    // 최대값 슬라이더 이동 함수
    function moveMax(e) {
        const trackRect = track.getBoundingClientRect();
        let newPos = ((e.clientX - trackRect.left) / trackRect.width) * 100;
        
        // 범위 제한
        newPos = Math.max(minPos + 5, Math.min(newPos, 100));
        maxPos = newPos;
        
        updateSliderDisplay();
    }
    
    // 슬라이더 표시 업데이트
    function updateSliderDisplay() {
        // 위치 업데이트
        thumbMin.style.left = minPos + '%';
        thumbMax.style.left = maxPos + '%';
        range.style.left = minPos + '%';
        range.style.width = (maxPos - minPos) + '%';
        
        // 가격 계산 및 표시
        const minValue = Math.round((minPos / 100) * maxPrice);
        const maxValue = Math.round((maxPos / 100) * maxPrice);
        
        // 표시 업데이트
        minValueDisplay.textContent = formatPrice(minValue) + '원';
        maxValueDisplay.textContent = maxValue >= maxPrice ? formatPrice(maxValue) + '원+' : formatPrice(maxValue) + '원';
        
        // 필터 값 업데이트
        currentFilters.price = [minValue, maxValue];
        
        // 필터 적용
        applyFiltersAndSort();
    }
}

// 가격 포맷팅 함수 (천 단위 콤마)
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 필터 적용 및 정렬
function applyFiltersAndSort() {
    // 필터링 적용
    filteredStores = filterStores(allStores);
    
    // 정렬 적용
    const sortOption = document.getElementById('sort-select').value;
    filteredStores = sortStores(filteredStores, sortOption);
    
    // 결과 표시
    displayStores(filteredStores);
    
    // 총 결과 수 업데이트
    updateResultsCount(filteredStores.length);
}

// 매장 필터링
function filterStores(stores) {
    console.log('=== 필터링 시작 ===');
    console.log('현재 필터:', currentFilters);
    console.log('전체 매장 수:', stores.length);
    
    const filtered = stores.filter(store => {
        console.log(`\n매장 확인: ${store.storeName}`);
        
        // 가격 필터 - 이제 숫자로 직접 비교
        console.log(`가격 비교: 매장(${store.menuMin}~${store.menuMax}) vs 필터(${currentFilters.price[0]}~${currentFilters.price[1]})`);
        
        if (store.menuMax < currentFilters.price[0] || store.menuMin > currentFilters.price[1]) {
            console.log('❌ 가격 필터 실패');
            return false;
        }
        console.log('✅ 가격 필터 통과');
        
        // 카테고리 필터
        if (currentFilters.category.length > 0) {
            console.log(`카테고리 비교: 매장(${store.storeCategory}) vs 필터(${currentFilters.category})`);
            if (!currentFilters.category.includes(store.storeCategory)) {
                console.log('❌ 카테고리 필터 실패');
                return false;
            }
            console.log('✅ 카테고리 필터 통과');
        }
        
        // 영업시간 필터
        if (currentFilters.time.length > 0) {
            console.log(`영업시간 비교: 매장(${store.openTime}~${store.closeTime}) vs 필터(${currentFilters.time})`);
            const hasMatchingTime = currentFilters.time.some(timeSlot => {
                const result = checkTimeSlot(store.openTime, store.closeTime, timeSlot);
                console.log(`  ${timeSlot} 시간대 체크: ${result}`);
                return result;
            });
            if (!hasMatchingTime) {
                console.log('❌ 영업시간 필터 실패');
                return false;
            }
            console.log('✅ 영업시간 필터 통과');
        }
        
        // 영업일 필터
        if (currentFilters.day.length > 0) {
            console.log(`영업일 비교: 매장(${JSON.stringify(store.operatingDays)}) vs 필터(${currentFilters.day})`);
            const hasMatchingDay = currentFilters.day.some(day => {
                const result = store.operatingDays && store.operatingDays.includes(day);
                console.log(`  ${day} 체크: ${result}`);
                return result;
            });
            if (!hasMatchingDay) {
                console.log('❌ 영업일 필터 실패');
                return false;
            }
            console.log('✅ 영업일 필터 통과');
        }
        
        // 편의시설 필터
        if (currentFilters.facility.length > 0) {
            console.log(`편의시설 비교: 매장(${JSON.stringify(store.facilities)}) vs 필터(${currentFilters.facility})`);
            const hasMatchingFacility = currentFilters.facility.some(facility => {
                let result = false;
                if (store.facilities && store.facilities.length > 0) {
                    result = store.facilities.includes(facility);
                    console.log(`  배열에서 ${facility} 체크: ${result}`);
                } else if (store.storeFacilities) {
                    result = store.storeFacilities.includes(facility);
                    console.log(`  문자열에서 ${facility} 체크: ${result}`);
                }
                return result;
            });
            if (!hasMatchingFacility) {
                console.log('❌ 편의시설 필터 실패');
                return false;
            }
            console.log('✅ 편의시설 필터 통과');
        }
        
        console.log('🎉 모든 필터 통과!');
        return true;
    });
    
    console.log(`\n=== 필터링 완료 ===`);
    console.log(`결과: ${filtered.length}개 매장`);
    return filtered;
}

// 영업시간 체크
function checkTimeSlot(openTime, closeTime, timeSlot) {
    const open = timeToMinutes(openTime);
    const close = timeToMinutes(closeTime);
    
    switch (timeSlot) {
        case '아침':
            return open <= 600 && close >= 600; // 06:00~10:00
        case '점심':
            return open <= 660 && close >= 840; // 11:00~14:00
        case '저녁':
            return open <= 1020 && close >= 1260; // 17:00~21:00
        case '심야':
            return open <= 1320 || close >= 300; // 22:00~05:00 (다음날)
        default:
            return true;
    }
}

// 시간을 분으로 변환
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// 매장 정렬
function sortStores(stores, sortOption) {
    const sortedStores = [...stores];
    
    switch (sortOption) {
        case 'rating':
            sortedStores.sort((a, b) => parseFloat(b.reviewEstimation) - parseFloat(a.reviewEstimation));
            break;
        case 'reviews':
            sortedStores.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        case 'recent':
            // 매장 번호를 최근성으로 사용 (임시)
            sortedStores.sort((a, b) => parseInt(b.storeNo) - parseInt(a.storeNo));
            break;
        default:
            break;
    }
    
    return sortedStores;
}

// 매장 목록 표시
function displayStores(stores) {
    const container = document.getElementById('restaurants-container');
    const noResults = document.getElementById('no-results');
    
    // 기존 내용 제거
    container.innerHTML = '';
    
    if (stores.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    stores.forEach(store => {
        const card = createStoreCard(store);
        container.appendChild(card);
    });
}

// 매장 카드 생성
function createStoreCard(store) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    
    // facilities 배열 처리
    let facilitiesHtml = '';
    if (store.facilities && store.facilities.length > 0) {
        facilitiesHtml = store.facilities.map(facility => `
            <span class="feature">${facility}</span>
        `).join('');
    } else if (store.storeFacilities) {
        facilitiesHtml = `<span class="feature">${store.storeFacilities}</span>`;
    }
    
    card.innerHTML = `
        <div class="restaurant-image">
            <img src="${window.contextPath || ''}/attach/${store.storeImage}" alt="${store.storeName}">
            <span class="status-badge ${getStatusClass(store.businessStatus)}">${store.businessStatus}</span>
        </div>
        <div class="restaurant-info">
            <div class="restaurant-info-left">
                <h3>${store.storeName}</h3>
                <div class="restaurant-details">
                    <div class="rating">
                        <span class="stars">${getStarsHtml(store.reviewEstimation)}</span>
                        <span class="rating-score">${store.reviewEstimation}</span>
                        <span class="review-count">(${store.reviewCount})</span>
                    </div>
                </div>
                <div class="tags-container">
                    <p class="category-tag">${store.storeCategory}</p>
                    <p class="price-tag">${store.menuMinFormatted}~${store.menuMaxFormatted}원</p>
                </div>
                <p class="location">${store.storeAddr} ${store.storeAdditionalInfo}</p>
            </div>
            <div class="restaurant-info-right">
                <div class="restaurant-features">
                    ${facilitiesHtml}
                </div>
                <a href="${window.contextPath || ''}/Store_servlet/restaurantDetail.do?StoreNo=${store.storeNo}" class="view-details">상세보기 <i class="fas fa-chevron-right"></i></a>
            </div>
        </div>
    `;
    
    return card;
}

// 영업 상태 클래스 반환
function getStatusClass(status) {
    switch (status) {
        case '영업중':
            return 'open';
        case '휴무일':
            return 'closed';
        case '대기 중':
            return 'waiting';
        case '예약 필수':
            return 'reservation';
        default:
            return 'open';
    }
}

// 별점 HTML 생성 (반올림 버전)
function getStarsHtml(rating) {
    const numRating = parseFloat(rating);
    // 반올림하여 정수로 만들기
    const roundedRating = Math.round(numRating);
    const fullStars = Math.min(roundedRating, 5); // 최대 5개
    const emptyStars = 5 - fullStars;
    
    let starsHtml = '';
    
    // 꽉 찬 별
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '★';
    }
    
    // 빈 별
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '☆';
    }
    
    return starsHtml;
}

// 총 결과 수 업데이트
function updateResultsCount(count) {
    document.getElementById('results-total').textContent = count;
}

// 필터 초기화
function resetFilters() {
    // 모든 체크박스 해제
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 가격 슬라이더 초기화
    resetPriceSlider();
    
    // 정렬 옵션 초기화
    document.getElementById('sort-select').selectedIndex = 0;
    
    // 필터 상태 초기화
    currentFilters = {
        price: [0, 100000],
        category: [],
        time: [],
        day: [],
        facility: []
    };
    
    // 결과 초기화 및 재표시
    filteredStores = [...allStores];
    displayStores(filteredStores);
    updateResultsCount(filteredStores.length);
}

// 가격 슬라이더 초기화
function resetPriceSlider() {
    const thumbMin = document.querySelector('.price-slider-thumb-min');
    const thumbMax = document.querySelector('.price-slider-thumb-max');
    const range = document.querySelector('.price-slider-range');
    const minValueDisplay = document.getElementById('price-min-value');
    const maxValueDisplay = document.getElementById('price-max-value');
    
    // 슬라이더 위치 초기화
    thumbMin.style.left = '0%';
    thumbMax.style.left = '100%';
    range.style.left = '0%';
    range.style.width = '100%';
    
    // 표시 초기화
    minValueDisplay.textContent = '0원';
    maxValueDisplay.textContent = '100,000원+';
    
    // 필터 값 초기화
    currentFilters.price = [0, 100000];
}