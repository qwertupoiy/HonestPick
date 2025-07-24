// 방문기록 페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // 탭 클릭 이벤트
    document.querySelectorAll('.visits-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 탭 활성화
            document.querySelectorAll('.visits-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 카드 필터링
            const status = this.dataset.status;
            const cards = document.querySelectorAll('.visit-card');
            
            cards.forEach(card => {
                if (status === 'all' || card.dataset.status === status) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 카테고리 필터링
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const cards = document.querySelectorAll('.visit-card');
            
            cards.forEach(card => {
                if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 정렬 기능
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            const sortType = this.value;
            const cardsContainer = document.querySelector('.visit-cards');
            const cards = Array.from(document.querySelectorAll('.visit-card'));
            
            cards.sort((a, b) => {
                switch(sortType) {
                    case 'name':
                        const nameA = a.querySelector('.visit-title').textContent;
                        const nameB = b.querySelector('.visit-title').textContent;
                        return nameA.localeCompare(nameB);
                    case 'old':
                        // 실제로는 날짜 데이터로 정렬해야 함
                        return 0;
                    case 'recent':
                    default:
                        return 0;
                }
            });
            
            // 정렬된 카드들을 다시 DOM에 추가
            cards.forEach(card => cardsContainer.appendChild(card));
        });
    }

    // 기간별 필터링
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            const period = this.value;
            const cards = document.querySelectorAll('.visit-card');
            
            // 실제 구현시에는 날짜 데이터를 기반으로 필터링
            cards.forEach(card => {
                // 현재는 모든 카드를 표시하지만, 
                // 실제로는 period 값에 따라 날짜 범위를 계산하여 필터링
                card.style.display = 'block';
            });
        });
    }

    // 리뷰 작성 버튼
    document.querySelectorAll('.btn-review').forEach(button => {
        button.addEventListener('click', function() {
            // 실제 구현시에는 리뷰 작성 페이지로 이동
            // const storeId = this.dataset.storeId; // 매장 ID 가져오기
            // const visitId = this.dataset.visitId; // 방문 ID 가져오기
            // window.location.href = '/review/write?storeId=' + storeId + '&visitId=' + visitId;
            
            alert('리뷰 작성 페이지로 이동합니다.');
        });
    });

    // 기록 삭제 버튼
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('정말로 방문기록을 삭제하시겠습니까?')) {
                const card = this.closest('.visit-card');
                
                // 애니메이션 효과
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                card.style.transition = 'all 0.3s ease';
                
                setTimeout(function() {
                    // 실제 구현시에는 서버로 삭제 요청
                    // const visitId = this.dataset.visitId;
                    // fetch('/api/visit/' + visitId, { method: 'DELETE' })
                    //     .then(function(response) { return response.json(); })
                    //     .then(function(data) {
                    //         if (data.success) {
                    //             card.remove();
                    //         }
                    //     });
                    
                    card.remove();
                    alert('방문기록이 삭제되었습니다.');
                }, 300);
            }
        });
    });

    // 페이지네이션 기능
    document.querySelectorAll('.page-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.innerHTML.includes('angle-right')) {
                // 다음 페이지 로직
                console.log('다음 페이지');
                // 실제 구현시 페이지 이동 로직
            } else if (!isNaN(this.textContent)) {
                // 페이지 번호 클릭 로직
                document.querySelectorAll('.page-item').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                
                const pageNumber = this.textContent;
                console.log('페이지:', pageNumber);
                
                // 실제 구현시 해당 페이지 데이터 로드
                // loadPage(pageNumber);
            }
        });
    });

    // 카드 호버 효과 개선
    document.querySelectorAll('.visit-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 검색 기능 (추가 기능)
    function performSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) return;
        
        const cards = document.querySelectorAll('.visit-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.visit-title').textContent.toLowerCase();
            const category = card.querySelector('.restaurant-category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // 검색 이벤트 (검색 입력창이 있는 경우)
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // 데이터 로드 함수 (실제 구현시 사용)
    function loadVisitData(page, filters) {
        page = page || 1;
        filters = filters || {};
        
        // 실제 구현시 서버에서 데이터를 가져오는 함수
        // fetch('/api/visits?page=' + page + '&status=' + filters.status + '&category=' + filters.category)
        //     .then(function(response) { return response.json(); })
        //     .then(function(data) {
        //         renderVisitCards(data.visits);
        //         updatePagination(data.pagination);
        //     })
        //     .catch(function(error) {
        //         console.error('방문기록 로드 실패:', error);
        //     });
    }

    // 방문기록 카드 렌더링 함수 (실제 구현시 사용)
    function renderVisitCards(visits) {
        const container = document.querySelector('.visit-cards');
        if (!container) return;
        
        container.innerHTML = '';
        
        visits.forEach(function(visit) {
            const card = createVisitCard(visit);
            container.appendChild(card);
        });
    }

    // 방문기록 카드 생성 함수 (실제 구현시 사용)
    function createVisitCard(visit) {
        const card = document.createElement('div');
        card.className = 'visit-card';
        card.dataset.status = visit.reviewStatus ? 'reviewed' : 'not-reviewed';
        card.dataset.category = visit.category;
        
        const reviewStatusText = visit.reviewStatus ? '리뷰 작성완료' : '리뷰 미작성';
        const reviewStatusClass = visit.reviewStatus ? 'status-reviewed' : 'status-not-reviewed';
        
        let actionsHtml = '';
        if (visit.reviewStatus) {
            actionsHtml = '<div class="review-completed"><i class="fas fa-check-circle"></i> 리뷰 작성 완료</div>';
        } else {
            actionsHtml = '<button class="action-btn btn-review" data-visit-id="' + visit.id + '">' +
                         '<i class="fas fa-pencil-alt"></i> 리뷰 작성</button>' +
                         '<button class="action-btn btn-delete" data-visit-id="' + visit.id + '">' +
                         '<i class="fas fa-trash-alt"></i> 기록 삭제</button>';
        }
        
        card.innerHTML = '<img src="' + (visit.image || 'https://via.placeholder.com/300x150') + '" alt="' + visit.storeName + '" class="visit-image">' +
                        '<div class="visit-content">' +
                        '<span class="visit-status ' + reviewStatusClass + '">' + reviewStatusText + '</span>' +
                        '<h4 class="visit-title">' + visit.storeName + '</h4>' +
                        '<span class="restaurant-category">' + visit.category + '</span>' +
                        '<div class="visit-details">' +
                        '<div class="detail-item">' +
                        '<span class="detail-label">방문일시</span>' +
                        '<span>' + visit.visitDate + '</span>' +
                        '</div>' +
                        '<div class="detail-item">' +
                        '<span class="detail-label">주문메뉴</span>' +
                        '<span>' + visit.menu + '</span>' +
                        '</div>' +
                        '<div class="detail-item">' +
                        '<span class="detail-label">사용금액</span>' +
                        '<span>' + visit.amount + '</span>' +
                        '</div>' +
                        '<div class="detail-item">' +
                        '<span class="detail-label">동행인</span>' +
                        '<span>' + visit.companions + '</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="visit-actions">' + actionsHtml + '</div>' +
                        '</div>';
        
        return card;
    }

    // 페이지네이션 업데이트 함수 (실제 구현시 사용)
    function updatePagination(paginationData) {
        const container = document.querySelector('.pagination');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 이전 페이지 버튼
        if (paginationData.currentPage > 1) {
            const prevBtn = document.createElement('div');
            prevBtn.className = 'page-item';
            prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
            prevBtn.addEventListener('click', function() {
                loadVisitData(paginationData.currentPage - 1);
            });
            container.appendChild(prevBtn);
        }
        
        // 페이지 번호들
        for (let i = paginationData.startPage; i <= paginationData.endPage; i++) {
            const pageBtn = document.createElement('div');
            pageBtn.className = 'page-item' + (i === paginationData.currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', function() {
                loadVisitData(i);
            });
            container.appendChild(pageBtn);
        }
        
        // 다음 페이지 버튼
        if (paginationData.currentPage < paginationData.totalPages) {
            const nextBtn = document.createElement('div');
            nextBtn.className = 'page-item';
            nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
            nextBtn.addEventListener('click', function() {
                loadVisitData(paginationData.currentPage + 1);
            });
            container.appendChild(nextBtn);
        }
    }

    // 초기 데이터 로드 (실제 구현시 주석 해제)
    // loadVisitData();

});