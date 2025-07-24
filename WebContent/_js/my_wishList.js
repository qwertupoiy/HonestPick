// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료'); // 디버깅용
    
    // 찜하기 버튼 - 직접 링크 연결로 변경했으므로 이벤트 리스너 제거
    // 알림창 없이 바로 링크로 이동하도록 수정
    
    // 카테고리 필터링
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const cards = document.querySelectorAll('.favorite-card');
            
            cards.forEach(function(card) {
                if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 검색 기능
    function performSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.favorite-card');
        
        cards.forEach(function(card) {
            const titleElement = card.querySelector('.restaurant-title');
            const tagsElement = card.querySelector('.restaurant-tags');
            
            if (titleElement && tagsElement) {
                const title = titleElement.textContent.toLowerCase();
                const tags = tagsElement.textContent.toLowerCase();
                
                if (title.includes(searchTerm) || tags.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // 검색 버튼 클릭 이벤트
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // 검색 입력 엔터키 이벤트
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // 정렬 기능
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            const sortType = this.value;
            const cardsContainer = document.querySelector('.favorite-cards');
            const cards = Array.from(document.querySelectorAll('.favorite-card'));
            
            if (!cardsContainer || cards.length === 0) return;
            
            cards.sort(function(a, b) {
                switch(sortType) {
                    case 'name':
                        const nameAElement = a.querySelector('.restaurant-title');
                        const nameBElement = b.querySelector('.restaurant-title');
                        const nameA = nameAElement ? nameAElement.textContent : '';
                        const nameB = nameBElement ? nameBElement.textContent : '';
                        return nameA.localeCompare(nameB);
                    case 'rating':
                        const ratingAElement = a.querySelector('.restaurant-rating span');
                        const ratingBElement = b.querySelector('.restaurant-rating span');
                        const ratingA = ratingAElement ? parseFloat(ratingAElement.textContent) || 0 : 0;
                        const ratingB = ratingBElement ? parseFloat(ratingBElement.textContent) || 0 : 0;
                        return ratingB - ratingA; // 높은 평점순
                    case 'recent':
                    default:
                        return 0; // 기본 순서 유지
                }
            });
            
            // 정렬된 카드들을 다시 DOM에 추가
            cards.forEach(function(card) {
                cardsContainer.appendChild(card);
            });
        });
    }
});