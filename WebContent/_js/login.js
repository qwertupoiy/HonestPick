// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 폼 요소들 가져오기
    const loginForm = document.getElementById('login-form');
    const memberIdInput = document.getElementById('MemberId');
    const passwordInput = document.getElementById('MemberPwd');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const idError = document.getElementById('id-error');
    const passwordError = document.getElementById('password-error');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const rememberMeHidden = document.getElementById('rememberMeValue');

    // 비밀번호 표시/숨김 기능
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            // 아이콘 변경
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }

    // 아이디 유효성 검사
    function validateMemberId(memberId) {
        const idPattern = /^[a-zA-Z0-9_]{4,20}$/;
        return idPattern.test(memberId);
    }

    // 비밀번호 유효성 검사
    function validatePassword(password) {
        return password.length >= 6;
    }

    // 에러 메시지 표시 함수
    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // 에러 메시지 숨김 함수
    function hideError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // 자동로그인 체크박스 값 설정 함수
    function setRememberMeValue() {
        if (rememberMeCheckbox && rememberMeHidden) {
            rememberMeHidden.value = rememberMeCheckbox.checked ? 'Y' : 'N';
            console.log('rememberMeValue 설정:', rememberMeHidden.value);
        }
    }

    // 로그인 폼 제출 처리
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const memberId = memberIdInput.value.trim();
            const password = passwordInput.value;
            let isValid = true;

            // 아이디 검증
            if (!memberId) {
                e.preventDefault();
                showError(idError, '아이디를 입력해주세요.');
                isValid = false;
            } else if (!validateMemberId(memberId)) {
                e.preventDefault();
                showError(idError, '아이디는 4~20자의 영문, 숫자, 언더스코어만 가능합니다.');
                isValid = false;
            } else {
                hideError(idError);
            }

            // 비밀번호 검증
            if (!password) {
                e.preventDefault();
                showError(passwordError, '비밀번호를 입력해주세요.');
                isValid = false;
            } else if (!validatePassword(password)) {
                e.preventDefault();
                showError(passwordError, '비밀번호는 최소 6자리 이상이어야 합니다.');
                isValid = false;
            } else {
                hideError(passwordError);
            }

            // 유효성 검사 통과 시 처리
            if (isValid) {
                // 폼 제출 전 히든 필드 값 강제 설정
                if (rememberMeCheckbox && rememberMeHidden) {
                    const checkboxValue = rememberMeCheckbox.checked ? 'Y' : 'N';
                    rememberMeHidden.value = checkboxValue;
                    console.log('폼 제출 시 체크박스 상태:', rememberMeCheckbox.checked);
                    console.log('폼 제출 시 히든 필드 값:', rememberMeHidden.value);
                }
                
                // 자동로그인 체크 상태에 따른 localStorage 처리
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedMemberId', memberId);
                    localStorage.setItem('autoLoginEnabled', 'true');
                } else {
                    localStorage.removeItem('rememberedMemberId');
                    localStorage.removeItem('autoLoginEnabled');
                }
                
                // 폼이 자연스럽게 서버로 제출됨 (preventDefault 호출하지 않음)
            }
        });
    }

    // 기억된 아이디 불러오기
    function loadRememberedMemberId() {
        const rememberedMemberId = localStorage.getItem('rememberedMemberId');
        const autoLoginEnabled = localStorage.getItem('autoLoginEnabled');
        
        if (rememberedMemberId && memberIdInput && rememberMeCheckbox) {
            memberIdInput.value = rememberedMemberId;
            
            // 자동로그인이 활성화되어 있었다면 체크박스도 체크
            if (autoLoginEnabled === 'true') {
                rememberMeCheckbox.checked = true;
                // 히든 필드 값도 설정
                setRememberMeValue();
            }
        }
    }

    // 체크박스 상태 변경 시 처리
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', function() {
            // 히든 필드 값 즉시 업데이트
            const checkboxValue = this.checked ? 'Y' : 'N';
            if (rememberMeHidden) {
                rememberMeHidden.value = checkboxValue;
            }
            console.log('체크박스 변경 - 체크 상태:', this.checked, '히든 필드 값:', checkboxValue);
            
            // 체크 해제 시 localStorage에서 자동로그인 정보 제거
            if (!this.checked) {
                localStorage.removeItem('rememberedMemberId');
                localStorage.removeItem('autoLoginEnabled');
            }
        });
    }

    // 페이지 로드 시 기억된 아이디 불러오기
    loadRememberedMemberId();

    // 디버깅: 페이지 로드 시 모든 요소 상태 확인
    console.log('=== 페이지 로드 시 상태 확인 ===');
    console.log('체크박스 요소:', rememberMeCheckbox);
    console.log('히든 필드 요소:', rememberMeHidden);
    if (rememberMeCheckbox) console.log('체크박스 초기 상태:', rememberMeCheckbox.checked);
    if (rememberMeHidden) console.log('히든 필드 초기 값:', rememberMeHidden.value);
    
    // 폼 제출 직전에 모든 폼 데이터 확인
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            console.log('=== 폼 제출 직전 모든 데이터 확인 ===');
            const formData = new FormData(loginForm);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
        });
    }

    console.log('로그인 페이지 JavaScript 초기화 완료');
});