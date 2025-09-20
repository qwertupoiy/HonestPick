// 매장 등록 페이지 JavaScript - storeEdit.js와 동일한 구조로 개선
document.addEventListener('DOMContentLoaded', function() {
    initializeStoreRegisterPage();
    initializeFormSubmission();
});

function initializeStoreRegisterPage() {
    // 필수 기능 초기화
    initializeTimeSelects(); // 시간 옵션 생성을 가장 먼저 실행
    initializeAddressSearch();
    initializeImageUpload();
    initializeBusinessNumberFormat();
    initializePhoneNumberFormat();
    initializeFacilitiesCards();
    initializeOperatingHours();
    
    console.log('매장 등록 페이지가 초기화되었습니다.');
}

// 시간 선택 옵션을 동적으로 생성하는 함수
function initializeTimeSelects() {
    const timeSelects = document.querySelectorAll('.time-select');
    
    timeSelects.forEach(select => {
        // 기존 옵션 초기화
        select.innerHTML = '';
        
        // 휴무 옵션 추가
        const restOption = document.createElement('option');
        restOption.value = '';
        restOption.textContent = '휴무';
        select.appendChild(restOption);
        
        // 시간 옵션 생성 (00:00 ~ 23:30, 30분 간격)
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeValue = String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
                const option = document.createElement('option');
                option.value = timeValue;
                option.textContent = timeValue;
                select.appendChild(option);
            }
        }
    });
    
    // 기본값 설정 (평일 09:00-22:00, 일요일 휴무)
    setDefaultOperatingHours();
}

// 기본 운영시간 설정 함수
function setDefaultOperatingHours() {
    const defaultHours = {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '22:00' },
        saturday: { open: '09:00', close: '22:00' },
        sunday: { open: '', close: '' } // 일요일 휴무
    };
    
    Object.keys(defaultHours).forEach(day => {
        const openSelect = document.querySelector(`select[name="${day}Open"]`);
        const closeSelect = document.querySelector(`select[name="${day}Close"]`);
        
        if (openSelect && closeSelect) {
            openSelect.value = defaultHours[day].open;
            closeSelect.value = defaultHours[day].close;
            
            // 휴무일인 경우 close select 비활성화
            if (!defaultHours[day].open) {
                closeSelect.disabled = true;
            }
        }
    });
}

// 시간 포맷팅 함수 (09:00 형태로 유지)
function formatTimeDisplay(timeString) {
    if (!timeString) return '';
    
    // 이미 올바른 형태이므로 그대로 반환
    return timeString;
}

// 다음 주소 검색 API 초기화
function initializeAddressSearch() {
    const addressSearchBtn = document.querySelector('.address-search-btn');
    
    if (addressSearchBtn) {
        addressSearchBtn.addEventListener('click', function() {
            new daum.Postcode({
                oncomplete: function(data) {
                    var addr = '';
                    var extraAddr = '';

                    // 사용자 선택에 따라 주소를 가져옴
                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }

                    // 참고항목 조합
                    if(data.userSelectedType === 'R'){
                        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                            extraAddr += data.bname;
                        }
                        if(data.buildingName !== '' && data.apartment === 'Y'){
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        if(extraAddr !== ''){
                            extraAddr = ' (' + extraAddr + ')';
                        }
                        document.getElementById("storeExtraAddress").value = extraAddr;
                    } else {
                        document.getElementById("storeExtraAddress").value = '';
                    }

                    // 우편번호와 주소 정보를 해당 필드에 넣기
                    document.getElementById('storePostcode').value = data.zonecode;
                    document.getElementById("storeAddress").value = addr;
                    document.getElementById("storeDetailAddress").focus();
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
    const previewImage = document.getElementById('storeImagePreview');
    
    // 이미지 업로드 버튼 클릭
    if (imageUploadBtn) {
        imageUploadBtn.addEventListener('click', function() {
            if (fileInput) {
                fileInput.click();
            }
        });
    }
    
    // 파일 선택 시 미리보기
    if (fileInput && previewImage) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 파일 크기 체크 (5MB 제한)
                if (file.size > 5 * 1024 * 1024) {
                    alert('파일 크기가 너무 큽니다. 5MB 이하의 이미지를 선택해주세요.');
                    this.value = '';
                    return;
                }

                // 이미지 파일 타입 체크
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    alert('지원하지 않는 파일 형식입니다. JPG, PNG, GIF 파일을 선택해주세요.');
                    this.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 이미지 삭제 버튼
    if (imageRemoveBtn && fileInput && previewImage) {
        imageRemoveBtn.addEventListener('click', function() {
            if (confirm('이미지를 삭제하시겠습니까?')) {
                fileInput.value = '';
                previewImage.src = '../_images/default-store.png';
            }
        });
    }
    
    console.log('이미지 업로드 기능 초기화 완료');
    console.log('파일 입력:', fileInput ? '찾음' : '없음');
    console.log('미리보기 이미지:', previewImage ? '찾음' : '없음');
    console.log('업로드 버튼:', imageUploadBtn ? '찾음' : '없음');
}

// 사업자등록번호 포맷팅
function initializeBusinessNumberFormat() {
    const businessNumberInput = document.getElementById('businessNumber');
    
    if (businessNumberInput) {
        businessNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            if (value.length > 3 && value.length <= 5) {
                value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2');
            } else if (value.length > 5) {
                value = value.replace(/(\d{3})(\d{2})(\d{1,5})/, '$1-$2-$3');
            }
            
            e.target.value = value;
        });
    }

    // 사업자등록번호 확인 버튼
    const businessVerifyBtn = document.querySelector('.business-verify-btn');
    if (businessVerifyBtn) {
        businessVerifyBtn.addEventListener('click', function() {
            const businessNumber = document.getElementById('businessNumber').value;
            
            if (!businessNumber || businessNumber.length !== 12) {
                alert('사업자등록번호를 정확히 입력해주세요.');
                return;
            }

            // 여기에 사업자등록번호 검증 API 호출 로직 추가
            alert('사업자등록번호 확인 기능을 구현해주세요.');
        });
    }
}

// 전화번호 포맷팅
function initializePhoneNumberFormat() {
    const storeContactInput = document.getElementById('storeContact');
    
    if (storeContactInput) {
        storeContactInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.startsWith('02')) {
                // 서울 지역번호
                if (value.length > 2 && value.length <= 5) {
                    value = value.replace(/(\d{2})(\d{1,3})/, '$1-$2');
                } else if (value.length > 5) {
                    value = value.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
                }
            } else if (value.startsWith('01')) {
                // 휴대폰 번호
                if (value.length > 3 && value.length <= 7) {
                    value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
                } else if (value.length > 7) {
                    value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                }
            } else {
                // 기타 지역번호
                if (value.length > 3 && value.length <= 6) {
                    value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
}

// 편의시설 카드 스타일링 및 기능 - storeEdit.js와 동일
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
            
            // 초기 상태에서 disabled 설정
            if (!openSelect.value) {
                closeSelect.disabled = true;
            }
        }
    });
}

// 폼 제출 시 데이터 처리
function initializeFormSubmission() {
    const form = document.getElementById('register-form');
    const registerBtn = document.getElementById('register-btn');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 제출 방지
            
            // 폼 유효성 검사
            if (!validateForm()) {
                return;
            }
            
            // 데이터 업데이트
            updateFacilitiesString();
            updateScheduleString();
            
            // 디버깅을 위한 로그
            console.log('Facilities String:', document.getElementById('storeFacilities').value);
            console.log('Schedule String:', document.getElementById('storeSchedule').value);
            
            // 확인 대화상자
            const facilitiesString = document.getElementById('storeFacilities').value;
            const scheduleString = document.getElementById('storeSchedule').value;
            
            if (confirm('매장 정보를 등록하시겠습니까?\n\n운영시간: ' + scheduleString + '\n편의시설: ' + facilitiesString)) {
                // 폼 제출
                form.submit();
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 유효성 검사
            if (!validateForm()) {
                return;
            }
            
            // 데이터 업데이트
            updateFacilitiesString();
            updateScheduleString();
            
            // 실제 폼 제출
            this.submit();
        });
    }
}

// 편의시설 문자열 실시간 업데이트
function updateFacilitiesString() {
    const facilitiesString = collectFacilitiesString();
    const input = document.getElementById('storeFacilities');
    if (input) {
        input.value = facilitiesString;
    }
}

// 운영시간 문자열 실시간 업데이트
function updateScheduleString() {
    const scheduleString = collectScheduleString();
    const input = document.getElementById('storeSchedule');
    if (input) {
        input.value = scheduleString;
    }
}

// 편의시설을 문자열로 수집
function collectFacilitiesString() {
    const checkedFacilities = [];
    const facilityCheckboxes = document.querySelectorAll('input[name="facilities"]:checked');
    
    facilityCheckboxes.forEach(checkbox => {
        checkedFacilities.push(checkbox.value);
    });
    
    // 콤마로 구분된 문자열로 반환
    return checkedFacilities.length > 0 ? checkedFacilities.join(', ') : '편의시설 없음';
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
    const requiredFields = [
        { id: 'storeName', name: '매장 이름' },
        { id: 'officeName', name: '상호명' },
        { id: 'storeCategory', name: '매장 카테고리' },
        { id: 'storeContact', name: '매장 연락처' },
        { id: 'storePostcode', name: '우편번호' },
        { id: 'storeAddress', name: '주소' },
        { id: 'businessNumber', name: '사업자등록번호' }
    ];

    for (let field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            alert(`${field.name}을(를) 입력해주세요.`);
            if (element) element.focus();
            return false;
        }
    }

    // 사업자등록번호 형식 검사
    const businessNumber = document.getElementById('businessNumber').value;
    if (businessNumber.length !== 12 || !businessNumber.includes('-')) {
        alert('사업자등록번호 형식이 올바르지 않습니다.');
        document.getElementById('businessNumber').focus();
        return false;
    }

    // 운영시간 유효성 검사 (최소 하나의 요일은 운영해야 함)
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let hasOperatingDay = false;
    
    days.forEach(day => {
        const openSelect = document.querySelector(`select[name="${day}Open"]`);
        const closeSelect = document.querySelector(`select[name="${day}Close"]`);
        
        if (openSelect && closeSelect && openSelect.value && closeSelect.value) {
            hasOperatingDay = true;
        }
    });
    
    if (!hasOperatingDay) {
        alert('최소 하나의 요일은 운영시간을 설정해주세요.');
        return false;
    }

    return true;
}

// 텍스트 영역 문자 수 제한
const storeCommentTextarea = document.getElementById('storeComment');
if (storeCommentTextarea) {
    storeCommentTextarea.addEventListener('input', function(e) {
        const maxLength = 500;
        const currentLength = e.target.value.length;
        
        if (currentLength > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
            alert(`매장 설명은 최대 ${maxLength}자까지 입력 가능합니다.`);
        }
    });
}

// 입력 필드 포커스 시 도움말 표시
document.addEventListener('DOMContentLoaded', function() {
    const inputFields = document.querySelectorAll('input, textarea, select');
    
    inputFields.forEach(input => {
        const hint = input.parentNode.querySelector('.field-hint');
        if (hint) {
            input.addEventListener('focus', function() {
                hint.style.color = '#4a90e2';
                hint.style.fontWeight = '500';
            });
            
            input.addEventListener('blur', function() {
                hint.style.color = '#666';
                hint.style.fontWeight = '400';
            });
        }
    });
});

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
        document.querySelectorAll('input[name="facilities"]').forEach(input => {
            input.addEventListener('change', updateFacilitiesPreview);
        });
    }, 100);
});

// 초기 데이터 설정
document.addEventListener('DOMContentLoaded', function() {
    // 초기 문자열 업데이트
    setTimeout(() => {
        updateFacilitiesString();
        updateScheduleString();
    }, 100);
});

console.log('매장 등록 페이지 스크립트가 로드되었습니다.');