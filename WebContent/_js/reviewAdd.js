/**
 * 리뷰 작성 페이지 JavaScript
 */

class ReviewWrite {
    constructor() {
        this.currentRating = 0;
        this.selectedPhotos = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            // 핵심 기능들 초기화
            this.initStarRating();
            this.initPhotoUpload();
            this.initCharCounters();
            this.initForm();
            this.initDragAndDrop();
            
            this.isInitialized = true;
            console.log('ReviewWrite 초기화 완료');
        } catch (error) {
            console.error('ReviewWrite 초기화 실패:', error);
        }
    }

    /**
     * 별점 선택 초기화
     */
    initStarRating() {
        const starBtns = document.querySelectorAll('.star-btn');
        const ratingText = document.querySelector('.rating-text');
        const ratingValue = document.getElementById('rating-value');

        console.log('별점 초기화:', {
            starBtns: starBtns.length,
            ratingText: !!ratingText,
            ratingValue: !!ratingValue
        });

        starBtns.forEach((star, index) => {
            // 클릭 이벤트
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const rating = index + 1;
                this.currentRating = rating;
                
                // hidden input에 값 저장
                if (ratingValue) {
                    ratingValue.value = rating;
                    console.log('별점 설정:', rating);
                }
                
                this.updateStarDisplay(rating);
                this.updateRatingText(rating);
            };

            // 마우스 호버 이벤트
            const mouseEnterHandler = () => {
                this.updateStarDisplay(index + 1, true);
                this.updateRatingText(index + 1, true);
            };

            // 이벤트 리스너 등록
            star.addEventListener('click', clickHandler);
            star.addEventListener('mouseenter', mouseEnterHandler);
            star.addEventListener('touchend', clickHandler);
        });

        // 마우스가 별점 영역을 벗어날 때
        const starRating = document.querySelector('.star-rating');
        if (starRating) {
            starRating.addEventListener('mouseleave', () => {
                this.updateStarDisplay(this.currentRating);
                this.updateRatingText(this.currentRating);
            });
        }
    }

    /**
     * 별점 표시 업데이트
     */
    updateStarDisplay(rating, isHover = false) {
        const starBtns = document.querySelectorAll('.star-btn');
        
        starBtns.forEach((star, index) => {
            const starIcon = star.querySelector('i');
            
            if (index < rating) {
                star.classList.add('active');
                if (starIcon) {
                    starIcon.style.color = 'var(--warning-color)';
                }
            } else {
                star.classList.remove('active');
                if (starIcon) {
                    starIcon.style.color = 'var(--border-color)';
                }
            }
            
            // 호버 효과
            if (isHover && index < rating) {
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.transform = index < this.currentRating ? 'scale(1.05)' : 'scale(1)';
            }
        });
    }

    /**
     * 별점 텍스트 업데이트
     */
    updateRatingText(rating, isHover = false) {
        const ratingText = document.querySelector('.rating-text');
        if (!ratingText) return;

        const ratingTexts = [
            '별점을 선택해주세요',
            '별로예요 (1점)',
            '그저 그래요 (2점)',
            '괜찮아요 (3점)',
            '좋아요 (4점)',
            '최고예요! (5점)'
        ];

        const displayRating = isHover ? rating : this.currentRating;
        ratingText.textContent = ratingTexts[displayRating] || ratingTexts[0];
        
        if (displayRating > 0) {
            ratingText.style.color = 'var(--primary-color)';
            ratingText.style.fontWeight = '600';
        } else {
            ratingText.style.color = 'var(--text-secondary)';
            ratingText.style.fontWeight = '400';
        }
    }

    /**
     * 글자수 카운터 초기화
     */
    initCharCounters() {
        // 제목 카운터
        this.initSingleCounter('.review-title', '.title-counter .current-title-length', 100);
        
        // 내용 카운터
        this.initSingleCounter('.review-content', '.content-counter .current-content-length', 500);
    }

    /**
     * 단일 텍스트 입력 필드 카운터 초기화
     */
    initSingleCounter(inputSelector, counterSelector, maxLength) {
        const inputElement = document.querySelector(inputSelector);
        const counterElement = document.querySelector(counterSelector);
        
        if (!inputElement || !counterElement) return;

        const updateCounter = () => {
            const currentLength = inputElement.value.length;
            counterElement.textContent = currentLength;
            
            // 글자수에 따른 색상 변경
            const percentage = (currentLength / maxLength) * 100;
            const counter = counterElement.closest('.char-counter');
            
            if (percentage >= 90) {
                counter.style.color = 'var(--error-color)';
            } else if (percentage >= 75) {
                counter.style.color = 'var(--warning-color)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }

            // 최대 글자수 초과 방지
            if (currentLength > maxLength) {
                inputElement.value = inputElement.value.substring(0, maxLength);
                counterElement.textContent = maxLength;
                counter.style.color = 'var(--error-color)';
            }
        };

        // 이벤트 등록
        inputElement.addEventListener('input', updateCounter);
        inputElement.addEventListener('paste', () => {
            setTimeout(updateCounter, 10);
        });

        // 초기 카운터 설정
        updateCounter();

        // 포커스/블러 효과
        inputElement.addEventListener('focus', () => {
            inputElement.style.borderColor = 'var(--primary-color)';
            inputElement.style.boxShadow = '0 0 0 2px var(--primary-light)';
        });

        inputElement.addEventListener('blur', () => {
            inputElement.style.borderColor = 'var(--border-color)';
            inputElement.style.boxShadow = 'none';
        });
    }

    /**
     * 사진 업로드 초기화
     */
    initPhotoUpload() {
        const uploadBtn = document.querySelector('.upload-btn');
        const uploadZone = document.querySelector('.upload-zone');
        const photoInput = document.getElementById('photo-input');

        console.log('사진 업로드 초기화:', { 
            uploadBtn: !!uploadBtn, 
            uploadZone: !!uploadZone, 
            photoInput: !!photoInput 
        });

        if (!uploadBtn || !uploadZone || !photoInput) {
            console.warn('사진 업로드 요소를 찾을 수 없습니다.');
            return;
        }

        // 클릭 이벤트
        const handleUploadClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('사진 업로드 버튼 클릭');
            
            if (this.selectedPhotos.length >= 5) {
                this.showNotification('이미지는 최대 5장까지 업로드 가능합니다.', 'warning');
                return;
            }
            
            // 임시 파일 입력 생성
            const tempInput = document.createElement('input');
            tempInput.type = 'file';
            tempInput.accept = 'image/*';
            tempInput.multiple = true;
            tempInput.style.display = 'none';
            
            tempInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    this.handlePhotoUpload(files);
                }
                tempInput.remove();
            });
            
            document.body.appendChild(tempInput);
            tempInput.click();
        };

        // 이벤트 등록
        uploadBtn.addEventListener('click', handleUploadClick);
        uploadZone.addEventListener('click', handleUploadClick);

        // 업로드 존 호버 효과
        uploadZone.addEventListener('mouseenter', () => {
            uploadZone.style.borderColor = 'var(--primary-color)';
            uploadZone.style.backgroundColor = 'var(--primary-light)';
        });

        uploadZone.addEventListener('mouseleave', () => {
            if (!uploadZone.classList.contains('drag-over')) {
                uploadZone.style.borderColor = 'var(--border-color)';
                uploadZone.style.backgroundColor = 'transparent';
            }
        });
    }

    /**
     * 드래그 앤 드롭 초기화
     */
    initDragAndDrop() {
        const uploadZone = document.querySelector('.upload-zone');
        if (!uploadZone) return;

        const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
        
        events.forEach((eventName) => {
            uploadZone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach((eventName) => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.add('drag-over');
                uploadZone.style.borderColor = 'var(--primary-color)';
                uploadZone.style.backgroundColor = 'var(--primary-light)';
            }, false);
        });

        ['dragleave', 'drop'].forEach((eventName) => {
            uploadZone.addEventListener(eventName, () => {
                uploadZone.classList.remove('drag-over');
                uploadZone.style.borderColor = 'var(--border-color)';
                uploadZone.style.backgroundColor = 'transparent';
            }, false);
        });

        uploadZone.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files) {
                const files = Array.from(e.dataTransfer.files);
                this.handlePhotoUpload(files);
            }
        }, false);
    }

    /**
     * 기본 이벤트 방지
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * 사진 업로드 처리
     */
    handlePhotoUpload(files) {
        console.log('사진 업로드 처리 시작:', files.length, '개 파일');
        
        if (!Array.isArray(files) || files.length === 0) {
            console.warn('업로드할 파일이 없습니다.');
            return;
        }
        
        // 이미지 파일만 필터링
        const validFiles = files.filter((file) => {
            return file && file.type && file.type.startsWith('image/');
        });

        if (validFiles.length === 0) {
            this.showNotification('이미지 파일만 업로드 가능합니다.', 'error');
            return;
        }

        // 5장 제한 확인
        const totalFiles = this.selectedPhotos.length + validFiles.length;
        if (totalFiles > 5) {
            const allowedCount = 5 - this.selectedPhotos.length;
            if (allowedCount > 0) {
                const filesToAdd = validFiles.slice(0, allowedCount);
                this.selectedPhotos = [...this.selectedPhotos, ...filesToAdd];
                this.showNotification(`이미지는 최대 5장까지 업로드 가능합니다. (${allowedCount}장만 추가됨)`, 'warning');
            } else {
                this.showNotification('이미지는 최대 5장까지 업로드 가능합니다.', 'warning');
                return;
            }
        } else {
            this.selectedPhotos = [...this.selectedPhotos, ...validFiles];
        }

        // 파일 크기 검사
        const oversizedFiles = this.selectedPhotos.filter((file) => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            this.selectedPhotos = this.selectedPhotos.filter((file) => file.size <= 5 * 1024 * 1024);
            this.showNotification('파일 크기는 5MB 이하만 가능합니다. 큰 파일들이 제외되었습니다.', 'warning');
        }

        console.log('최종 선택된 사진 수:', this.selectedPhotos.length);
        
        // Form input과 미리보기 업데이트
        this.updateFormFileInput();
        this.updatePhotoPreview();
        this.updateUploadStatus();
        
        if (this.selectedPhotos.length > 0) {
            this.showNotification(`${this.selectedPhotos.length}장의 이미지가 추가되었습니다.`, 'success');
        }
    }

    /**
     * Form의 파일 input 업데이트
     */
    updateFormFileInput() {
        const photoInput = document.getElementById('photo-input');
        if (!photoInput) return;

        const dt = new DataTransfer();
        
        this.selectedPhotos.forEach(file => {
            dt.items.add(file);
        });
        
        photoInput.files = dt.files;
        
        console.log('Form input 업데이트 완료:', {
            selectedCount: this.selectedPhotos.length,
            inputFilesCount: photoInput.files.length
        });
    }

    /**
     * 업로드 상태 업데이트
     */
    updateUploadStatus() {
        const uploadZone = document.querySelector('.upload-zone');
        const uploadText = document.querySelector('.upload-main-text');
        const uploadSubText = document.querySelector('.upload-sub-text');
        
        if (!uploadZone || !uploadText || !uploadSubText) return;

        if (this.selectedPhotos.length === 0) {
            uploadText.textContent = '사진을 드래그하거나 클릭하여 업로드';
            uploadSubText.textContent = '최대 5장까지 업로드 가능';
            uploadZone.classList.remove('has-files');
        } else {
            const remaining = 5 - this.selectedPhotos.length;
            uploadText.textContent = `${this.selectedPhotos.length}장 선택됨`;
            uploadSubText.textContent = remaining > 0 ? `${remaining}장 더 추가 가능` : '최대 업로드 완료';
            uploadZone.classList.add('has-files');
        }
    }

    /**
     * 사진 미리보기 업데이트
     */
    updatePhotoPreview() {
        const previewContainer = document.querySelector('.photo-preview-container');
        if (!previewContainer) return;

        // 기존 미리보기 제거
        previewContainer.innerHTML = '';

        if (this.selectedPhotos.length === 0) {
            previewContainer.style.display = 'none';
            return;
        }

        previewContainer.style.display = 'block';

        // 미리보기 그리드 생성
        const previewGrid = document.createElement('div');
        previewGrid.className = 'photo-preview-grid';
        
        this.selectedPhotos.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'photo-preview-item';
                    previewItem.innerHTML = `
                        <div class="preview-image">
                            <img src="${e.target.result}" alt="미리보기 ${index + 1}">
                        </div>
                        <div class="preview-info">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${this.formatFileSize(file.size)}</span>
                        </div>
                        <button type="button" class="remove-photo-btn" data-index="${index}" title="사진 제거">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    previewGrid.appendChild(previewItem);
                }
            };
            reader.onerror = () => {
                console.warn('파일 읽기 실패:', file.name);
            };
            reader.readAsDataURL(file);
        });

        previewContainer.appendChild(previewGrid);

        // 삭제 버튼 이벤트 등록
        setTimeout(() => {
            const removeButtons = previewContainer.querySelectorAll('.remove-photo-btn');
            removeButtons.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const index = parseInt(btn.getAttribute('data-index'), 10);
                    if (!isNaN(index)) {
                        this.removePhoto(index);
                    }
                });
            });
        }, 100);
    }

    /**
     * 파일 크기 포맷팅
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 사진 제거
     */
    removePhoto(index) {
        console.log('사진 제거:', index);
        
        if (index >= 0 && index < this.selectedPhotos.length) {
            const removedFile = this.selectedPhotos[index];
            this.selectedPhotos.splice(index, 1);
            
            console.log('사진 제거 완료, 남은 사진 수:', this.selectedPhotos.length);
            
            // Form input과 미리보기 업데이트
            this.updateFormFileInput();
            this.updatePhotoPreview();
            this.updateUploadStatus();
            
            this.showNotification(`"${removedFile.name}" 이미지가 제거되었습니다.`, 'info');
        }
    }

    /**
     * 폼 초기화
     */
    initForm() {
        const reviewForm = document.querySelector('.review-form');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', (e) => {
            console.log('리뷰 폼 제출 시도');
            
            if (!this.validateForm()) {
                e.preventDefault();
                return false;
            }
            
            // 제출 전 로딩 상태 표시
            this.showLoadingState();
            
            // 성공 메시지 (실제로는 서버 응답 후 처리)
            this.showNotification('리뷰가 등록되었습니다!', 'success');
        });
    }

    /**
     * 폼 유효성 검사
     */
    validateForm() {
        const titleInput = document.querySelector('.review-title');
        const contentTextarea = document.querySelector('.review-content');
        const ratingValue = document.getElementById('rating-value');
        
        const title = titleInput ? titleInput.value.trim() : '';
        const content = contentTextarea ? contentTextarea.value.trim() : '';
        const rating = ratingValue ? parseInt(ratingValue.value) : 0;

        console.log('폼 검증:', { title, content, rating, currentRating: this.currentRating });

        // 별점 검사
        const finalRating = rating || this.currentRating;
        if (!finalRating || finalRating < 1 || finalRating > 5) {
            this.showNotification('별점을 선택해주세요.', 'error');
            this.scrollToElement('.rating-group');
            return false;
        }

        // hidden input 값 설정
        if (ratingValue && !ratingValue.value) {
            ratingValue.value = this.currentRating;
        }

        // 제목 검사
        if (!title) {
            this.showNotification('리뷰 제목을 입력해주세요.', 'error');
            if (titleInput) {
                titleInput.focus();
                this.scrollToElement('.review-title');
            }
            return false;
        }

        if (title.length > 100) {
            this.showNotification('리뷰 제목은 100자 이하로 입력해주세요.', 'error');
            if (titleInput) titleInput.focus();
            return false;
        }

        // 내용 검사
        if (!content) {
            this.showNotification('리뷰 내용을 입력해주세요.', 'error');
            if (contentTextarea) {
                contentTextarea.focus();
                this.scrollToElement('.review-content');
            }
            return false;
        }

        if (content.length < 10) {
            this.showNotification('리뷰 내용은 10자 이상 작성해주세요.', 'error');
            if (contentTextarea) contentTextarea.focus();
            return false;
        }

        if (content.length > 500) {
            this.showNotification('리뷰 내용은 500자 이하로 작성해주세요.', 'error');
            if (contentTextarea) contentTextarea.focus();
            return false;
        }

        // 로그인 체크
        const memberNoInput = document.querySelector('input[name="MemberNo"]');
        const memberNo = memberNoInput ? memberNoInput.value : '';
        
        if (!memberNo) {
            this.showNotification('로그인이 필요합니다.', 'error');
            return false;
        }

        console.log('리뷰 등록 정보:', {
            title,
            content,
            rating: finalRating,
            memberNo,
            photoCount: this.selectedPhotos.length
        });

        return true;
    }

    /**
     * 로딩 상태 표시
     */
    showLoadingState() {
        const submitBtn = document.querySelector('.btn-submit');
        if (!submitBtn) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            등록 중...
        `;
        submitBtn.style.opacity = '0.7';
    }

    /**
     * 요소로 스크롤
     */
    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    /**
     * 알림 표시
     */
    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // 아이콘 설정
        let icon = 'fa-info-circle';
        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-triangle';
                break;
            case 'warning':
                icon = 'fa-exclamation-circle';
                break;
        }

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <span class="notification-message">${message}</span>
                <button class="notification-close" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // 자동 제거 타이머
        const autoRemoveTimer = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // 닫기 버튼 이벤트
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoRemoveTimer);
                this.removeNotification(notification);
            });
        }

        // 클릭 시 제거
        notification.addEventListener('click', () => {
            clearTimeout(autoRemoveTimer);
            this.removeNotification(notification);
        });
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

    /**
     * 폼 리셋 (필요 시 사용)
     */
    resetForm() {
        this.currentRating = 0;
        this.selectedPhotos = [];
        
        // 별점 초기화
        this.updateStarDisplay(0);
        this.updateRatingText(0);
        
        const ratingValue = document.getElementById('rating-value');
        if (ratingValue) ratingValue.value = '';
        
        // 입력 필드 초기화
        const titleInput = document.querySelector('.review-title');
        const contentTextarea = document.querySelector('.review-content');
        const photoInput = document.getElementById('photo-input');
        
        if (titleInput) titleInput.value = '';
        if (contentTextarea) contentTextarea.value = '';
        if (photoInput) photoInput.value = '';
        
        // 카운터 초기화
        const titleCounter = document.querySelector('.current-title-length');
        const contentCounter = document.querySelector('.current-content-length');
        if (titleCounter) titleCounter.textContent = '0';
        if (contentCounter) contentCounter.textContent = '0';
        
        // 사진 관련 업데이트
        this.updateFormFileInput();
        this.updatePhotoPreview();
        this.updateUploadStatus();
        
        console.log('리뷰 폼 리셋 완료');
    }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.reviewWrite = new ReviewWrite();
        console.log('ReviewWrite 전역 객체 생성 완료');
    } catch (error) {
        console.error('ReviewWrite 초기화 실패:', error);
    }
});

// 페이지 이탈 시 확인 (작성 중인 내용이 있는 경우)
window.addEventListener('beforeunload', (e) => {
    const titleInput = document.querySelector('.review-title');
    const contentTextarea = document.querySelector('.review-content');
    
    const hasTitle = titleInput && titleInput.value.trim().length > 0;
    const hasContent = contentTextarea && contentTextarea.value.trim().length > 0;
    const hasPhotos = window.reviewWrite && window.reviewWrite.selectedPhotos.length > 0;
    const hasRating = window.reviewWrite && window.reviewWrite.currentRating > 0;
    
    if (hasTitle || hasContent || hasPhotos || hasRating) {
        e.preventDefault();
        e.returnValue = '작성 중인 리뷰가 있습니다. 페이지를 떠나시겠습니까?';
        return e.returnValue;
    }
});