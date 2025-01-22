      let deferredPrompt;

      window.addEventListener('beforeinstallprompt', (event) => {
      	event.preventDefault();
      	deferredPrompt = event;
      	const installPrompt = document.getElementById('installPrompt');
      	installPrompt.style.display = 'block';
      	let topNavbar = document.getElementById('navbar');
	topNavbar.style.marginTop = '85px';

      	const installButton = document.getElementById('installPWA');
      	installButton.addEventListener('click', async () => {
      		if (deferredPrompt) {
      			deferredPrompt.prompt();
      			const choiceResult = await deferredPrompt.userChoice;
      			console.log('User choice:', choiceResult.outcome);
      			deferredPrompt = null;
      		}
      		installPrompt.style.display = 'none';
      		topNavbar.style.marginTop = 'unset';
      	});

      	const closeButton = document.getElementById('closePrompt');
      	closeButton.addEventListener('click', () => {
      		installPrompt.style.display = 'none';
      		topNavbar.style.marginTop = 'unset';
      	});
      });

      window.addEventListener('appinstalled', () => {
      	console.log('PWA installed');
      });

      function toggleMenu() {
      	const menuOverlay = document.getElementById('menuOverlay');
      	menuOverlay.classList.toggle('active');
      }

      function openSearchPage() {
      	window.location.href = '/search';
      }
      const dataUrl = 'https://drivejav.xyz/db/main.json';
      const itemsPerPage = 10;
      let currentPage = 1;
      let data = [];
      // Fetch JSON data
      async function fetchData() {
      	const response = await fetch(dataUrl);
      	const jsonData = await response.json();
      	data = jsonData.filmTitles;
      	renderContent();
      	renderPagination();
      }
      // Render content dynamically
      async function renderContent() {
      	const container = document.getElementById('content');
      	container.innerHTML = '';
      	const start = (currentPage - 1) * itemsPerPage;
      	const end = start + itemsPerPage;
      	const currentItems = data.slice(start, end);
      	for (let i = 0; i < currentItems.length; i++) {
      		const item = currentItems[i].replace("~", "~SUB-");
      		const url = `https://cdn.jsdelivr.net/gh/johnlenong/djxyz@main/db/post/${item}.json`;
      		try {
      			const result = await $.getJSON(url);
      			const subtt = result.alp.s;
      			const sub = subtt === 'id' ? 'Sub Indonesia' : subtt === 'en' ? 'Sub English' : subtt === 'RAW' ? '-' : undefined;
      			const tagActress = result.alp.a.map((actr) => `
			<a href="search?q=${actr}">${actr}</a>`).join(", ");
      			const genre = result.alp.c.map((ctgr) => `
			<a href="search?q=${ctgr}">${ctgr}</a>`).join(", ");
      			const subtitleId = result.alp.s.toLowerCase();
      			const card = document.createElement('div');
      			card.classList.add('card');
      			card.innerHTML = `	
			<h3>
				<a href="watch?v=${item}">${currentItems[i].split("~")[0]} | ${result.alp.t}</a>
			</h3>
			<span class="${subtitleId}-subbed">
				<i class="fa-regular fa-closed-captioning"></i>
				<a href="search?q=${subtitleId}_subbed">${sub}</a>
			</span>
			<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${result.alp.p[0]}/s1600-rw/Thumb.webp" alt="${currentItems[i].split("~")[0]} ${sub}" title="${currentItems[i].split("~")[0]} ${sub}" onclick="window.location.href='watch?v=${item}';" />
			<table>
				<tr>
					<td>
						<i class="fa-regular fa-user"></i>
					</td>
					<td> ${tagActress}</td>
				</tr>
				<tr>
					<td>
						<i class="fa-solid fa-tags"></i>
					</td>
					<td> ${genre}</td>
				</tr>
			</table>
										
					`;
      			container.appendChild(card);
      		} catch (error) {
      			console.error(`Error fetching data from ${url}:`, error);
      		}
      	}
      }
      // Render pagination buttons with max 6 buttons and ellipsis
      function renderPagination() {
      	const pagination = document.getElementById('pagination');
      	pagination.innerHTML = '';
      	const totalPages = Math.ceil(data.length / itemsPerPage);
      	const maxButtons = 6;
      	let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
      	let endPage = Math.min(startPage + maxButtons - 1, totalPages);
      	if (endPage - startPage + 1 < maxButtons) {
      		startPage = Math.max(endPage - maxButtons + 1, 1);
      	}
      	if (startPage > 1) {
      		addPaginationButton(pagination, 1);
      		if (startPage > 2) {
      			addEllipsis(pagination);
      		}
      	}
      	for (let i = startPage; i <= endPage; i++) {
      		addPaginationButton(pagination, i);
      	}
      	if (endPage < totalPages) {
      		if (endPage < totalPages - 1) {
      			addEllipsis(pagination);
      		}
      		addPaginationButton(pagination, totalPages);
      	}
      }

      function addPaginationButton(container, page) {
      	const button = document.createElement('button');
      	button.textContent = page;
      	button.classList.toggle('active', page === currentPage);
      	button.addEventListener('click', () => {
      		currentPage = page;
      		renderContent();
      		renderPagination();
      	});
      	container.appendChild(button);
      }

      function addEllipsis(container) {
      	const ellipsis = document.createElement('span');
      	ellipsis.textContent = ' < i class = "fa-solid fa-ellipsis" > < /i>';
      	ellipsis.style.margin = '0 5px';
      	container.appendChild(ellipsis);
      }
      fetchData();
