// 리뷰 수정 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeStarRating();
    initializeCharacterCounters();
    initializePhotoUpload();
    initializeExistingPhotoRemoval();
});

// 별점 평가 초기화
function initializeStarRating() {
    const starButtons = document.querySelectorAll('.star-btn');
    const ratingValue = document.getElementById('rating-value');
    const ratingText = document.querySelector('.rating-text');
    
    // 기존 별점으로 초기화
    const currentRating = parseInt(ratingValue.value) || 0;
    updateStarDisplay(currentRating);
    
    starButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            updateStarDisplay(rating);
            ratingValue.value = rating;
            
            // 별점 텍스트 업데이트
            const ratingTexts = {
                1: '별로예요 😞',
                2: '그저 그래요 😐',
                3: '보통이에요 🙂',
                4: '좋아요 😊',
                5: '최고예요! 😍'
            };
            ratingText.textContent = `${rating}점 - ${ratingTexts[rating]}`;
            ratingText.classList.add('selected');
        });
        
        // 호버 효과
        button.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    // 별점 영역에서 마우스가 나갔을 때 원래 별점으로 복구
    const starRating = document.querySelector('.star-rating');
    starRating.addEventListener('mouseleave', function() {
        const currentRating = parseInt(ratingValue.value) || 0;
        updateStarDisplay(currentRating);
    });
}

// 별점 표시 업데이트
function updateStarDisplay(rating) {
    const starButtons = document.querySelectorAll('.star-btn');
    starButtons.forEach((button, index) => {
        if (index < rating) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 별점 하이라이트 (호버 시)
function highlightStars(rating) {
    const starButtons = document.querySelectorAll('.star-btn');
    starButtons.forEach((button, index) => {
        if (index < rating) {
            button.style.color = '#ffb100';
            button.style.transform = 'scale(1.1)';
        } else {
            button.style.color = '#ddd';
            button.style.transform = 'scale(1)';
        }
    });
}

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

// 새 사진 업로드 초기화
function initializePhotoUpload() {
    const uploadBtn = document.querySelector('.upload-btn');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    
    if (uploadBtn && photoInput) {
        uploadBtn.addEventListener('click', function() {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            // 파일 개수 제한 확인
            if (files.length > 5) {
                alert('최대 5장까지만 업로드할 수 있습니다.');
                this.value = '';
                return;
            }
            
            // 기존 미리보기 제거
            photoPreview.innerHTML = '';
            
            files.forEach((file, index) => {
                // 파일 크기 확인 (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name}은(는) 5MB를 초과합니다.`);
                    return;
                }
                
                // 파일 형식 확인
                if (!file.type.startsWith('image/')) {
                    alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
                    return;
                }
                
                // 미리보기 생성
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoItem = createPhotoPreviewItem(e.target.result, index);
                    photoPreview.appendChild(photoItem);
                };
                reader.readAsDataURL(file);
            });
            
            // 업로드 버튼 텍스트 업데이트
            updateUploadButtonText(files.length);
        });
    }
}

// 사진 미리보기 아이템 생성
function createPhotoPreviewItem(src, index) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.innerHTML = `
        <img src="${src}" alt="새 리뷰 이미지 ${index + 1}">
        <button type="button" class="remove-photo" onclick="removeNewPhoto(${index})">
            <i class="fas fa-times"></i>
        </button>
    `;
    return photoItem;
}

// 새 사진 제거
function removeNewPhoto(index) {
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    
    // DataTransfer를 사용하여 파일 목록에서 해당 파일 제거
    const dt = new DataTransfer();
    const files = Array.from(photoInput.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    photoInput.files = dt.files;
    
    // 미리보기 다시 생성
    photoPreview.innerHTML = '';
    Array.from(photoInput.files).forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoItem = createPhotoPreviewItem(e.target.result, i);
            photoPreview.appendChild(photoItem);
        };
        reader.readAsDataURL(file);
    });
    
    // 업로드 버튼 텍스트 업데이트
    updateUploadButtonText(photoInput.files.length);
}

// 업로드 버튼 텍스트 업데이트
function updateUploadButtonText(fileCount) {
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        if (fileCount === 0) {
            uploadBtn.innerHTML = '<i class="fas fa-camera"></i> 새 사진 추가 (최대 5장)';
        } else {
            uploadBtn.innerHTML = `<i class="fas fa-camera"></i> 새 사진 ${fileCount}장 선택됨`;
        }
    }
}

// 기존 사진 제거 초기화
function initializeExistingPhotoRemoval() {
    window.removeExistingPhoto = function() {
        const existingPhotoContainer = document.querySelector('.existing-photo');
        const existingImageInput = document.querySelector('input[name="ExistingImage"]');
        
        if (confirm('기존 사진을 제거하시겠습니까?')) {
            existingPhotoContainer.style.display = 'none';
            existingImageInput.value = ''; // 기존 이미지 정보 제거
            
            // 폼 그룹 자체를 숨김
            const formGroup = existingPhotoContainer.closest('.form-group');
            if (formGroup) {
                formGroup.style.display = 'none';
            }
        }
    };
}

// 리뷰 삭제 확인
function confirmDelete() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 삭제 모달 닫기
function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 리뷰 삭제 실행 (MemberNo 추가)
function deleteReview() {
    const reviewNo = document.querySelector('input[name="ReviewNo"]').value;
    const storeNo = document.querySelector('input[name="StoreNo"]').value;
    const memberNo = document.querySelector('input[name="MemberNo"]').value;
    
    // 삭제 요청 - MemberNo 파라미터 추가
    window.location.href = `../Admin_servlet/reviewRemove.do?ReviewNo=${reviewNo}&StoreNo=${storeNo}&MemberNo=${memberNo}`;
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const modal = document.getElementById('delete-modal');
    if (e.target === modal) {
        closeDeleteModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
});

// 폼 제출 전 유효성 검사
document.querySelector('.review-form').addEventListener('submit', function(e) {
    const rating = document.getElementById('rating-value').value;
    const title = document.querySelector('.review-title').value.trim();
    const content = document.querySelector('.review-content').value.trim();
    
    // 별점 확인
    if (!rating || rating < 1 || rating > 5) {
        e.preventDefault();
        alert('별점을 선택해주세요.');
        return;
    }
    
    // 제목 확인
    if (!title) {
        e.preventDefault();
        alert('리뷰 제목을 입력해주세요.');
        document.querySelector('.review-title').focus();
        return;
    }
    
    // 내용 확인
    if (!content) {
        e.preventDefault();
        alert('리뷰 내용을 입력해주세요.');
        document.querySelector('.review-content').focus();
        return;
    }
    
    // 제출 확인
    if (!confirm('리뷰를 수정하시겠습니까?')) {
        e.preventDefault();
        return;
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