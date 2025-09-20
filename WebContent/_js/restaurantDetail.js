/**
 * 음식점 상세페이지 JavaScript (카카오맵 포함)
 */

// 카카오맵 관련 전역 변수
let map; // 작은 지도
let largeMap; // 큰 지도 모달용
let marker; // 마커
let largeMarker; // 큰 지도 마커
let currentPosition; // 현재 위치 좌표

class RestaurantDetail {
    constructor() {
        this.isInitialized = false;
        this.storeSchedule = null;
        this.datePickerInstance = null;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            // 별점 초기화 (최우선)
            this.initStarRatings();
            
            // 스케줄 데이터 로드
            this.loadScheduleData();
            
            // 핵심 기능들 초기화
            this.initDatePicker();
            this.initCounterControls();
            this.initReservationCounter();
            this.initReviewFilters();
            this.initMapModal();
            this.initReservationForm();
            this.initReviewImageViewer();
            this.initMenuInteractions();
            this.initReviewActions();
            this.initModalFunctions();
            
            // 카카오맵 초기화
            this.initializeKakaoMap();
            
            this.isInitialized = true;
            console.log('RestaurantDetail 초기화 완료 (카카오맵 포함)');
        } catch (error) {
            console.error('RestaurantDetail 초기화 실패:', error);
        }
    }

    /**
     * 별점 초기화 (반올림 방식)
     */
    initStarRatings() {
        // 모든 별점 컨테이너 찾기
        const starContainers = document.querySelectorAll('.stars, .rating .stars');
        
        starContainers.forEach(container => {
            // 이미 초기화된 경우 건너뛰기
            if (container.hasAttribute('data-stars-initialized')) return;
            
            // 평점 값 찾기 (여러 방법으로 시도)
            let rating = this.findRatingValue(container);
            
            if (rating !== null) {
                // 기존 하드코딩된 별점 제거하고 동적 생성
                container.innerHTML = this.generateStarsHtml(rating);
                container.setAttribute('data-stars-initialized', 'true');
                console.log(`별점 초기화 완료: ${rating}점 → ${this.generateStarsHtml(rating)}`);
            }
        });
    }

    /**
     * 평점 값 찾기
     */
    findRatingValue(container) {
        // 1. data-rating 속성에서 찾기
        if (container.hasAttribute('data-rating')) {
            return parseFloat(container.getAttribute('data-rating'));
        }
        
        // 2. 같은 부모 요소 내의 rating-score에서 찾기
        const ratingContainer = container.closest('.rating-info, .rating, .restaurant-meta');
        if (ratingContainer) {
            const ratingScore = ratingContainer.querySelector('.rating-score');
            if (ratingScore) {
                const scoreText = ratingScore.textContent.trim();
                const score = parseFloat(scoreText);
                if (!isNaN(score)) {
                    return score;
                }
            }
        }
        
        // 3. 형제 요소에서 찾기
        const nextSibling = container.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('rating-score')) {
            const score = parseFloat(nextSibling.textContent.trim());
            if (!isNaN(score)) {
                return score;
            }
        }
        
        // 4. JSP 변수에서 찾기 (전역 변수 확인)
        if (typeof window.reviewAvg !== 'undefined') {
            return parseFloat(window.reviewAvg);
        }
        
        console.warn('평점 값을 찾을 수 없습니다:', container);
        return null;
    }

    /**
     * 별점 HTML 생성 (반올림 방식)
     */
    generateStarsHtml(rating) {
        const numRating = parseFloat(rating);
        if (isNaN(numRating)) {
            return '☆☆☆☆☆'; // 기본값
        }
        
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

    /**
     * 카카오맵 초기화
     */
    initializeKakaoMap() {
        try {
            // DOM이 완전히 로드된 후 지도 초기화
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.createKakaoMap(), 100);
                });
            } else {
                setTimeout(() => this.createKakaoMap(), 100);
            }
        } catch (error) {
            console.error('카카오맵 초기화 실패:', error);
        }
    }

    /**
     * 카카오맵 생성
     */
    createKakaoMap() {
        const storeAddressElement = document.getElementById('store-address');
        const storeNameElement = document.getElementById('store-name');
        
        if (!storeAddressElement || !storeNameElement) {
            console.error('매장 정보 요소를 찾을 수 없습니다.');
            this.showMapError('매장 정보를 불러올 수 없습니다.');
            return;
        }

        const storeAddress = storeAddressElement.value.trim();
        const storeName = storeNameElement.value.trim();
        
        console.log("검색할 주소:", storeAddress);
        
        if (!storeAddress) {
            console.error('매장 주소 정보가 없습니다.');
            this.showMapError('주소 정보가 없습니다.');
            return;
        }

        // 카카오맵 API 로드 확인
        if (typeof kakao === 'undefined' || !kakao.maps) {
            console.error('카카오맵 API가 로드되지 않았습니다.');
            this.showMapError('지도 서비스를 불러올 수 없습니다.');
            return;
        }

        // 주소를 좌표로 변환
        const geocoder = new kakao.maps.services.Geocoder();
        
        geocoder.addressSearch(storeAddress, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                currentPosition = coords;
                
                // 작은 지도 생성
                this.createSmallMap(coords, storeName);
                console.log('카카오맵 초기화 완료');
            } else {
                console.error('주소 검색 실패:', status);
                this.showMapError('주소를 찾을 수 없습니다.');
            }
        });
    }

    /**
     * 작은 지도 생성
     */
    createSmallMap(coords, storeName) {
        const mapContainer = document.getElementById('kakao-map');
        if (!mapContainer) {
            console.error('지도 컨테이너를 찾을 수 없습니다.');
            return;
        }

        const mapOption = {
            center: coords,
            level: 3, // 확대 레벨
            draggable: true,
            scrollwheel: true,
            disableDoubleClick: false,
            disableDoubleClickZoom: false
        };

        map = new kakao.maps.Map(mapContainer, mapOption);

        // 마커 생성
        marker = new kakao.maps.Marker({
            position: coords,
            map: map
        });

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:10px;text-align:center;min-width:150px;">
                        <strong style="color:#333;">${storeName}</strong><br>
                        <span style="color:#666;font-size:12px;">클릭하면 큰 지도로 보기</span>
                      </div>`,
            removable: false
        });

        // 마커에 인포윈도우 표시
        infowindow.open(map, marker);

        // 지도 클릭 시 큰 지도 모달 열기
        kakao.maps.event.addListener(map, 'click', () => {
            this.openLargeMapModal();
        });

        // 마커 클릭 시 큰 지도 모달 열기
        kakao.maps.event.addListener(marker, 'click', () => {
            this.openLargeMapModal();
        });

        // 지도 컨트롤 추가
        this.addMapControls(map);
    }

    /**
     * 지도 컨트롤 추가
     */
    addMapControls(targetMap) {
        // 확대/축소 컨트롤
        const zoomControl = new kakao.maps.ZoomControl();
        targetMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도 타입 컨트롤
        const mapTypeControl = new kakao.maps.MapTypeControl();
        targetMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    }

    /**
     * 큰 지도 모달 열기
     */
    openLargeMapModal() {
        const modal = document.getElementById('map-modal');
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 모달이 완전히 열린 후 큰 지도 생성
        setTimeout(() => {
            this.createLargeMap();
        }, 150);
    }

    /**
     * 큰 지도 생성
     */
    createLargeMap() {
        if (!currentPosition) return;

        const storeNameElement = document.getElementById('store-name');
        const storeName = storeNameElement ? storeNameElement.value : '매장';
        const largeMapContainer = document.getElementById('large-kakao-map');
        
        if (!largeMapContainer) {
            console.error('큰 지도 컨테이너를 찾을 수 없습니다.');
            return;
        }

        const largeMapOption = {
            center: currentPosition,
            level: 2, // 더 자세한 레벨
            draggable: true,
            scrollwheel: true,
            disableDoubleClick: false,
            disableDoubleClickZoom: false
        };

        largeMap = new kakao.maps.Map(largeMapContainer, largeMapOption);

        // 큰 지도용 마커
        largeMarker = new kakao.maps.Marker({
            position: currentPosition,
            map: largeMap
        });

        // 큰 지도용 인포윈도우
        const largeInfowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:15px;text-align:center;min-width:200px;">
                        <strong style="color:#333;font-size:16px;">${storeName}</strong><br>
                        <span style="color:#666;font-size:13px;">맛집 위치</span>
                      </div>`,
            removable: true
        });

        largeInfowindow.open(largeMap, largeMarker);

        // 지도 컨트롤 추가
        this.addMapControls(largeMap);

        // 로드뷰 버튼 추가
        this.addRoadviewControl();

        console.log('큰 지도 초기화 완료');
    }

    /**
     * 로드뷰 컨트롤 추가
     */
    addRoadviewControl() {
        const largeMapContainer = document.getElementById('large-kakao-map');
        if (!largeMapContainer) return;

        // 기존 로드뷰 버튼이 있다면 제거
        const existingRoadview = largeMapContainer.querySelector('.roadview-container');
        if (existingRoadview) {
            existingRoadview.remove();
        }

        // 로드뷰 버튼을 지도에 추가
        const roadviewContainer = document.createElement('div');
        roadviewContainer.className = 'roadview-container';
        roadviewContainer.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
        `;
        
        const roadviewBtn = document.createElement('button');
        roadviewBtn.innerHTML = '<i class="fas fa-street-view"></i> 로드뷰';
        roadviewBtn.className = 'modal-map-btn';
        roadviewBtn.onclick = () => this.openRoadview();
        
        roadviewContainer.appendChild(roadviewBtn);
        largeMapContainer.appendChild(roadviewContainer);
    }

    /**
     * 로드뷰 열기
     */
    openRoadview() {
        if (!currentPosition) return;
        
        const roadviewClient = new kakao.maps.RoadviewClient();
        
        roadviewClient.getNearestPanoId(currentPosition, 50, (panoId) => {
            if (panoId === null) {
                this.showNotification('이 위치에서는 로드뷰를 제공하지 않습니다.', 'warning');
                return;
            }
            
            // 새 창에서 로드뷰 열기
            const roadviewUrl = `https://map.kakao.com/link/roadview/${panoId}`;
            window.open(roadviewUrl, '_blank');
        });
    }

    /**
     * 지도 중심으로 이동
     */
    centerMap() {
        if (largeMap && currentPosition) {
            largeMap.setCenter(currentPosition);
            largeMap.setLevel(2);
            this.showNotification('지도를 중심으로 이동했습니다.', 'success');
        }
    }

    /**
     * 카카오맵 앱에서 열기
     */
    openKakaoMapApp() {
        const storeAddressElement = document.getElementById('store-address');
        const storeNameElement = document.getElementById('store-name');
        
        if (!storeAddressElement || !storeNameElement) return;
        
        const storeAddress = storeAddressElement.value;
        const storeName = storeNameElement.value;
        
        if (!storeAddress) return;
        
        // 카카오맵 링크 생성
        const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(storeAddress)}`;
        window.open(kakaoMapUrl, '_blank');
    }

    /**
     * 주소 복사
     */
    copyStoreAddress() {
        const storeAddressElement = document.getElementById('store-address');
        
        if (!storeAddressElement) {
            this.showNotification('복사할 주소가 없습니다.', 'error');
            return;
        }

        const storeAddress = storeAddressElement.value;
        
        if (!storeAddress) {
            this.showNotification('복사할 주소가 없습니다.', 'error');
            return;
        }

        // 클립보드에 복사
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(storeAddress).then(() => {
                this.showNotification('주소가 클립보드에 복사되었습니다.', 'success');
            }).catch(() => {
                this.fallbackCopyAddress(storeAddress);
            });
        } else {
            this.fallbackCopyAddress(storeAddress);
        }
    }

    /**
     * 클립보드 API를 사용할 수 없는 경우 대체 방법
     */
    fallbackCopyAddress(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification('주소가 클립보드에 복사되었습니다.', 'success');
            } else {
                this.showNotification('주소 복사에 실패했습니다.', 'error');
            }
        } catch (err) {
            console.error('주소 복사 실패:', err);
            this.showNotification('주소 복사에 실패했습니다.', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * 지도 오류 표시
     */
    showMapError(message) {
        const mapContainer = document.getElementById('kakao-map');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:300px;background:#f8f9fa;border-radius:8px;color:#6c757d;">
                <div style="text-align:center;">
                    <i class="fas fa-map-marked-alt" style="font-size:3rem;margin-bottom:1rem;opacity:0.5;"></i>
                    <p style="margin:0;font-size:0.9rem;">${message}</p>
                </div>
            </div>
        `;
    }

    /**
     * 지도 모달 닫기
     */
    closeMapModal() {
        const modal = document.getElementById('map-modal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // 큰 지도 정리
        if (largeMap) {
            largeMap = null;
        }
        if (largeMarker) {
            largeMarker = null;
        }

        // 로드뷰 버튼 제거
        const roadviewContainer = document.querySelector('.roadview-container');
        if (roadviewContainer) {
            roadviewContainer.remove();
        }
    }

    /**
     * hidden input에서 스케줄 데이터 로드
     */
    loadScheduleData() {
        const scheduleInput = document.getElementById('schedule-data');
        if (scheduleInput && scheduleInput.value) {
            try {
                // JSON 문자열에서 개행과 공백 제거
                const cleanedData = scheduleInput.value.replace(/\s+/g, ' ').trim();
                this.storeSchedule = JSON.parse(cleanedData);
                console.log('스토어 스케줄 데이터 로드 완료:', this.storeSchedule);
            } catch (error) {
                console.error('스케줄 데이터 파싱 실패:', error);
                console.log('원본 데이터:', scheduleInput.value);
                this.storeSchedule = null;
            }
        } else {
            console.warn('스케줄 데이터를 찾을 수 없습니다.');
            this.storeSchedule = null;
        }
    }

    /**
     * 날짜 선택기 초기화
     */
    initDatePicker() {
        const dateInput = document.getElementById('reservation-date');
        if (dateInput && window.flatpickr) {
            try {
                this.datePickerInstance = window.flatpickr(dateInput, {
                    minDate: "today",
                    dateFormat: "Y-m-d",
                    locale: "ko",
                    altInput: true,
                    altFormat: "Y년 m월 d일",
                    placeholder: "날짜를 선택하세요",
                    allowInput: false,
                    clickOpens: true,
                    disableMobile: true,
                    onChange: (selectedDates, dateStr) => {
                        // 날짜가 선택되면 해당 요일의 예약 가능 시간 업데이트
                        if (selectedDates.length > 0) {
                            this.updateAvailableTimes(selectedDates[0]);
                        }
                    }
                });
            } catch (error) {
                console.warn('Flatpickr 초기화 실패:', error);
            }
        }
    }

    /**
     * 선택된 날짜에 따른 예약 가능 시간 업데이트
     */
    updateAvailableTimes(selectedDate) {
        const timeSelect = document.querySelector('.time-select');
        const timeHelpText = document.querySelector('.time-help-text');
        
        if (!timeSelect || !this.storeSchedule) {
            console.warn('시간 선택 요소나 스케줄 데이터를 찾을 수 없습니다.');
            return;
        }

        // 요일 계산 (일요일: 0, 월요일: 1, ..., 토요일: 6)
        const dayOfWeek = selectedDate.getDay();
        
        // JSP day 배열 순서: ["월", "화", "수", "목", "금", "토", "일"]
        // JavaScript getDay(): 일요일=0, 월요일=1, 화요일=2, 수요일=3, 목요일=4, 금요일=5, 토요일=6
        // 매핑: 0(일) → "일", 1(월) → "월", 2(화) → "화", ..., 6(토) → "토"
        const dayMapping = {
            0: '일',  // 일요일
            1: '월',  // 월요일
            2: '화',  // 화요일
            3: '수',  // 수요일
            4: '목',  // 목요일
            5: '금',  // 금요일
            6: '토'   // 토요일
        };
        
        const selectedDayName = dayMapping[dayOfWeek];
        
        console.log('선택된 날짜:', selectedDate);
        console.log('JavaScript getDay():', dayOfWeek);
        console.log('매핑된 요일:', selectedDayName);
        console.log('사용 가능한 스케줄 키:', Object.keys(this.storeSchedule));

        // 기존 옵션 모두 제거
        timeSelect.innerHTML = '';

        // 해당 요일의 스케줄 찾기
        const daySchedule = this.storeSchedule[selectedDayName];
        
        if (!daySchedule) {
            console.warn('해당 요일의 스케줄을 찾을 수 없습니다:', selectedDayName);
            console.log('전체 스케줄 데이터:', this.storeSchedule);
            timeSelect.innerHTML = '<option value="" disabled selected>스케줄 정보를 찾을 수 없습니다</option>';
            if (timeHelpText) {
                timeHelpText.textContent = `${selectedDayName}요일의 스케줄 정보를 찾을 수 없습니다.`;
                timeHelpText.style.color = 'var(--error-color)';
            }
            return;
        }

        console.log('찾은 스케줄:', daySchedule);

        // 휴무일 체크
        if (!daySchedule.isOpen) {
            timeSelect.innerHTML = '<option value="" disabled selected>휴무일입니다</option>';
            timeSelect.disabled = true;
            if (timeHelpText) {
                timeHelpText.textContent = `${selectedDayName}요일은 휴무일입니다. 다른 날짜를 선택해주세요.`;
                timeHelpText.style.color = 'var(--error-color)';
            }
            return;
        }

        // 시간 선택 활성화
        timeSelect.disabled = false;

        // 예약 가능 시간 생성
        const availableTimes = this.generateAvailableTimes(daySchedule.openTime, daySchedule.closeTime);
        
        console.log('생성된 예약 가능 시간:', availableTimes);

        if (availableTimes.length === 0) {
            timeSelect.innerHTML = '<option value="" disabled selected>예약 가능한 시간이 없습니다</option>';
            if (timeHelpText) {
                timeHelpText.textContent = '영업시간이지만 예약 가능한 시간이 없습니다.';
                timeHelpText.style.color = 'var(--warning-color)';
            }
            return;
        }

        // 기본 선택 옵션 추가
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = '시간을 선택하세요';
        timeSelect.appendChild(defaultOption);

        // 예약 가능 시간 옵션들 추가
        availableTimes.forEach(timeInfo => {
            const option = document.createElement('option');
            option.value = timeInfo.value;
            option.textContent = timeInfo.label;
            timeSelect.appendChild(option);
        });

        // 도움말 텍스트 업데이트
        if (timeHelpText) {
            timeHelpText.textContent = `${selectedDayName}요일 영업시간: ${daySchedule.openTime} ~ ${daySchedule.closeTime}`;
            timeHelpText.style.color = 'var(--text-secondary)';
        }

        // 시간 선택 이벤트 알림
        this.showNotification(`${selectedDayName}요일 예약 가능 시간이 업데이트되었습니다.`, 'success');
    }

    /**
     * 영업시간을 기반으로 예약 가능 시간 생성
     */
    generateAvailableTimes(openTime, closeTime) {
        const availableTimes = [];
        
        try {
            // 시간 문자열을 Date 객체로 변환 (오늘 날짜 기준)
            const today = new Date();
            const [openHour, openMinute] = openTime.split(':').map(Number);
            const [closeHour, closeMinute] = closeTime.split(':').map(Number);
            
            const openDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), openHour, openMinute);
            const closeDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), closeHour, closeMinute);
            
            // 자정을 넘어가는 경우 (예: 23:00 ~ 02:00)
            if (closeDateTime <= openDateTime) {
                closeDateTime.setDate(closeDateTime.getDate() + 1);
            }

            // 예약 가능 시간 생성 (1시간 간격, 영업종료 1시간 전까지)
            const lastReservationTime = new Date(closeDateTime.getTime() - 60 * 60 * 1000); // 1시간 전
            const currentTime = new Date(openDateTime);

            // 현재 시간이 오늘이고, 영업시간이 이미 지났다면 예약 불가
            const now = new Date();
            const selectedDateStr = this.datePickerInstance && this.datePickerInstance.selectedDates ? this.datePickerInstance.selectedDates[0] : null;
            const isToday = selectedDateStr && 
                selectedDateStr.getDate() === now.getDate() &&
                selectedDateStr.getMonth() === now.getMonth() &&
                selectedDateStr.getFullYear() === now.getFullYear();

            while (currentTime <= lastReservationTime) {
                // 오늘 날짜인 경우, 현재 시간보다 1시간 후부터 예약 가능
                if (isToday) {
                    const minimumTime = new Date(now.getTime() + 60 * 60 * 1000); // 1시간 후
                    if (currentTime < minimumTime) {
                        currentTime.setTime(currentTime.getTime() + 60 * 60 * 1000); // 1시간 추가
                        continue;
                    }
                }

                const timeStr = this.formatTime(currentTime);
                const label = this.getTimeLabel(currentTime);
                
                availableTimes.push({
                    value: timeStr,
                    label: `${timeStr}`
                });

                // 1시간 추가 (30분 → 60분으로 변경)
                currentTime.setTime(currentTime.getTime() + 60 * 60 * 1000);
            }

        } catch (error) {
            console.error('예약 가능 시간 생성 실패:', error);
        }

        return availableTimes;
    }

    /**
     * 시간을 HH:MM 형식으로 포맷팅
     */
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * 시간대별 라벨 생성
     */
    getTimeLabel(date) {
        const hour = date.getHours();
        
        if (hour >= 6 && hour < 11) {
            return '오전';
        } else if (hour >= 11 && hour < 14) {
            return '점심';
        } else if (hour >= 14 && hour < 17) {
            return '오후';
        } else if (hour >= 17 && hour < 21) {
            return '저녁';
        } else if (hour >= 21 || hour < 6) {
            return '야간';
        } else {
            return '일반';
        }
    }

    /**
     * 인원 수 카운터 초기화
     */
    initCounterControls() {
        const decreaseBtn = document.querySelector('.decrease-btn');
        const increaseBtn = document.querySelector('.increase-btn');
        const counterValue = document.querySelector('.counter-value');
        const hiddenInput = document.querySelector('.people-count-input');

        if (!decreaseBtn || !increaseBtn || !counterValue) return;

        // 중복 이벤트 방지
        if (decreaseBtn.hasAttribute('data-counter-initialized')) return;

        const updateCounter = (change) => {
            const currentValue = parseInt(counterValue.textContent, 10) || 1;
            const newValue = currentValue + change;
            
            if (newValue >= 1 && newValue <= 10) {
                counterValue.textContent = newValue;
                // hidden input 값도 함께 업데이트
                if (hiddenInput) {
                    hiddenInput.value = newValue;
                }
                this.updateButtonStates(newValue);
            }
        };

        decreaseBtn.addEventListener('click', () => updateCounter(-1));
        increaseBtn.addEventListener('click', () => updateCounter(1));

        // 초기화 표시
        decreaseBtn.setAttribute('data-counter-initialized', 'true');
        increaseBtn.setAttribute('data-counter-initialized', 'true');

        // 초기 hidden input 값 설정
        if (hiddenInput) {
            hiddenInput.value = parseInt(counterValue.textContent, 10) || 2;
        }

        // 초기 버튼 상태 설정
        this.updateButtonStates(parseInt(counterValue.textContent, 10) || 1);
    }

    /**
     * 카운터 버튼 상태 업데이트
     */
    updateButtonStates(value) {
        const decreaseBtn = document.querySelector('.decrease-btn');
        const increaseBtn = document.querySelector('.increase-btn');

        if (decreaseBtn) {
            decreaseBtn.style.opacity = value <= 1 ? '0.5' : '1';
            decreaseBtn.style.cursor = value <= 1 ? 'not-allowed' : 'pointer';
            decreaseBtn.disabled = value <= 1;
        }

        if (increaseBtn) {
            increaseBtn.style.opacity = value >= 10 ? '0.5' : '1';
            increaseBtn.style.cursor = value >= 10 ? 'not-allowed' : 'pointer';
            increaseBtn.disabled = value >= 10;
        }
    }

    /**
     * 예약 코멘트 카운터 초기화
     */
    initReservationCounter() {
        this.initSingleCounter('.reservation-comment', '.comment-counter .current-length', 200);
    }

    /**
     * 단일 텍스트 입력 필드 카운터 초기화
     */
    initSingleCounter(inputSelector, counterSelector, maxLength) {
        const inputElement = document.querySelector(inputSelector);
        const counterElement = document.querySelector(counterSelector);
        
        if (!inputElement || !counterElement) return;
        if (inputElement.hasAttribute('data-counter-initialized')) return;

        const updateCounter = () => {
            const currentLength = inputElement.value.length;
            counterElement.textContent = currentLength;
            
            // 글자수에 따른 색상 변경
            const percentage = (currentLength / maxLength) * 100;
            if (percentage >= 90) {
                counterElement.style.color = 'var(--error-color)';
            } else if (percentage >= 75) {
                counterElement.style.color = 'var(--warning-color)';
            } else {
                counterElement.style.color = 'var(--primary-color)';
            }

            // 최대 글자수 초과 방지
            if (currentLength >= maxLength) {
                inputElement.value = inputElement.value.substring(0, maxLength);
                counterElement.textContent = maxLength;
                counterElement.style.color = 'var(--error-color)';
            }
        };

        // 이벤트 등록
        inputElement.addEventListener('input', updateCounter);
        inputElement.addEventListener('paste', () => {
            setTimeout(updateCounter, 10);
        });

        // 초기 카운터 설정
        updateCounter();

        // 초기화 표시
        inputElement.setAttribute('data-counter-initialized', 'true');

        // 포커스/블러 이벤트로 텍스트영역 하이라이트 효과
        inputElement.addEventListener('focus', () => {
            inputElement.style.borderColor = 'var(--primary-color)';
            inputElement.style.boxShadow = '0 0 0 2px var(--primary-light)';
            
            const counterDiv = counterElement.closest('.comment-counter');
            if (counterDiv) {
                counterDiv.style.opacity = '1';
                counterDiv.style.transform = 'translateY(0)';
            }
        });

        inputElement.addEventListener('blur', () => {
            inputElement.style.borderColor = 'var(--border-color)';
            inputElement.style.boxShadow = 'none';
            
            const counterDiv = counterElement.closest('.comment-counter');
            if (counterDiv && inputElement.value.length === 0) {
                counterDiv.style.opacity = '0.7';
                counterDiv.style.transform = 'translateY(-2px)';
            }
        });
    }

    /**
     * 메뉴 상호작용 초기화
     */
    initMenuInteractions() {
        try {
            this.initMenuItems();
            this.initMenuCategoryToggles();
            this.addMenuSearchFeature();
        } catch (error) {
            console.warn('메뉴 상호작용 초기화 실패:', error);
        }
    }

    /**
     * 메뉴 아이템 초기화
     */
    initMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach((item) => {
            if (item.hasAttribute('data-menu-initialized')) return;
            
            // 클릭 이벤트가 이미 onclick으로 설정된 경우는 추가하지 않음
            if (!item.onclick) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleMenuItemClick(item);
                });
            }
            
            item.setAttribute('data-menu-initialized', 'true');
        });
    }

    /**
     * 메뉴 아이템 클릭 처리
     */
    handleMenuItemClick(item) {
        // 선택 효과
        item.style.transform = 'scale(0.98)';
        item.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            item.style.transform = '';
            item.style.transition = 'all 0.2s ease';
        }, 100);

        // 메뉴 정보 추출
        const menuNameEl = item.querySelector('.menu-name');
        const menuPriceEl = item.querySelector('.menu-price');
        
        if (menuNameEl && menuPriceEl) {
            const menuName = menuNameEl.textContent.trim();
            const menuPrice = menuPriceEl.textContent.trim();
            
            if (menuName && menuPrice) {
                this.showNotification(`${menuName} (${menuPrice}) 선택됨`, 'info');
                console.log('Selected menu:', { name: menuName, price: menuPrice });
            }
        }
    }

    /**
     * 메뉴 카테고리 토글 초기화
     */
    initMenuCategoryToggles() {
        const categoryTitles = document.querySelectorAll('.category-title');
        
        categoryTitles.forEach((title) => {
            if (title.hasAttribute('data-toggle-initialized')) return;
            
            title.style.cursor = 'pointer';
            title.style.userSelect = 'none';
            
            title.addEventListener('click', () => {
                const category = title.closest('.menu-category');
                const menuItems = category && category.querySelector('.menu-items');
                
                if (menuItems) {
                    const isHidden = menuItems.style.display === 'none';
                    menuItems.style.display = isHidden ? 'flex' : 'none';
                    title.style.opacity = isHidden ? '1' : '0.7';
                    
                    // 토글 아이콘 추가/업데이트
                    let icon = title.querySelector('.toggle-icon');
                    if (!icon) {
                        icon = document.createElement('i');
                        icon.className = 'fas fa-chevron-down toggle-icon';
                        icon.style.marginLeft = '0.5rem';
                        icon.style.transition = 'transform 0.3s ease';
                        icon.style.fontSize = '0.8rem';
                        title.appendChild(icon);
                    }
                    
                    icon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-180deg)';
                }
            });
            
            title.setAttribute('data-toggle-initialized', 'true');
        });
    }

    /**
     * 메뉴 검색 기능 추가
     */
    addMenuSearchFeature() {
        const menuSection = document.querySelector('.menu-section');
        if (!menuSection || menuSection.querySelector('.menu-search-container')) return;

        const sectionTitle = menuSection.querySelector('.section-title');
        if (!sectionTitle) return;

        try {
            const searchContainer = this.createSearchContainer();
            sectionTitle.parentNode.insertBefore(searchContainer, sectionTitle.nextSibling);
            this.bindSearchEvents(searchContainer);
        } catch (error) {
            console.warn('메뉴 검색 기능 추가 실패:', error);
        }
    }

    /**
     * 검색 컨테이너 생성
     */
    createSearchContainer() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'menu-search-container';
        searchContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: var(--background-soft);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'menu-search';
        searchInput.placeholder = '메뉴 검색...';
        searchInput.style.cssText = `
            flex: 1;
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'search-clear-btn';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.style.cssText = `
            padding: 0.5rem;
            background: transparent;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            border-radius: var(--radius-sm);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.color = 'var(--text-light)';

        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearBtn);

        return searchContainer;
    }

    /**
     * 검색 이벤트 바인딩
     */
    bindSearchEvents(searchContainer) {
        const searchInput = searchContainer.querySelector('.menu-search');
        const clearBtn = searchContainer.querySelector('.search-clear-btn');
        
        if (!searchInput || !clearBtn) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.filterMenuItems(searchTerm);
            clearBtn.style.opacity = searchTerm ? '1' : '0';
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            this.filterMenuItems('');
            clearBtn.style.opacity = '0';
            searchInput.focus();
        });

        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = 'var(--primary-color)';
            searchInput.style.boxShadow = '0 0 0 2px var(--primary-light)';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = 'var(--border-color)';
            searchInput.style.boxShadow = 'none';
        });
    }

    /**
     * 메뉴 아이템 필터링
     */
    filterMenuItems(searchTerm) {
        const menuItems = document.querySelectorAll('.menu-item');
        let visibleCount = 0;
        
        menuItems.forEach((item) => {
            const menuNameEl = item.querySelector('.menu-name');
            const menuDescEl = item.querySelector('.menu-description');
            
            const menuName = menuNameEl ? menuNameEl.textContent.toLowerCase() : '';
            const menuDescription = menuDescEl ? menuDescEl.textContent.toLowerCase() : '';
            
            const matches = !searchTerm || menuName.includes(searchTerm) || menuDescription.includes(searchTerm);
            
            item.style.display = matches ? 'flex' : 'none';
            
            if (matches) {
                visibleCount++;
                
                if (searchTerm) {
                    item.style.backgroundColor = 'var(--primary-light)';
                    item.style.borderColor = 'var(--primary-color)';
                } else {
                    item.style.backgroundColor = '';
                    item.style.borderColor = '';
                }
            }
        });

        this.showSearchResultMessage(visibleCount, searchTerm);
    }

    /**
     * 검색 결과 메시지 표시
     */
    showSearchResultMessage(count, searchTerm) {
        const menuSection = document.querySelector('.menu-section');
        if (!menuSection) return;
        
        const existingMessage = menuSection.querySelector('.search-result-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (searchTerm && count === 0) {
            const message = document.createElement('div');
            message.className = 'search-result-message';
            message.style.cssText = `
                text-align: center;
                padding: 2rem;
                color: var(--text-light);
                font-style: italic;
                background: var(--background-soft);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
            `;
            message.textContent = `"${searchTerm}"에 대한 검색 결과가 없습니다.`;
            
            const searchContainer = menuSection.querySelector('.menu-search-container');
            if (searchContainer && searchContainer.nextSibling) {
                menuSection.insertBefore(message, searchContainer.nextSibling);
            }
        }
    }

    /**
     * 리뷰 필터 초기화
     */
    initReviewFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach((btn) => {
            if (btn.hasAttribute('data-filter-initialized')) return;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                filterBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterType = btn.getAttribute('data-filter');
                this.applyReviewFilter(filterType);
            });
            
            btn.setAttribute('data-filter-initialized', 'true');
        });
    }

    /**
     * 리뷰 필터 적용
     */
    applyReviewFilter(filterType) {
        const reviewItems = document.querySelectorAll('.review-item');
        
        reviewItems.forEach((item) => {
            item.style.opacity = '0.3';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 200);
        });

        console.log(`필터 적용: ${filterType}`);
    }

    /**
     * 지도 모달 초기화
     */
    initMapModal() {
        const mapThumbnail = document.getElementById('kakao-map');
        const mapModal = document.getElementById('map-modal');
        const closeModal = document.getElementById('close-modal');

        if (!mapModal || !closeModal) return;

        // 지도 컨테이너 클릭 이벤트는 카카오맵에서 처리

        closeModal.addEventListener('click', () => {
            this.closeMapModal();
        });

        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) {
                this.closeMapModal();
            }
        });

        // ESC 키 이벤트 (전역에서 한 번만 등록)
        if (!document.body.hasAttribute('data-esc-initialized')) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (mapModal.classList.contains('active')) {
                        this.closeMapModal();
                    }
                    const deleteModal = document.getElementById('delete-confirm-modal');
                    if (deleteModal && deleteModal.classList.contains('active')) {
                        if (typeof window.closeDeleteModal === 'function') {
                            window.closeDeleteModal();
                        }
                    }
                }
            });
            document.body.setAttribute('data-esc-initialized', 'true');
        }
    }

    /**
     * 모달 열기
     */
    openModal(modal) {
        if (!modal) return;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
    }

    /**
     * 모달 닫기
     */
    closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * 예약 폼 초기화
     */
    initReservationForm() {
        const reservationForm = document.querySelector('.reservation-form');

        if (reservationForm && !reservationForm.hasAttribute('data-form-initialized')) {
            reservationForm.addEventListener('submit', (e) => {
                if (!this.validateReservationForm()) {
                    e.preventDefault();
                    return false;
                }
                this.showNotification('예약 신청이 완료되었습니다!', 'success');
            });
            reservationForm.setAttribute('data-form-initialized', 'true');
        }
    }

    /**
     * 예약 폼 유효성 검사
     */
    validateReservationForm() {
        const dateInput = document.getElementById('reservation-date');
        const timeSelect = document.querySelector('.time-select');
        const counterValue = document.querySelector('.counter-value');
        const hiddenInput = document.querySelector('.people-count-input');
        const commentTextarea = document.querySelector('.reservation-comment');
        
        const date = dateInput ? dateInput.value : '';
        const time = timeSelect ? timeSelect.value : '';
        const persons = counterValue ? counterValue.textContent : '';
        const comment = commentTextarea ? commentTextarea.value.trim() : '';

        // 날짜 유효성 검사
        if (!date) {
            this.showNotification('날짜를 선택해주세요.', 'error');
            if (dateInput) dateInput.focus();
            return false;
        }

        // 시간 유효성 검사
        if (!time) {
            this.showNotification('시간을 선택해주세요.', 'error');
            if (timeSelect) timeSelect.focus();
            return false;
        }

        // 인원수 hidden input 최종 업데이트
        if (hiddenInput && counterValue) {
            hiddenInput.value = counterValue.textContent;
        }

        // 코멘트 길이 검사 (선택사항이므로 경고만)
        if (comment.length > 200) {
            this.showNotification('요청사항은 200자 이하로 입력해주세요.', 'error');
            if (commentTextarea) commentTextarea.focus();
            return false;
        }

        // 로그인 체크
        const memberNoInput = document.querySelector('input[name="MemberNo"]');
        const memberNo = memberNoInput ? memberNoInput.value : '';
        
        if (!memberNo) {
            this.showNotification('로그인이 필요합니다.', 'error');
            return false;
        }

        // 예약 정보 콘솔 출력 (디버깅용)
        console.log('예약 정보:', {
            date,
            time,
            persons,
            comment: comment || '없음'
        });

        return true;
    }

    /**
     * 리뷰 이미지 클릭 처리
     */
    initReviewImageViewer() {
        const reviewImages = document.querySelectorAll('.review-image');
        
        reviewImages.forEach((img) => {
            if (img.hasAttribute('data-viewer-initialized')) return;
            
            img.addEventListener('click', () => {
                this.openImageViewer(img.src);
            });
            
            img.setAttribute('data-viewer-initialized', 'true');
        });
    }

    /**
     * 이미지 뷰어 열기
     */
    openImageViewer(imageSrc) {
        if (!imageSrc) return;
        
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.innerHTML = `
            <div class="image-viewer-content">
                <img src="${imageSrc}" alt="리뷰 이미지">
                <button class="image-viewer-close" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(viewer);
        document.body.style.overflow = 'hidden';

        const closeBtn = viewer.querySelector('.image-viewer-close');
        const closeViewer = () => {
            if (viewer.parentNode) {
                viewer.remove();
            }
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeViewer);
        }
        
        viewer.addEventListener('click', (e) => {
            if (e.target === viewer) closeViewer();
        });

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeViewer();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * 리뷰 액션 초기화 (도움돼요, 신고 등)
     */
    initReviewActions() {
        // 도움돼요 버튼
        const helpfulBtns = document.querySelectorAll('.review-helpful-btn');
        helpfulBtns.forEach((btn) => {
            if (btn.hasAttribute('data-helpful-initialized')) return;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleHelpfulClick(btn);
            });
            
            btn.setAttribute('data-helpful-initialized', 'true');
        });

        // 신고 버튼
        const reportBtns = document.querySelectorAll('.review-report-btn');
        reportBtns.forEach((btn) => {
            if (btn.hasAttribute('data-report-initialized')) return;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReportClick(btn);
            });
            
            btn.setAttribute('data-report-initialized', 'true');
        });

        // 더보기 버튼
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn && !loadMoreBtn.hasAttribute('data-load-initialized')) {
            loadMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadMoreReviews();
            });
            loadMoreBtn.setAttribute('data-load-initialized', 'true');
        }
    }

    /**
     * 도움돼요 버튼 클릭 처리
     */
    handleHelpfulClick(btn) {
        const isActive = btn.classList.contains('active');
        const countSpan = btn.querySelector('.helpful-count');
        let currentCount = parseInt(countSpan.textContent) || 0;

        if (isActive) {
            // 취소
            btn.classList.remove('active');
            btn.querySelector('i').className = 'far fa-thumbs-up';
            currentCount = Math.max(0, currentCount - 1);
            countSpan.textContent = currentCount;
            this.showNotification('도움돼요를 취소했습니다.', 'info');
        } else {
            // 추가
            btn.classList.add('active');
            btn.querySelector('i').className = 'fas fa-thumbs-up';
            currentCount += 1;
            countSpan.textContent = currentCount;
            this.showNotification('도움이 된다고 표시했습니다.', 'success');
        }

        // 애니메이션 효과
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * 신고 버튼 클릭 처리
     */
    handleReportClick(btn) {
        const confirmed = confirm('이 리뷰를 신고하시겠습니까?\n\n부적절한 내용이나 허위 정보가 포함된 리뷰를 신고해주세요.');
        
        if (confirmed) {
            this.showNotification('신고가 접수되었습니다. 검토 후 조치하겠습니다.', 'success');
            
            // 신고 완료 후 버튼 비활성화
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.innerHTML = '<i class="fas fa-check"></i> 신고됨';
        }
    }

    /**
     * 리뷰 더보기
     */
    loadMoreReviews() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (loadMoreBtn) {
            // 로딩 상태 표시
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로딩 중...';
            loadMoreBtn.disabled = true;
            
            // 실제로는 AJAX 요청을 통해 추가 리뷰를 불러와야 함
            setTimeout(() => {
                this.showNotification('추가 리뷰를 불러왔습니다.', 'success');
                loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> 리뷰 더보기';
                loadMoreBtn.disabled = false;
            }, 1000);
        }
    }

    /**
     * 모달 관련 함수들 초기화 (JSP에서 분리된 함수들)
     */
    initModalFunctions() {
        // 전역 함수들을 클래스 메서드로 이동
        window.confirmDelete = (deleteUrl) => {
            const modal = document.getElementById('delete-confirm-modal');
            const confirmBtn = document.getElementById('confirm-delete-btn');
            
            if (modal && confirmBtn) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                confirmBtn.onclick = function() {
                    window.location.href = deleteUrl;
                };
            }
        };
        
        window.closeDeleteModal = () => {
            const modal = document.getElementById('delete-confirm-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        };

        // 카카오맵 관련 전역 함수들
        window.openLargeMap = () => {
            this.openLargeMapModal();
        };

        window.copyAddress = () => {
            this.copyStoreAddress();
        };

        window.centerMap = () => {
            this.centerMap();
        };

        window.openKakaoMap = () => {
            this.openKakaoMapApp();
        };
    }

    /**
     * 알림 표시
     */
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        const autoRemoveTimer = setTimeout(() => {
            this.removeNotification(notification);
        }, 4000);

        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoRemoveTimer);
                this.removeNotification(notification);
            });
        }
    }

    /**
     * 알림 제거
     */
    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.restaurantDetail = new RestaurantDetail();
        console.log('RestaurantDetail 초기화 완료 - 카카오맵 포함');
    } catch (error) {
        console.error('RestaurantDetail 초기화 실패:', error);
    }
});

// 음식점 상세페이지 전용 CSS 스타일
const restaurantDetailStyles = `
    /* CSS 변수 정의 */
    :root {
        --primary-color: #3b82f6;
        --primary-light: rgba(59, 130, 246, 0.1);
        --primary-dark: #1d4ed8;
        --success-color: #10b981;
        --warning-color: #f59e0b;
        --error-color: #ef4444;
        --text-primary: #1f2937;
        --text-secondary: #6b7280;
        --text-light: #9ca3af;
        --background-color: #ffffff;
        --background-soft: #f9fafb;
        --border-color: #e5e7eb;
        --border-light: #f3f4f6;
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        --radius-sm: 0.375rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
    }

    /* 기본 알림 스타일 */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        transform: translateX(100%);
        animation: slideIn 0.3s ease forwards;
        max-width: 350px;
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-error {
        border-left: 4px solid #ef4444;
    }

    .notification-info {
        border-left: 4px solid #3b82f6;
    }

    .notification-warning {
        border-left: 4px solid #ffb100;
    }

    .notification-content {
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }

    .notification-message {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #94a3b8;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .notification-close:hover {
        color: #475569;
    }

    .fade-out {
        animation: slideOut 0.3s ease forwards;
    }

    @keyframes slideIn {
        to { transform: translateX(0); }
    }

    @keyframes slideOut {
        to { transform: translateX(100%); }
    }

    /* 지도 관련 스타일 */
    .map-container {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .map-container:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
    }

    .map-controls {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .map-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
    }

    .map-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
        color: white;
    }

    .map-btn i {
        font-size: 0.8rem;
    }

    /* 큰 지도 모달 스타일 */
    .large-modal .modal-content {
        width: 90vw;
        max-width: 1000px;
        height: 80vh;
        max-height: 700px;
    }

    .large-modal .modal-body {
        padding: 0;
        height: calc(100% - 60px);
        display: flex;
        flex-direction: column;
    }

    .modal-location-info {
        padding: 1rem;
        background: var(--background-soft);
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }

    .location-details h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 1.1rem;
    }

    .location-details p {
        margin: 0.25rem 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .modal-map-controls {
        display: flex;
        gap: 0.5rem;
    }

    .modal-map-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
    }

    .modal-map-btn:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
        transform: translateY(-1px);
    }

    .modal-map-btn i {
        font-size: 0.8rem;
    }

    /* 시간 선택 도움말 스타일 */
    .time-info {
        margin-top: 0.5rem;
    }

    .time-help-text {
        color: var(--text-secondary);
        font-size: 0.8rem;
        font-style: italic;
        transition: color 0.2s ease;
    }

    .time-select:disabled {
        background: var(--background-soft);
        color: var(--text-light);
        cursor: not-allowed;
    }

    .time-select:disabled:hover {
        transform: none;
    }

    /* 예약 가능 시간 강조 */
    .time-select option[value=""] {
        color: var(--text-light);
        font-style: italic;
    }

    .time-select option:not([value=""]) {
        color: var(--text-primary);
        font-weight: 500;
    }

    /* 시간 선택 애니메이션 */
    .time-select {
        transition: all 0.3s ease;
    }

    .time-select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px var(--primary-light);
    }

    /* 이미지 뷰어 스타일 */
    .image-viewer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .image-viewer-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }

    .image-viewer img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }

    .image-viewer-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #374151;
    }

    /* 리뷰 액션 버튼 스타일 */
    .review-actions-bottom {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-light);
    }

    .review-helpful-btn,
    .review-report-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--background-soft);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .review-helpful-btn:hover,
    .review-report-btn:hover {
        background: var(--background-color);
        color: var(--text-primary);
        transform: translateY(-1px);
    }

    .review-helpful-btn.active {
        background: var(--primary-light);
        color: var(--primary-color);
        border-color: var(--primary-color);
    }

    .review-helpful-btn.active i {
        color: var(--primary-color);
    }

    /* 리뷰 작성 버튼 스타일 */
    .review-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .write-review-btn,
    .first-review-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: var(--radius-md);
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .write-review-btn:hover,
    .first-review-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
        color: white;
        text-decoration: none;
    }

    /* 리뷰 없음 상태 */
    .no-reviews {
        text-align: center;
        padding: 3rem 2rem;
        background: var(--background-soft);
        border-radius: var(--radius-lg);
        border: 1px solid var(--border-light);
    }

    .no-reviews-icon {
        margin-bottom: 1rem;
    }

    .no-reviews-icon i {
        font-size: 3rem;
        color: var(--text-light);
    }

    .no-reviews-text {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin: 0 0 0.5rem 0;
    }

    .no-reviews-subtext {
        color: var(--text-light);
        margin: 0 0 1.5rem 0;
    }

    /* 삭제 확인 모달 스타일 */
    .delete-confirm-content {
        text-align: center;
        padding: 1rem 0;
    }

    .delete-icon {
        margin-bottom: 1rem;
    }

    .delete-icon i {
        font-size: 3rem;
        color: var(--warning-color);
    }

    .delete-warning {
        color: var(--text-light);
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
        text-decoration: none;
    }

    .btn-cancel {
        background: var(--background-soft);
        color: var(--text-secondary);
        border-color: var(--border-color);
    }

    .btn-cancel:hover {
        background: var(--background-color);
        color: var(--text-primary);
    }

    .btn-delete {
        background: var(--error-color);
        color: white;
        border-color: var(--error-color);
    }

    .btn-delete:hover {
        background: #dc2626;
        border-color: #dc2626;
    }

    /* 메뉴 검색 스타일 */
    .menu-search:focus {
        outline: none;
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 2px var(--primary-light) !important;
    }

    .search-clear-btn:hover {
        background: var(--background-soft) !important;
        color: var(--text-primary) !important;
    }

    /* 로드 더보기 버튼 */
    .load-more-section {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-light);
    }

    .load-more-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 2rem;
        background: var(--background-soft);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .load-more-btn:hover {
        background: var(--background-color);
        color: var(--text-primary);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }

    .load-more-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    /* 카카오맵 인포윈도우 스타일 재정의 */
    .kakao-map .overlaybox {
        position: relative;
        width: 200px;
        height: auto;
        background: white;
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid var(--border-color) !important;
    }

    /* 지도 로딩 애니메이션 */
    .map-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        background: var(--background-soft);
        border-radius: 8px;
        color: var(--text-light);
    }

    .map-loading i {
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* 로드뷰 컨테이너 스타일 */
    .roadview-container {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 10;
    }

    /* 반응형 지도 */
    @media (max-width: 768px) {
        .large-modal .modal-content {
            width: 95vw;
            height: 85vh;
        }

        .modal-location-info {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }

        .modal-map-controls {
            justify-content: center;
        }

        .map-controls {
            flex-direction: column;
        }

        .map-btn {
            justify-content: center;
        }
    }

    /* 반응형 알림 */
    @media (max-width: 480px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100%);
            animation: slideInMobile 0.3s ease forwards;
        }

        .fade-out {
            animation: slideOutMobile 0.3s ease forwards;
        }

        @keyframes slideInMobile {
            to { transform: translateY(0); }
        }

        @keyframes slideOutMobile {
            to { transform: translateY(-100%); }
        }

        .review-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }

        .review-filters {
            justify-content: center;
        }

        .modal-actions {
            flex-direction: column;
        }

        .review-actions-bottom {
            flex-direction: column;
            gap: 0.75rem;
        }

        .review-helpful-btn,
        .review-report-btn {
            justify-content: center;
        }
    }
`;

// 스타일 추가 (중복 방지)
if (!document.getElementById('restaurant-detail-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'restaurant-detail-styles';
    styleSheet.textContent = restaurantDetailStyles;
    document.head.appendChild(styleSheet);
}