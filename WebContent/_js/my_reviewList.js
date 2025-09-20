/**
 * 마이페이지 - 내 리뷰 내역 관련 자바스크립트
 */

document.addEventListener('DOMContentLoaded', function() {
    // 별점 표시 기능
    function renderStars() {
        document.querySelectorAll('.review-card').forEach(card => {
            const ratingValue = parseInt(card.dataset.rating);
            const stars = card.querySelectorAll('.review-rating i');

            stars.forEach((star, index) => {
                if (index < ratingValue) {
                    star.className = 'fas fa-star';
                } else {
                    star.className = 'far fa-star';
                }
            });
        });
    }

    // 카테고리 필터링
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            const selectedCategory = this.value;
            const cards = document.querySelectorAll('.review-card');

            cards.forEach(card => {
                if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            updateVisibleReviewsCount();
        });
    }

    // 별점 기준 정렬
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function () {
            const selectedSort = this.value;
            const reviewsContainer = document.querySelector('.review-cards');
            const cards = Array.from(document.querySelectorAll('.review-card'));

            if (selectedSort === 'recent') {
                cards.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.review-date').textContent.replace(/\./g, '-'));
                    const dateB = new Date(b.querySelector('.review-date').textContent.replace(/\./g, '-'));
                    return dateB - dateA;
                });
            } else if (selectedSort === 'rating-high') {
                cards.sort((a, b) => parseInt(b.dataset.rating) - parseInt(a.dataset.rating));
            } else if (selectedSort === 'rating-low') {
                cards.sort((a, b) => parseInt(a.dataset.rating) - parseInt(b.dataset.rating));
            }

            cards.forEach(card => reviewsContainer.appendChild(card));
        });
    }

    // 검색 기능
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            const searchTerm = document.querySelector('.search-input').value.toLowerCase();
            const cards = document.querySelectorAll('.review-card');

            cards.forEach(card => {
                const title = card.querySelector('.restaurant-title').textContent.toLowerCase();
                const reviewText = card.querySelector('.review-text').textContent.toLowerCase();

                if (title.includes(searchTerm) || reviewText.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            updateVisibleReviewsCount();
        });
    }

    // 리뷰 삭제 기능
    document.querySelectorAll('.btn-delete').forEach(button => {
	    button.addEventListener('click', function () {
	        const url = this.getAttribute('data-url');
	        if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
	            location.href = url;
	        }
	    });
	});

    // 리뷰 수정 기능
    const editButtons = document.querySelectorAll('.btn-edit');
    if (editButtons.length > l) {
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const restaurantName = this.closest('.review-card').querySelector('.restaurant-title').textContent;
                alert(`'${restaurantName}'에 대한 리뷰 수정 페이지로 이동합니다.`);
                // 실제 구현에서는 리뷰 수정 페이지로 이동하는 코드 추가
            });
        });
    }

    // 맛집 보기 기능
    const viewButtons = document.querySelectorAll('.btn-view');
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const restaurantName = this.closest('.review-card').querySelector('.restaurant-title').textContent;
                alert(`'${restaurantName}' 맛집 페이지로 이동합니다.`);
                // 실제 구현에서는 맛집 상세 페이지로 이동하는 코드 추가
            });
        });
    }

    // 보이는 리뷰 수 업데이트
    function updateVisibleReviewsCount() {
        const visibleCards = document.querySelectorAll('.review-card[style*="display: block"], .review-card:not([style*="display"])').length;
        const countElement = document.querySelector('.count-number');
        if (countElement) {
            countElement.textContent = visibleCards;
        }
    }

    // 엔터키 검색 지원
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                document.querySelector('.search-btn').click();
            }
        });
    }

    // 초기화
    renderStars();
});
