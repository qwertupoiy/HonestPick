// 스토어 편집 페이지 JavaScript - 편의시설 카드 기능 추가
document.addEventListener('DOMContentLoaded', function() {
    initializeStoreEditPage();
    initializeFormSubmission();
});

function initializeStoreEditPage() {
    // 필수 기능 초기화
    initializeAddressSearch();
    initializeImageUpload();
    initializeBusinessNumberFormat();
    initializePhoneNumberFormat();
    initializeFacilitiesCards(); // 새로운 카드 스타일 기능
    initializeOperatingHours();
    initializeCancelButton();
    
    // 기존 데이터 로드
    loadExistingData();
}

// 다음 주소 검색 API 초기화
function initializeAddressSearch() {
    const addressSearchBtn = document.getElementById('address-search-btn');
    
    if (addressSearchBtn) {
        addressSearchBtn.addEventListener('click', function() {
            new daum.Postcode({
                oncomplete: function(data) {
                    document.getElementById('postcode').value = data.zonecode;
                    document.getElementById('address').value = data.address;
                    
                    let extraAddr = '';
                    
                    if (data.addressType === 'R') {
                        if (data.bname !== '') {
                            extraAddr += data.bname;
                        }
                        if (data.buildingName !== '') {
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        document.getElementById('extraAddress').value = extraAddr !== '' ? ' (' + extraAddr + ')' : '';
                    } else {
                        document.getElementById('extraAddress').value = '';
                    }
                    
                    document.getElementById('detailAddress').focus();
                }
            }).open();
        });
    }
}

// 이미지 업로드 기능 초기화
function initializeImageUpload() {
    const imageUploadBtn = document.getElementById('image-upload-btn');
    const imageRemoveBtn = document.getElementById('image-remove-btn');
    const fileInput = document.getElementById('storeImage');
    const previewImage = document.getElementById('preview-image');
    
    // 이미지 업로드 버튼 클릭
    if (imageUploadBtn) {
        imageUploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // 파일 선택 시 미리보기
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 파일 크기 체크 (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
                    fileInput.value = '';
                    return;
                }
                
                // 파일 타입 체크
                if (!file.type.startsWith('image/')) {
                    alert('이미지 파일만 업로드 가능합니다.');
                    fileInput.value = '';
                    return;
                }
                
                // 미리보기 표시
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 이미지 삭제 버튼
    if (imageRemoveBtn) {
        imageRemoveBtn.addEventListener('click', function() {
            if (confirm('이미지를 삭제하시겠습니까?')) {
                fileInput.value = '';
                previewImage.src = '../images/no-image.png';
            }
        });
    }
}

// 사업자등록번호 포맷팅
function initializeBusinessNumberFormat() {
    const businessNumberInput = document.getElementById('businessNumber');
    
    if (businessNumberInput) {
        businessNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.length >= 3) {
                value = value.substring(0, 3) + '-' + value.substring(3);
            }
            if (value.length >= 6) {
                value = value.substring(0, 6) + '-' + value.substring(6);
            }
            if (value.length > 12) {
                value = value.substring(0, 12);
            }
            
            e.target.value = value;
        });
    }
}

// 전화번호 포맷팅
function initializePhoneNumberFormat() {
    const phoneInput = document.getElementById('storePhone');
    
    if (phoneInput) {
        phoneInput.setAttribute('placeholder', '예: 02-123-4567, 010-1234-5678');
        
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.startsWith('02')) {
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '-' + value.substring(2);
                }
                if (value.length >= 6) {
                    value = value.substring(0, 6) + '-' + value.substring(6);
                }
                if (value.length > 12) {
                    value = value.substring(0, 12);
                }
            } else if (value.startsWith('0')) {
                if (value.length >= 3) {
                    value = value.substring(0, 3) + '-' + value.substring(3);
                }
                if (value.length >= 8) {
                    value = value.substring(0, 8) + '-' + value.substring(8);
                }
                if (value.length > 13) {
                    value = value.substring(0, 13);
                }
            }
            
            e.target.value = value;
        });
    }
}

// 편의시설 카드 스타일링 및 기능 - register.js와 동일한 방식
function initializeFacilitiesCards() {
    const facilityCards = document.querySelectorAll('.facility-card');
    
    facilityCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const label = card.querySelector('.facility-label');
        
        // 카드 클릭 이벤트
        card.addEventListener('click', function(e) {
            // 체크박스나 라벨을 직접 클릭한 경우가 아니라면 체크 상태 토글
            if (e.target.type !== 'checkbox' && e.target.tagName !== 'LABEL') {
                e.preventDefault();
                checkbox.checked = !checkbox.checked;
                
                // change 이벤트 수동 발생
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
            }
        });

        // 체크박스 상태 변경 이벤트
        checkbox.addEventListener('change', function() {
            updateFacilityCardState(card, this.checked);
            // 편의시설이 변경될 때마다 문자열 업데이트
            updateFacilitiesString();
        });

        // 라벨 클릭 이벤트 (기본 동작 유지)
        label.addEventListener('click', function(e) {
            // 라벨 클릭 시 체크박스 상태가 자동으로 변경되므로 별도 처리 불필요
            setTimeout(() => {
                updateFacilityCardState(card, checkbox.checked);
                updateFacilitiesString();
            }, 10);
        });

        // 초기 상태 설정
        updateFacilityCardState(card, checkbox.checked);
    });
    
    console.log('편의시설 카드 개수:', facilityCards.length);
}

// 편의시설 카드 상태 업데이트 함수
function updateFacilityCardState(card, isChecked) {
    if (isChecked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

// 운영시간 관리
function initializeOperatingHours() {
    const timeSelects = document.querySelectorAll('.time-select');
    
    // 시간 옵션 생성 (이미 JSP에서 생성되어 있으므로 생략 가능)
    // 요일별 시간 설정 연동
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const openSelect = document.querySelector(`select[name="${day}Open"]`);
        const closeSelect = document.querySelector(`select[name="${day}Close"]`);
        
        if (openSelect && closeSelect) {
            openSelect.addEventListener('change', function() {
                if (this.value === '') {
                    closeSelect.value = '';
                    closeSelect.disabled = true;
                } else {
                    closeSelect.disabled = false;
                }
                // 운영시간이 변경될 때마다 문자열 업데이트
                updateScheduleString();
            });
            
            closeSelect.addEventListener('change', function() {
                if (this.value === '') {
                    openSelect.value = '';
                }
                // 운영시간이 변경될 때마다 문자열 업데이트
                updateScheduleString();
            });
        }
    });
}

// 취소 버튼 처리
function initializeCancelButton() {
    const cancelBtn = document.getElementById('cancel-btn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
                window.history.back();
            }
        });
    }
}

// 기존 데이터 로드
function loadExistingData() {
    // 편의시설 체크박스 설정
    const currentFacilities = document.querySelector('input[name="currentFacilities"]');
    if (currentFacilities && currentFacilities.value) {
        try {
            const facilities = JSON.parse(currentFacilities.value);
            facilities.forEach(facility => {
                const checkbox = document.querySelector(`input[name="StoreFacilities"][value="${facility}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    const card = checkbox.closest('.facility-card');
                    if (card) {
                        updateFacilityCardState(card, true);
                    }
                }
            });
        } catch (e) {
            console.log('편의시설 데이터 로드 중 오류:', e);
            
            // JSON 파싱 실패 시 문자열로 처리
            if (currentFacilities.value) {
                const facilities = currentFacilities.value.split(',').map(f => f.trim());
                facilities.forEach(facility => {
                    const checkbox = document.querySelector(`input[name="StoreFacilities"][value="${facility}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        const card = checkbox.closest('.facility-card');
                        if (card) {
                            updateFacilityCardState(card, true);
                        }
                    }
                });
            }
        }
    }
    
    // 운영시간 설정
    const currentOperatingHours = document.querySelector('input[name="currentOperatingHours"]');
    if (currentOperatingHours && currentOperatingHours.value) {
        try {
            const operatingHours = JSON.parse(currentOperatingHours.value);
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
            
            days.forEach((day, index) => {
                const dayData = operatingHours[dayNames[index]];
                if (dayData) {
                    const openSelect = document.querySelector(`select[name="${day}Open"]`);
                    const closeSelect = document.querySelector(`select[name="${day}Close"]`);
                    
                    if (openSelect && closeSelect) {
                        if (dayData.open) openSelect.value = dayData.open;
                        if (dayData.close) closeSelect.value = dayData.close;
                    }
                }
            });
        } catch (e) {
            console.log('운영시간 데이터 로드 중 오류:', e);
        }
    }
    
    // 초기 데이터 로드 후 문자열 업데이트
    updateFacilitiesString();
    updateScheduleString();
}

// 폼 제출 시 데이터 처리
function initializeFormSubmission() {
    const form = document.getElementById('store-edit-form');
    const saveBtn = document.getElementById('save-btn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 제출 방지
            
            // 폼 유효성 검사
            if (!validateForm()) {
                return;
            }
            
            // 데이터 업데이트
            updateFacilitiesString();
            updateScheduleString();
            
            // 디버깅을 위한 로그
            console.log('Facilities String:', document.querySelector('input[name="StoreFacilitiesString"]').value);
            console.log('Schedule String:', document.querySelector('input[name="StoreScheduleString"]').value);
            
            // 폼 제출
            form.submit();
        });
    }
}

// 편의시설 문자열 실시간 업데이트
function updateFacilitiesString() {
    const facilitiesString = collectFacilitiesString();
    const input = document.querySelector('input[name="StoreFacilitiesString"]');
    if (input) {
        input.value = facilitiesString;
    }
}

// 운영시간 문자열 실시간 업데이트
function updateScheduleString() {
    const scheduleString = collectScheduleString();
    const input = document.querySelector('input[name="StoreScheduleString"]');
    if (input) {
        input.value = scheduleString;
    }
}

// 편의시설을 문자열로 수집
function collectFacilitiesString() {
    const checkedFacilities = [];
    const facilityCheckboxes = document.querySelectorAll('input[name="StoreFacilities"]:checked');
    
    facilityCheckboxes.forEach(checkbox => {
        checkedFacilities.push(checkbox.value);
    });
    
    // 콤마로 구분된 문자열로 반환
    return checkedFacilities.length > 0 ? checkedFacilities.join(', ') : '편의시설 없음';
}

// 시간 포맷팅 함수 (09:00 형태로 유지)
function formatTimeDisplay(timeString) {
    if (!timeString) return '';
    
    // 이미 올바른 형태이므로 그대로 반환
    return timeString;
}

// 운영시간을 문자열로 수집 (09:00 형태로 유지)
function collectScheduleString() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const scheduleArray = [];
    
    days.forEach((day, index) => {
        const openSelect = document.querySelector(`select[name="${day}Open"]`);
        const closeSelect = document.querySelector(`select[name="${day}Close"]`);
        
        if (openSelect && closeSelect && openSelect.value && closeSelect.value) {
            // 시간 포맷팅 적용 (09:00 형태로 유지)
            const formattedOpenTime = formatTimeDisplay(openSelect.value);
            const formattedCloseTime = formatTimeDisplay(closeSelect.value);
            scheduleArray.push(`${dayNames[index]} ${formattedOpenTime}-${formattedCloseTime}`);
        } else {
            scheduleArray.push(`${dayNames[index]} 휴무`);
        }
    });
    
    // 콤마로 구분된 문자열로 반환
    return scheduleArray.join(', ');
}

// 폼 유효성 검사
function validateForm() {
    const required = document.querySelectorAll('input[required], select[required]');
    
    for (let field of required) {
        if (!field.value.trim()) {
            const label = field.parentElement.querySelector('label');
            const fieldName = label ? label.textContent.replace('*', '').trim() : '필수 항목';
            alert(`필수 항목을 입력해주세요: ${fieldName}`);
            field.focus();
            return false;
        }
    }
    
    return true;
}

// 편의시설 실시간 미리보기 (선택사항)
function updateFacilitiesPreview() {
    const facilitiesString = collectFacilitiesString();
    // 필요시 미리보기 영역에 선택된 편의시설 표시
    console.log('현재 선택된 편의시설:', facilitiesString);
}

// 편의시설 변경 시 미리보기 업데이트
document.addEventListener('DOMContentLoaded', function() {
    // 편의시설 변경 시 미리보기 업데이트 이벤트 추가
    setTimeout(() => {
        document.querySelectorAll('input[name="StoreFacilities"]').forEach(input => {
            input.addEventListener('change', updateFacilitiesPreview);
        });
    }, 100);
});

console.log('매장 수정 페이지 스크립트가 로드되었습니다.');