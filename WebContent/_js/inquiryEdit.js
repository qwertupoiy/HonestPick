// 리뷰 수정 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeStarRating();
    initializeCharacterCounters();
    initializePhotoUpload();
    initializeExistingPhotoRemoval();
});

// 글자수 카운터 초기화
function initializeCharacterCounters() {
    // 제목 글자수 카운터
    const titleInput = document.querySelector('.review-title');
    const titleCounter = document.querySelector('.current-title-length');
    const maxTitleLength = document.querySelector('.max-title-length');
    
    if (titleInput && titleCounter) {
        // 초기 글자수 설정
        titleCounter.textContent = titleInput.value.length;
        
        titleInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = parseInt(maxTitleLength.textContent);
            
            titleCounter.textContent = currentLength;
            
            // 글자수 제한 시각적 피드백
            if (currentLength > maxLength * 0.9) {
                titleCounter.style.color = '#f44336';
            } else if (currentLength > maxLength * 0.7) {
                titleCounter.style.color = '#ff9800';
            } else {
                titleCounter.style.color = '#ff6b6b';
            }
        });
    }
    
    // 내용 글자수 카운터
    const contentTextarea = document.querySelector('.review-content');
    const contentCounter = document.querySelector('.current-content-length');
    const maxContentLength = document.querySelector('.max-content-length');
    
    if (contentTextarea && contentCounter) {
        // 초기 글자수 설정
        contentCounter.textContent = contentTextarea.value.length;
        
        contentTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = parseInt(maxContentLength.textContent);
            
            contentCounter.textContent = currentLength;
            
            // 글자수 제한 시각적 피드백
            if (currentLength > maxLength * 0.9) {
                contentCounter.style.color = '#f44336';
            } else if (currentLength > maxLength * 0.7) {
                contentCounter.style.color = '#ff9800';
            } else {
                contentCounter.style.color = '#ff6b6b';
            }
        });
    }
}

// 폼 제출 전 유효성 검사
document.querySelector('.review-form').addEventListener('submit', function(e) {
    // 폼 유효성 검사
    function validateConsultForm() {
        const consultType = document.getElementById('consultType').value;
        const consultContent = document.getElementById('consultContent').value.trim();
        let isValid = true;

	    if (!consultType) {
	        alert('상담 유형을 선택해주세요.');
	        isValid = false;
	    }
	
	    if (!consultContent) {
	        alert('문의 내용을 입력해주세요.');
	        isValid = false;
	    } else if (consultContent.length < 10) {
	        alert('문의 내용을 10자 이상 입력해주세요.');
	        isValid = false;
	    }
	
	    if (!isValid) {
	        e.preventDefault(); // 유효성 실패 시 제출 막기
	        return;
	    }
	}
    
    // 로딩 상태 표시
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 수정 중...';
});

// 페이지 언로드 시 경고 (내용이 변경되었을 때만)
let formChanged = false;
const formInputs = document.querySelectorAll('.review-form input, .review-form textarea');

formInputs.forEach(input => {
    const initialValue = input.value;
    input.addEventListener('input', function() {
        if (this.value !== initialValue) {
            formChanged = true;
        }
    });
});

window.addEventListener('beforeunload', function(e) {
    if (formChanged) {
        e.preventDefault();
        e.returnValue = '변경사항이 저장되지 않을 수 있습니다. 정말 페이지를 떠나시겠습니까?';
    }
});

// 폼 제출 시 경고 해제
document.querySelector('.review-form').addEventListener('submit', function() {
    formChanged = false;
});