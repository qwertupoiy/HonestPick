document.addEventListener('DOMContentLoaded', function() {
    // 프로필 이미지 미리보기 기능
    const profileInput = document.getElementById('profileImage');
    const profilePreview = document.getElementById('profilePreview');
    const profileRemoveBtn = document.querySelector('.profile-remove-btn');
    const defaultProfileImg = '../_images/default-profile.png';
    
    // 프로필 이미지 선택 시 미리보기
    profileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 프로필 이미지 삭제 버튼
    profileRemoveBtn.addEventListener('click', function() {
        profileInput.value = '';
        profilePreview.src = defaultProfileImg;
    });
    
    // 전화번호 자동 하이픈 기능
    const phoneInput = document.getElementById('userPhone');
    
    function formatPhoneNumber(value) {
        // 숫자만 추출
        const phoneNumber = value.replace(/[^\d]/g, '');
        const length = phoneNumber.length;
        
        if (length < 4) {
            return phoneNumber;
        } else if (length < 8) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        } else if (length < 12) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
        } else {
            // 최대 11자리까지만 허용 (010-1234-5678)
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
        }
    }
    
    // 전화번호 입력 시 실시간 포맷팅
    phoneInput.addEventListener('input', function(e) {
        const cursorPosition = this.selectionStart;
        const oldValue = this.value;
        const newValue = formatPhoneNumber(this.value);
        
        this.value = newValue;
        
        // 커서 위치 조정 (하이픈이 자동 삽입될 때 커서가 올바른 위치에 있도록)
        if (newValue.length > oldValue.length && newValue[cursorPosition] === '-') {
            this.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        } else {
            this.setSelectionRange(cursorPosition, cursorPosition);
        }
    });
    
    // 전화번호 필드에서 숫자와 하이픈만 허용
    phoneInput.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 46) {
            e.preventDefault();
        }
    });
    
    // 전화번호 붙여넣기 시에도 포맷팅 적용
    phoneInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            this.value = formatPhoneNumber(this.value);
        }, 0);
    });
    
    // Daum 우편번호 검색 API
    const addressSearchBtn = document.querySelector('.address-search-btn');
    
    addressSearchBtn.addEventListener('click', function() {
        new daum.Postcode({
            oncomplete: function(data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                let addr = ''; // 주소 변수
                let extraAddr = ''; // 참고항목 변수

                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if (data.userSelectedType === 'R') {
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if (data.buildingName !== '' && data.apartment === 'Y') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if (extraAddr !== '') {
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    document.getElementById("extraAddress").value = extraAddr;
                } else {
                    document.getElementById("extraAddress").value = '';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById('postcode').value = data.zonecode;
                document.getElementById("address").value = addr;
                // 커서를 상세주소 필드로 이동한다.
                document.getElementById("detailAddress").focus();
            }
        }).open();
    });
    
    // 모든 약관 동의 체크박스 기능
    const agreeAllCheckbox = document.getElementById('agreeAll');
    const termsCheckboxes = document.querySelectorAll('.terms-content input[type="checkbox"]:not(#agreeAll)');
    
    // 전체 동의 체크박스 이벤트
    agreeAllCheckbox.addEventListener('change', function() {
        termsCheckboxes.forEach(checkbox => {
            checkbox.checked = agreeAllCheckbox.checked;
        });
    });
    
    // 개별 체크박스들의 상태가 변경될 때 전체 동의 체크박스 상태 업데이트
    termsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(termsCheckboxes).every(checkbox => checkbox.checked);
            agreeAllCheckbox.checked = allChecked;
        });
    });
    
    // 약관 보기 버튼 클릭 이벤트
    const termsViewButtons = document.querySelectorAll('.terms-view-btn');
    
    termsViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 약관 내용을 보여주는 모달 표시 코드
            const termsLabel = this.previousElementSibling.textContent;
            alert(`${termsLabel} 약관 내용이 모달로 표시됩니다.`);
        });
    });
    
    // ID 중복 확인 버튼 클릭 이벤트
    const idCheckBtn = document.querySelector('.id-check-btn');

	idCheckBtn.addEventListener('click', function () {
	    const userId = document.getElementById('userId').value.trim();
	
	    if (userId === '') {
	        alert('아이디를 입력해주세요.');
	        return;
	    }
	
	    // 유효성 검사: 6~20자 영문+숫자
	    const userIdRegex = /^[a-zA-Z0-9]{6,20}$/;
	    if (!userIdRegex.test(userId)) {
	        alert('아이디는 영문, 숫자 조합 6~20자여야 합니다.');
	        return;
	    }
	
	    fetch(`${window.path}/Member_servlet/idCheck.do?userId=${encodeURIComponent(userId)}`)
	        .then(response => response.json())
	        .then(data => {
	            if (data.available) {
	                alert('사용 가능한 아이디입니다.');
	            } else {
	                alert('이미 사용 중인 아이디입니다.');
	            }
	        })
	        .catch(error => {
	            console.error('중복 확인 실패:', error);
	            alert('서버 오류로 중복 확인에 실패했습니다.');
	    });
	});
    
    // 닉네임 중복 확인 버튼 클릭 이벤트
    const nicknameCheckBtn = document.querySelector('.nickname-check-btn');
    
    nicknameCheckBtn.addEventListener('click', function() {
        const userNickname = document.getElementById('userNickname').value;
        
        if (userNickname.trim() === '') {
            alert('닉네임을 입력해주세요.');
            return;
        }
        
        fetch(`${window.path}/Member_servlet/nickCheck.do?userNick=${encodeURIComponent(userNickname)}`)
	        .then(response => response.json())
	        .then(data => {
	            if (data.available) {
	                alert('사용 가능한 닉네임입니다.');
	            } else {
	                alert('이미 사용 중인 닉네임입니다.');
	            }
	        })
	        .catch(error => {
	            console.error('중복 확인 실패:', error);
	            alert('서버 오류로 중복 확인에 실패했습니다.');
	    });
    });
    
    // 전화번호 유효성 검사 함수
    function validatePhoneNumber(phoneNumber) {
        // 하이픈 제거 후 숫자만 체크
        const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
        
        // 한국 휴대폰 번호 패턴 (010, 011, 016, 017, 018, 019)
        const mobilePattern = /^01[0-9]\d{8}$/;
        // 일반 전화번호 패턴 (지역번호 포함)
        const landlinePattern = /^(02|0[3-9]\d)\d{7,8}$/;
        
        return mobilePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
    }
    
    // 폼 제출 이벤트
    const joinForm = document.getElementById('joinForm');
    
    joinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 필수 약관 동의 확인
        const requiredTerms = document.querySelectorAll('.terms-content input[required]');
        let requiredChecked = true;
        
        requiredTerms.forEach(term => {
            if (!term.checked) {
                requiredChecked = false;
            }
        });
        
        if (!requiredChecked) {
            alert('필수 약관에 모두 동의해주세요.');
            return;
        }
        
        // 비밀번호 확인
        const userPw = document.getElementById('userPw').value;
        const userPwConfirm = document.getElementById('userPwConfirm').value;
        
        if (userPw !== userPwConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // ID 유효성 검사 (영문, 숫자 조합 6-20자)
        const userId = document.getElementById('userId').value;
        const userIdRegex = /^[a-zA-Z0-9]{6,20}$/;
        
        if (!userIdRegex.test(userId)) {
            alert('아이디는 영문, 숫자 조합 6-20자로 입력해주세요.');
            return;
        }
        
        // 비밀번호 유효성 검사 (영문, 숫자, 특수문자 조합 8-20자)
        const userPwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
        
        if (!userPwRegex.test(userPw)) {
            alert('비밀번호는 영문, 숫자, 특수문자 조합 8-20자로 입력해주세요.');
            return;
        }
        
        // 닉네임 유효성 검사 (2-10자)
        const userNickname = document.getElementById('userNickname').value;
        if (userNickname.length < 2 || userNickname.length > 10) {
            alert('닉네임은 2-10자 이내로 입력해주세요.');
            return;
        }
        
        // 전화번호 유효성 검사
        const userPhone = document.getElementById('userPhone').value;
        if (userPhone.trim() === '') {
            alert('전화번호를 입력해주세요.');
            return;
        }
        
        if (!validatePhoneNumber(userPhone)) {
            alert('올바른 전화번호 형식으로 입력해주세요.');
            return;
        }
        
        // 주소 필수 입력 확인
        const postcode = document.getElementById('postcode').value;
        const address = document.getElementById('address').value;
        
        if (postcode.trim() === '' || address.trim() === '') {
            alert('주소를 입력해주세요.');
            return;
        }
        
        // 폼 제출
        console.log('회원가입 정보가 제출되었습니다.');
        this.submit();
    });
});