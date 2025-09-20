// 상담 모달 및 폼 관련 스크립트
document.addEventListener('DOMContentLoaded', function () {
    const consultBtn = document.getElementById('consultBtn');
    const consultModal = document.getElementById('consultModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const consultForm = document.getElementById('consultForm');

    // 상담 버튼 클릭 시 모달 열기
    consultBtn.addEventListener('click', function () {
        consultModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // 모달 닫기 함수
    function closeModalFunction() {
        consultModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetConsultForm();
    }

    // X 버튼, 취소 버튼, 배경 클릭, ESC로 모달 닫기
    closeModal.addEventListener('click', closeModalFunction);
    cancelBtn.addEventListener('click', closeModalFunction);
    consultModal.addEventListener('click', function (event) {
        if (event.target === consultModal) {
            closeModalFunction();
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && consultModal.style.display === 'block') {
            closeModalFunction();
        }
    });

    // 폼 리셋 함수
    function resetConsultForm() {
        consultForm.reset();
        const inputs = consultForm.querySelectorAll('select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e9ecef';
        });
        const errorMessages = consultForm.querySelectorAll('.consult-error-message');
        errorMessages.forEach(error => error.remove());
    }

    // 폼 유효성 검사
    function validateConsultForm() {
        const consultType = document.getElementById('consultType').value;
        const consultContent = document.getElementById('consultContent').value.trim();
        let isValid = true;

        if (!consultType) {
            showConsultFieldError('consultType', '상담 유형을 선택해주세요.');
            isValid = false;
        } else {
            clearConsultFieldError('consultType');
        }

        if (!consultContent) {
            showConsultFieldError('consultContent', '문의 내용을 입력해주세요.');
            isValid = false;
        } else if (consultContent.length < 10) {
            showConsultFieldError('consultContent', '문의 내용을 10자 이상 입력해주세요.');
            isValid = false;
        } else {
            clearConsultFieldError('consultContent');
        }

        return isValid;
    }

    // 에러 표시 및 제거 함수
    function showConsultFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = '#dc3545';

        const existingError = field.parentNode.querySelector('.consult-error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'consult-error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function clearConsultFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.style.borderColor = '#e9ecef';

        const errorMessage = field.parentNode.querySelector('.consult-error-message');
        if (errorMessage) errorMessage.remove();
    }

    // 폼 제출 시 유효성 검사
    consultForm.addEventListener('submit', function (event) {
        if (!validateConsultForm()) {
            event.preventDefault(); // 유효성 실패 시 전송 막기
        }
    });

    // 버튼 hover 애니메이션
    consultBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    consultBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // 스크롤 시 버튼 투명도 조절
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        consultBtn.style.opacity = (scrollTop > lastScrollTop && scrollTop > 300) ? '0.8' : '1';
        lastScrollTop = scrollTop;
    });
})