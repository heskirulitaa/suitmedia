document.addEventListener("DOMContentLoaded", () => {
    // Mengambil nilai current page 
    let currentPage = localStorage.getItem('currentPage') || 1;
    let itemsPerPage = localStorage.getItem('itemsPerPage') || 10;
    let sort = localStorage.getItem('sort') || "-published_at";

    // Elemen DOM untuk konten dan kontrol
    const postsContainer = document.getElementById("postsContainer");
    const paginationContainer = document.getElementById("paginationContainer");
    const itemsPerPageSelect = document.getElementById("show-per-page");
    const sortSelect = document.getElementById("sort-by");
    const itemStatus = document.getElementById("item-status");
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    // See or Hide Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const st = window.pageYOffset || document.documentElement.scrollTop;

        if (st > lastScrollTop) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    });

    itemsPerPageSelect.value = itemsPerPage;
    sortSelect.value = sort;

    // Mengambil data artikel dari API
    function fetchData() {
        const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${currentPage}&page[size]=${itemsPerPage}&append[]=small_image&append[]=medium_image&sort=${sort}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                renderPosts(data.items);
                renderPagination(data.meta);
                itemStatus.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, data.meta.total)} of ${data.meta.total}`;
            });
    }

    // Render kartu dari data API
    function renderPosts(posts) {
        postsContainer.innerHTML = posts.map(post => `
            <div class="card">
                <img src="${post.small_image}" alt="${post.title}">
                <div class="card-content">
                    <span>${new Date(post.published_at).toLocaleDateString()}</span>
                    <h3>${post.title}</h3>
                </div>
            </div>
        `).join("");
    }

    // Render pagination berdasar metadata dari API
    function renderPagination(meta) {
        paginationContainer.innerHTML = "";
        for (let i = 1; i <= meta.total_pages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.toggle("active", i == currentPage);
            button.addEventListener("click", () => {
                currentPage = i;
                localStorage.setItem('currentPage', currentPage);
                fetchData();
            });
            paginationContainer.appendChild(button);
        }
    }

    // Mengubah jml artikel per halaman
    itemsPerPageSelect.addEventListener("change", (event) => {
        itemsPerPage = event.target.value;
        localStorage.setItem('itemsPerPage', itemsPerPage);
        fetchData();
    });

    // Mengubah urutan artikel
    sortSelect.addEventListener("change", (event) => {
        sort = event.target.value;
        localStorage.setItem('sort', sort);
        fetchData();
    });

    fetchData();
});
