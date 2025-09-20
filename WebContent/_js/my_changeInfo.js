/**
 * 마이페이지 - 회원정보 수정 관련 자바스크립트
 */

document.addEventListener('DOMContentLoaded', function() {
    // 프로필 이미지 미리보기
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        profileImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profileImagePreview').src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // 닉네임 중복 확인
    const checkNicknameBtn = document.getElementById('checkNickname');
    if (checkNicknameBtn) {
        checkNicknameBtn.addEventListener('click', function() {
            const nickname = document.getElementById('nickname').value;
            const validationMsg = document.getElementById('nicknameValidation');
            
            if (nickname.trim() === '') {
                validationMsg.textContent = '닉네임을 입력해주세요.';
                validationMsg.className = 'validation-message error';
                return;
            }
            
            // 여기서는 시뮬레이션만 합니다 (실제로는 서버에 요청해야 함)
            if (nickname === '맛집탐험가') {
                validationMsg.textContent = '현재 사용 중인 닉네임입니다.';
                validationMsg.className = 'validation-message success';
            } else if (nickname === '맛집왕') {
                validationMsg.textContent = '이미 사용 중인 닉네임입니다.';
                validationMsg.className = 'validation-message error';
            } else {
                validationMsg.textContent = '사용 가능한 닉네임입니다.';
                validationMsg.className = 'validation-message success';
            }
        });
    }

    // 비밀번호 확인
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = this.value;
            const validationMsg = document.getElementById('passwordValidation');
            
            if (newPassword === confirmPassword) {
                validationMsg.textContent = '비밀번호가 일치합니다.';
                validationMsg.className = 'validation-message success';
            } else {
                validationMsg.textContent = '비밀번호가 일치하지 않습니다.';
                validationMsg.className = 'validation-message error';
            }
        });
    }

    // 주소 검색 (Daum 우편번호 API 사용)
    const searchAddressBtn = document.getElementById('searchAddress');
    if (searchAddressBtn) {
        searchAddressBtn.addEventListener('click', function() {
            new daum.Postcode({
                oncomplete: function(data) {
                    // 우편번호와 주소 정보를 해당 필드에 입력
                    document.getElementById('postalCode').value = data.zonecode;
                    document.getElementById('address').value = data.address;
                    
                    // 참고항목 문자열 생성
                    let extraAddr = '';
                    
                    if(data.addressType === 'R'){
                        if(data.bname !== ''){
                            extraAddr += data.bname;
                        }
                        if(data.buildingName !== ''){
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        if(extraAddr !== ''){
                            extraAddr = ' (' + extraAddr + ')';
                        }
                    }
                    
                    document.getElementById('additionalInfo').value = extraAddr;
                    
                    // 상세주소 입력란에 포커스
                    document.getElementById('streetAddress').focus();
                },
                onclose: function(state) {
                    // 사용자가 팝업을 닫았을 때 처리할 내용 (필요시)
                    if(state === 'FORCE_CLOSE'){
                        console.log('사용자가 우편번호 팝업을 강제로 닫았습니다.');
                    } else if(state === 'COMPLETE_CLOSE'){
                        console.log('사용자가 검색결과를 선택하여 우편번호 팝업이 닫혔습니다.');
                    }
                },
                // 팝업 크기 지정 (선택사항)
                width: '100%',
                height: '100%'
            }).open();
        });
    }

    // 폼 제출
    const userInfoForm = document.getElementById('userInfoForm');

	if (userInfoForm) {
	    userInfoForm.addEventListener('submit', function(e) {
	        e.preventDefault(); // 폼 기본 제출 막고 아래에서 조건 맞을 때 수동 제출

	        // 간단한 유효성 검사
	        const confirmIdentity = document.getElementById('confirmIdentity').checked;
	        if (!confirmIdentity) {
	            alert('본인인증을 위해 개인정보 수집 및 이용에 동의해주세요.');
	            return;
	        }

	        const password = document.getElementById('newPassword').value;
	        const confirmPassword = document.getElementById('confirmPassword').value;

	        if (password && password !== confirmPassword) {
	            alert('비밀번호가 일치하지 않습니다.');
	            return;
	        }

	        userInfoForm.submit(); // 조건 다 통과하면 수동 제출
	    });
	}
});