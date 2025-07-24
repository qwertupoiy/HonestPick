// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 폼 요소들
    const form = document.getElementById('menu-add-form');
    const menuNameInput = document.getElementById('menuName');
    const menuPriceInput = document.getElementById('menuPrice');
    const menuDescriptionInput = document.getElementById('menuDescription');
    const menuImageInput = document.getElementById('menuImage');
    const imagePreview = document.getElementById('menuImagePreview');
    const imageUploadBtn = document.getElementById('image-upload-btn');
    const imageRemoveBtn = document.getElementById('image-remove-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const addBtn = document.getElementById('add-btn');

    // 이미지 업로드 관련 변수
    let hasCustomImage = false;

    // 이벤트 리스너 등록
    initializeEventListeners();

    /**
     * 이벤트 리스너 초기화
     */
    function initializeEventListeners() {
        // 이미지 업로드 버튼 클릭
        imageUploadBtn.addEventListener('click', function() {
            menuImageInput.click();
        });

        // 이미지 파일 선택
        menuImageInput.addEventListener('change', handleImageSelect);

        // 이미지 삭제 버튼 클릭
        imageRemoveBtn.addEventListener('click', handleImageRemove);

        // 가격 입력 포맷팅
        menuPriceInput.addEventListener('input', formatPriceInput);
        menuPriceInput.addEventListener('blur', validatePrice);

        // 메뉴명 유효성 검사
        menuNameInput.addEventListener('blur', validateMenuName);

        // 설명 유효성 검사
        menuDescriptionInput.addEventListener('blur', validateDescription);

        // 취소 버튼 클릭
        cancelBtn.addEventListener('click', handleCancel);

        // 폼 제출
        form.addEventListener('submit', handleFormSubmit);

        // 실시간 입력 유효성 검사
        menuNameInput.addEventListener('input', clearError);
        menuPriceInput.addEventListener('input', clearError);
        menuDescriptionInput.addEventListener('input', clearError);
    }

    /**
     * 이미지 선택 처리
     */
    function handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 파일 형식 검사
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showError(menuImageInput, '이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF)');
            event.target.value = '';
            return;
        }

        // 파일 크기 검사 (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showError(menuImageInput, '파일 크기는 5MB 이하여야 합니다.');
            event.target.value = '';
            return;
        }

        // 이미지 미리보기
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.parentElement.classList.add('has-image');
            hasCustomImage = true;
            clearError(menuImageInput);
        };
        reader.readAsDataURL(file);
    }

    /**
     * 이미지 삭제 처리
     */
    function handleImageRemove() {
        imagePreview.src = '../_images/default-menu.png';
        imagePreview.parentElement.classList.remove('has-image');
        menuImageInput.value = '';
        hasCustomImage = false;
    }

    /**
     * 가격 입력 포맷팅
     */
    function formatPriceInput(event) {
        let value = event.target.value;
        
        // 숫자가 아닌 문자 제거
        value = value.replace(/[^0-9]/g, '');
        
        // 최대 자리수 제한 (1,000,000원)
        if (value.length > 7) {
            value = value.substring(0, 7);
        }
        
        event.target.value = value;
    }

    /**
     * 메뉴명 유효성 검사
     */
    function validateMenuName() {
        const value = menuNameInput.value.trim();
        
        if (!value) {
            showError(menuNameInput, '메뉴명을 입력해주세요.');
            return false;
        }
        
        if (value.length < 2) {
            showError(menuNameInput, '메뉴명은 2글자 이상 입력해주세요.');
            return false;
        }
        
        if (value.length > 50) {
            showError(menuNameInput, '메뉴명은 50글자 이하로 입력해주세요.');
            return false;
        }
        
        showSuccess(menuNameInput);
        return true;
    }

    /**
     * 가격 유효성 검사
     */
    function validatePrice() {
        const value = parseInt(menuPriceInput.value);
        
        if (!value || value <= 0) {
            showError(menuPriceInput, '올바른 가격을 입력해주세요.');
            return false;
        }
        
        if (value > 1000000) {
            showError(menuPriceInput, '가격은 1,000,000원 이하로 입력해주세요.');
            return false;
        }
        
        showSuccess(menuPriceInput);
        return true;
    }

    /**
     * 설명 유효성 검사
     */
    function validateDescription() {
        const value = menuDescriptionInput.value.trim();
        
        if (!value) {
            showError(menuDescriptionInput, '메뉴 설명을 입력해주세요.');
            return false;
        }
        
        if (value.length < 10) {
            showError(menuDescriptionInput, '메뉴 설명은 10글자 이상 입력해주세요.');
            return false;
        }
        
        if (value.length > 1000) {
            showError(menuDescriptionInput, '메뉴 설명은 1000글자 이하로 입력해주세요.');
            return false;
        }
        
        showSuccess(menuDescriptionInput);
        return true;
    }

    /**
     * 이미지 유효성 검사
     */
    function validateImage() {
        if (!hasCustomImage && !menuImageInput.files[0]) {
            showError(menuImageInput, '메뉴 이미지를 선택해주세요.');
            return false;
        }
        
        clearError(menuImageInput);
        return true;
    }

    /**
     * 에러 표시
     */
    function showError(element, message) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) return;
        
        // 기존 에러 메시지 제거
        clearError(element);
        
        // 에러 스타일 추가
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        
        // 에러 메시지 추가
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(errorDiv);
    }

    /**
     * 성공 표시
     */
    function showSuccess(element) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) return;
        
        clearError(element);
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
    }

    /**
     * 에러 제거
     */
    function clearError(element) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error', 'success');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * 취소 버튼 처리
     */
    function handleCancel() {
        if (confirm('메뉴 등록을 취소하시겠습니까? 입력한 내용이 모두 사라집니다.')) {
            // 이전 페이지로 이동하거나 매장 관리 페이지로 이동
            window.history.back();
        }
    }

    /**
     * 폼 제출 처리
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // 모든 유효성 검사 실행
        const isMenuNameValid = validateMenuName();
        const isPriceValid = validatePrice();
        const isDescriptionValid = validateDescription();
        const isImageValid = validateImage();
        
        // 모든 검사가 통과하지 않으면 제출 중단
        if (!isMenuNameValid || !isPriceValid || !isDescriptionValid || !isImageValid) {
            showNotification('입력 내용을 확인해주세요.', 'error');
            return;
        }
        
        // 제출 확인
        if (!confirm('메뉴를 등록하시겠습니까?')) {
            return;
        }
        
        // 로딩 상태 표시
        addBtn.disabled = true;
        addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 등록 중...';
        
        // 폼 제출
        form.submit();
    }

    /**
     * 알림 메시지 표시
     */
    function showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 새 알림 생성
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 알림 스타일
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background-color: ${getNotificationColor(type)};
        `;
        
        document.body.appendChild(notification);
        
        // 애니메이션으로 표시
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    /**
     * 알림 아이콘 반환
     */
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    /**
     * 알림 색상 반환
     */
    function getNotificationColor(type) {
        switch (type) {
            case 'success': return '#28a745';
            case 'error': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#17a2b8';
        }
    }
});