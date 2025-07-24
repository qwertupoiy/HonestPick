document.addEventListener('DOMContentLoaded', function() {
    // 별점 생성 함수 (반올림 버전)
    function generateStars(rating) {
        // 반올림하여 정수로 만들기
        const roundedRating = Math.round(rating);
        const fullStars = Math.min(roundedRating, 5); // 최대 5개
        const emptyStars = 5 - fullStars;
        
        let starsHTML = '';
        
        // 꽉 찬 별
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        
        // 빈 별
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    }
    
    // 모든 별점 요소에 대해 별점 생성
    function initializeStars() {
        const starElements = document.querySelectorAll('.stars[data-rating]');
        
        starElements.forEach(element => {
            const rating = parseFloat(element.getAttribute('data-rating'));
            if (!isNaN(rating)) {
                element.innerHTML = generateStars(rating);
            } else {
                // 평점이 없는 경우 기본값
                element.innerHTML = '☆☆☆☆☆';
            }
        });
    }
    
    // 별점 초기화 실행
    initializeStars();
    
    // 검색 기능 구현
    const searchInput = document.querySelector('.search-input-large');
    const searchButton = document.querySelector('.hero-search .btn-primary');
    
    // 검색 버튼 클릭 이벤트
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 동작 방지
            performSearch();
        });
    }
    
    // Enter 키 처리
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    // 검색 실행 함수
    function performSearch() {
        const searchKeyword = searchInput.value.trim();
        const path = getContextPath(); // 컨텍스트 패스 가져오기
        
        if (searchKeyword) {
            location.href = `${path}/Store_servlet/storeList.do?searchKeyword=${encodeURIComponent(searchKeyword)}`;
        } else {
            location.href = `${path}/Store_servlet/storeList.do`;
        }
    }
    
    // 컨텍스트 패스 가져오기 함수
    function getContextPath() {
        // JSP에서 설정된 path 변수가 있다면 사용
        if (typeof window.contextPath !== 'undefined') {
            return window.contextPath;
        }
        
        // 또는 현재 URL에서 추출
        const pathArray = location.pathname.split('/');
        return pathArray.length > 1 ? '/' + pathArray[1] : '';
    }

    // 추천 맛집 슬라이더 구현
    const restaurantSlider = document.querySelector('.restaurant-slider');
    const prevButton = document.getElementById('prev-recommend');
    const nextButton = document.getElementById('next-recommend');
    
    if (restaurantSlider && prevButton && nextButton) {
        // 슬라이더 컨테이너에 오버플로우 숨김 스타일 추가
        const sliderParent = restaurantSlider.parentElement;
        sliderParent.style.overflow = 'hidden';
        
        // 설정값
        const cards = Array.from(restaurantSlider.querySelectorAll('.restaurant-card'));
        let cardsPerView = getCardsPerView();
        let currentIndex = 0;
        let totalSlides = Math.ceil(cards.length / cardsPerView);
        
        // 슬라이더 초기화
        setupSlider();
        
        // 이전 버튼 클릭 이벤트
        prevButton.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                moveSlider();
            }
        });
        
        // 다음 버튼 클릭 이벤트
        nextButton.addEventListener('click', function() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                moveSlider();
            }
        });
        
        // 화면 크기에 따른 카드 개수 결정 함수
        function getCardsPerView() {
            if (window.innerWidth < 576) return 1;     // 모바일
            if (window.innerWidth < 992) return 2;     // 태블릿
            if (window.innerWidth < 1200) return 3;    // 작은 데스크탑
            return 4;                                 // 큰 데스크탑
        }
        
        // 슬라이더 설정 함수
        function setupSlider() {
            // 카드가 없으면 슬라이더 기능 비활성화
            if (cards.length === 0) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
                return;
            }
            
            // 카드 스타일 설정
            const cardWidth = (100 / cardsPerView) + '%';
            
            cards.forEach(card => {
                card.style.width = cardWidth;
                card.style.minWidth = cardWidth;
                card.style.boxSizing = 'border-box';
                card.style.padding = '0 10px';
            });
            
            // 슬라이더 컨테이너 스타일 설정
            restaurantSlider.style.display = 'flex';
            restaurantSlider.style.transition = 'transform 0.5s ease';
            restaurantSlider.style.willChange = 'transform';
            
            // 총 슬라이드 수 재계산
            totalSlides = Math.ceil(cards.length / cardsPerView);
            
            moveSlider();
            updateButtonStates();
        }
        
        // 슬라이더 이동 함수
        function moveSlider() {
            const offset = -(currentIndex * (100 / cardsPerView) * cardsPerView);
            restaurantSlider.style.transform = `translateX(${offset}%)`;
            updateButtonStates();
        }
        
        // 버튼 상태 업데이트 함수
        function updateButtonStates() {
            prevButton.disabled = currentIndex === 0;
            prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
            
            nextButton.disabled = currentIndex >= totalSlides - 1;
            nextButton.style.opacity = currentIndex >= totalSlides - 1 ? '0.5' : '1';
        }
        
        // 화면 크기 변경 감지
        window.addEventListener('resize', function() {
            const newCardsPerView = getCardsPerView();
            
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                const newTotalSlides = Math.ceil(cards.length / cardsPerView);
                
                // 현재 인덱스가 새로운 총 슬라이드 수보다 크면 조정
                if (currentIndex >= newTotalSlides) {
                    currentIndex = Math.max(0, newTotalSlides - 1);
                }
                
                setupSlider();
            }
        });
        
        // 자동 슬라이드 기능 (5초마다)
        let autoSlideInterval = setInterval(autoSlide, 5000);
        
        function autoSlide() {
            if (totalSlides <= 1) return; // 카드가 1개 이하면 자동 슬라이드 안함
            
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            moveSlider();
        }
        
        // 사용자 상호작용 시 자동 슬라이드 일시 중지
        function pauseAutoSlide() {
            clearInterval(autoSlideInterval);
            // 10초 후 자동 슬라이드 재개
            setTimeout(function() {
                autoSlideInterval = setInterval(autoSlide, 5000);
            }, 10000);
        }
        
        [prevButton, nextButton].forEach(button => {
            button.addEventListener('click', pauseAutoSlide);
        });
        
        // 터치 이벤트 (모바일용)
        let touchStartX = 0;
        let touchEndX = 0;
        
        restaurantSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            pauseAutoSlide();
        }, false);
        
        restaurantSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            // 오른쪽에서 왼쪽으로 스와이프 (다음)
            if (touchEndX < touchStartX - swipeThreshold) {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    moveSlider();
                }
            }
            
            // 왼쪽에서 오른쪽으로 스와이프 (이전)
            if (touchEndX > touchStartX + swipeThreshold) {
                if (currentIndex > 0) {
                    currentIndex--;
                    moveSlider();
                }
            }
        }
    }
    
    // 카테고리 필터링 기능 구현
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryGrid = document.querySelector('.category-grid');
    
    if (categoryButtons.length > 0 && categoryGrid) {
        const restaurantCards = categoryGrid.querySelectorAll('.restaurant-card');
        
        // 각 카테고리 버튼에 클릭 이벤트 추가
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 모든 버튼에서 active 클래스 제거
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // 클릭한 버튼에 active 클래스 추가
                this.classList.add('active');
                
                const selectedCategory = this.textContent.trim();
                
                // 모든 카드 숨기기
                restaurantCards.forEach(card => {
                    card.style.display = 'none';
                });
                
                // 선택된 카테고리에 맞는 카드만 표시
                if (selectedCategory === '전체') {
                    restaurantCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    restaurantCards.forEach(card => {
                        const categoryTag = card.querySelector('.category-tag');
                        if (categoryTag) {
                            const cardCategory = categoryTag.textContent.trim();
                            if (cardCategory === selectedCategory) {
                                card.style.display = 'block';
                            }
                        }
                    });
                }
                
                // 필터링 후 별점 다시 초기화 (새로 표시되는 카드들에 대해)
                initializeStars();
                
                // 필터링 후 애니메이션 효과
                setTimeout(() => {
                    const visibleCards = Array.from(restaurantCards).filter(card => 
                        card.style.display !== 'none'
                    );
                    
                    visibleCards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, 50);
            });
        });
    }
    
    // 페이지 로드 시 부드러운 나타나기 효과
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});