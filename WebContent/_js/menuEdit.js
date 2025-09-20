// 메뉴 수정 페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소들
    const form = document.getElementById('menu-edit-form');
    const menuNameInput = document.getElementById('menuName');
    const menuPriceInput = document.getElementById('menuPrice');
    const menuDescriptionInput = document.getElementById('menuDescription');
    const menuImageInput = document.getElementById('menuImage');
    const previewImage = document.getElementById('preview-image');
    const imageUploadBtn = document.getElementById('image-upload-btn');
    const imageRemoveBtn = document.getElementById('image-remove-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    // 초기 상태 저장 (변경사항 확인용)
    const initialFormData = {
        menuName: menuNameInput ? menuNameInput.value : '',
        menuPrice: menuPriceInput ? menuPriceInput.value : '',
        menuDescription: menuDescriptionInput ? menuDescriptionInput.value : '',
        menuImage: previewImage ? previewImage.src : ''
    };

    let isImageChanged = false;
    let isImageRemoved = false;

    // 삭제 버튼 클릭 시 해당 URL로 이동
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('정말로 이 메뉴를 삭제하시겠습니까?')) {
                const storeNoInput = document.querySelector('input[name="StoreNo"]');
                const menuNoInput = document.querySelector('input[name="MenuNo"]');
                
                const storeNo = storeNoInput ? storeNoInput.value : '';
                const menuNo = menuNoInput ? menuNoInput.value : '';
                
                console.log('StoreNo:', storeNo);
                console.log('MenuNo:', menuNo);
                
                if (storeNo && menuNo) {
                    const deleteUrl = '../Admin_servlet/menuRemove.do?StoreNo=' + storeNo + '&MenuNo=' + menuNo;
                    console.log('Delete URL:', deleteUrl);
                    window.location.href = deleteUrl;
                } else {
                    alert('삭제에 필요한 정보를 찾을 수 없습니다.');
                }
            }
        });
    }

    // 이미지 업로드 버튼 클릭
    if (imageUploadBtn) {
        imageUploadBtn.addEventListener('click', function() {
            console.log('이미지 업로드 버튼 클릭됨');
            menuImageInput.click();
        });
    }

    // 이미지 파일 선택 시
    if (menuImageInput) {
        menuImageInput.addEventListener('change', function(e) {
            console.log('이미지 파일 선택됨');
            const file = e.target.files[0];
            if (file) {
                // 파일 유효성 검사
                if (!validateImageFile(file)) {
                    return;
                }

                // 이미지 미리보기
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    isImageChanged = true;
                    isImageRemoved = false;
                    updateImageControls();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 이미지 삭제 버튼 클릭
    if (imageRemoveBtn) {
        imageRemoveBtn.addEventListener('click', function() {
            console.log('이미지 삭제 버튼 클릭됨');
            if (confirm('현재 이미지를 삭제하시겠습니까?')) {
                previewImage.src = '';
                previewImage.style.display = 'none';
                menuImageInput.value = '';
                isImageRemoved = true;
                isImageChanged = false;
                updateImageControls();
            }
        });
    }

    // 이미지 컨트롤 버튼 상태 업데이트
    function updateImageControls() {
        if (isImageRemoved) {
            imageRemoveBtn.style.display = 'none';
            imageUploadBtn.textContent = '이미지 업로드';
        } else {
            imageRemoveBtn.style.display = 'inline-block';
            imageUploadBtn.textContent = '이미지 변경';
        }
    }

    // 이미지 파일 유효성 검사
    function validateImageFile(file) {
        // 파일 크기 검사 (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('이미지 파일 크기는 5MB 이하여야 합니다.');
            menuImageInput.value = '';
            return false;
        }

        // 파일 형식 검사
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('JPG, PNG, GIF 파일만 업로드 가능합니다.');
            menuImageInput.value = '';
            return false;
        }

        return true;
    }

    // 메뉴명 입력 검증
    if (menuNameInput) {
        menuNameInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 100) {
                this.value = value.substring(0, 100);
                showFieldError(this, '메뉴명은 100자 이하로 입력해주세요.');
            } else {
                clearFieldError(this);
            }
        });
    }

    // 가격 입력 검증
    if (menuPriceInput) {
        menuPriceInput.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 0) {
                this.value = 0;
            } else if (value > 1000000) {
                this.value = 1000000;
                showFieldError(this, '가격은 1,000,000원 이하로 설정해주세요.');
            } else {
                clearFieldError(this);
            }
            
            // 천 단위 콤마 표시 (선택사항)
            if (this.value) {
                const formattedPrice = parseInt(this.value).toLocaleString();
                this.setAttribute('data-formatted', formattedPrice + '원');
            }
        });
    }

    // 설명 입력 검증
    if (menuDescriptionInput) {
        menuDescriptionInput.addEventListener('input', function() {
            const value = this.value;
            const maxLength = 1000;
            
            if (value.length > maxLength) {
                this.value = value.substring(0, maxLength);
            }
            
            // 글자 수 표시
            updateCharacterCount(this, maxLength);
        });
    }

    // 글자 수 표시 함수
    function updateCharacterCount(textarea, maxLength) {
        let counterElement = textarea.parentElement.querySelector('.char-counter');
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.className = 'char-counter';
            textarea.parentElement.appendChild(counterElement);
        }
        
        const currentLength = textarea.value.length;
        counterElement.textContent = currentLength + '/' + maxLength + '자';
        counterElement.style.color = currentLength > maxLength * 0.9 ? '#e74c3c' : '#666';
    }

    // 필드 에러 표시
    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        
        field.parentElement.appendChild(errorElement);
        field.style.borderColor = '#e74c3c';
    }

    // 필드 에러 제거
    function clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    // 폼 변경사항 확인
    function hasFormChanged() {
        return (
            (menuNameInput && menuNameInput.value !== initialFormData.menuName) ||
            (menuPriceInput && menuPriceInput.value !== initialFormData.menuPrice) ||
            (menuDescriptionInput && menuDescriptionInput.value !== initialFormData.menuDescription) ||
            isImageChanged ||
            isImageRemoved
        );
    }

    // 취소 버튼 클릭
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (hasFormChanged()) {
                if (confirm('변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
                    window.history.back();
                }
            } else {
                window.history.back();
            }
        });
    }

    // 폼 제출 전 검증
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 버튼 비활성화 (중복 제출 방지)
            if (editBtn) {
                editBtn.disabled = true;
                editBtn.textContent = '수정 중...';
            }
            
            // 필수 필드 검증
            if (!validateForm()) {
                if (editBtn) {
                    editBtn.disabled = false;
                    editBtn.textContent = '메뉴 수정하기';
                }
                return;
            }

            // 변경사항 확인
            if (!hasFormChanged()) {
                if (!confirm('변경된 내용이 없습니다. 그래도 수정하시겠습니까?')) {
                    if (editBtn) {
                        editBtn.disabled = false;
                        editBtn.textContent = '메뉴 수정하기';
                    }
                    return;
                }
            }

            // 이미지 삭제 처리
            if (isImageRemoved) {
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'RemoveImage';
                hiddenInput.value = 'true';
                form.appendChild(hiddenInput);
            }

            // 폼 제출
            this.submit();
        });
    }

    // 폼 유효성 검사
    function validateForm() {
        let isValid = true;

        // 메뉴명 검증
        if (menuNameInput) {
            if (!menuNameInput.value.trim()) {
                showFieldError(menuNameInput, '메뉴명을 입력해주세요.');
                isValid = false;
            } else if (menuNameInput.value.trim().length < 2) {
                showFieldError(menuNameInput, '메뉴명은 2자 이상 입력해주세요.');
                isValid = false;
            }
        }

        // 가격 검증
        if (menuPriceInput) {
            if (!menuPriceInput.value || parseInt(menuPriceInput.value) <= 0) {
                showFieldError(menuPriceInput, '올바른 가격을 입력해주세요.');
                isValid = false;
            }
        }

        // 설명 검증
        if (menuDescriptionInput) {
            if (!menuDescriptionInput.value.trim()) {
                showFieldError(menuDescriptionInput, '메뉴 설명을 입력해주세요.');
                isValid = false;
            } else if (menuDescriptionInput.value.trim().length < 10) {
                showFieldError(menuDescriptionInput, '메뉴 설명은 10자 이상 입력해주세요.');
                isValid = false;
            }
        }

        return isValid;
    }

    // 페이지 떠날 때 확인 (변경사항이 있는 경우)
    window.addEventListener('beforeunload', function(e) {
        if (hasFormChanged()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // 초기화 시 글자 수 표시
    if (menuDescriptionInput) {
        updateCharacterCount(menuDescriptionInput, 1000);
    }

    // 가격 포맷팅 초기화
    if (menuPriceInput && menuPriceInput.value) {
        const formattedPrice = parseInt(menuPriceInput.value).toLocaleString();
        menuPriceInput.setAttribute('data-formatted', formattedPrice + '원');
    }

    // 접근성을 위한 키보드 이벤트
    document.addEventListener('keydown', function(e) {
        // Ctrl+S로 저장
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // ESC로 취소
        if (e.key === 'Escape') {
            if (cancelBtn) {
                cancelBtn.click();
            }
        }
    });

    console.log('메뉴 수정 페이지 JavaScript 로드 완료');
});