    function toggleMenu() {
    	const menuOverlay = document.getElementById('menuOverlay');
    	menuOverlay.classList.toggle('active');
    }

    function openSearchPage() {
    	window.location.href = '/search';
    }
    var part = getParameterByName('p');
    var code = document.querySelector('.logo');
    var side = document.querySelector('.lists');
    var sdh3 = document.querySelector('.sidebar-h3');
    var vply = document.querySelector('.video-player');
    var desc = document.querySelector('.video-description');

    if (vValue) {
    	var idcd = `${vValue.split('~SUB')[0].toUpperCase()}`;
    	var prevNextContainer = document.querySelector(".prevnext");
    	$.getJSON('https://cdn.jsdelivr.net/gh/johnlenong/djxyz@main/db/post/' + vValue.split('#')[0].toUpperCase() + '.json', function(data) {
    			const url = data.alp.o;
    			const title = data.alp.t;
    			const subtt = data.alp.s;
    			const sub = subtt === 'id' ? 'Sub Indonesia' : subtt === 'en' ? 'Sub English' : subtt === 'RAW' ? '-' : undefined;
    			const tagActress = data.alp.a.map((actr) => `<a href="search?q=${actr}">${actr}</a>`).join(", ");
    			const genre = data.alp.c.map((ctgr) => `<a href="search?q=${ctgr}">${ctgr}</a>`).join(", ");
    			//const genre = data.alp.c.join(', ');
    			const pictr = data.alp.p;
    			const video = data.alp.v;
    			const posts = `watch?v=${idcd}~SUB-${data.alp.s}`;

    			code.innerHTML = `${idcd}`;
    			sdh3.innerHTML = `PartList <i class="fa-solid fa-table-list"></i> ${idcd}`;
    			side.innerHTML = `<ul id="partList"></ul>`;
    			desc.innerHTML = `
					  <h3><i class="fa-regular fa-circle-play"></i> <a href="${posts}">${idcd} | ${title}</a></h3>
       					  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[0]}/s1600-rw/thumb.webp" alt="Cover" />
					  <table>
					    <caption><h4><i class="fa-solid fa-circle-info"></i> Information</h4></caption>
					    <tr>
					      <td>Part</td>
					      <td>: </td>
					      <td><i class="fa-solid fa-clapperboard"></i> </td>
					      <td>${(!part || part === null) ? '0' : part} / ${video.length}</td>
					    </tr>
					    <tr>
					      <td>Translation</td>
					      <td>: </td>
					      <td><i class="fa-regular fa-closed-captioning"></i> </td>
					      <td><a href="search?q=${subtt}_subbed">${sub}</a></td>
					    </tr>
					    <tr>
					      <td>Actress</td>
					      <td>: </td>
					      <td><i class="fa-regular fa-user"></i> </td>
					      <td>${tagActress}</td>
					    </tr>
					    <tr>
					      <td>Category</td>
					      <td>: </td>
					      <td><i class="fa-solid fa-tags"></i> </td>
					      <td>${genre}</td>
					    </tr>
					  </table>
					`;

    			for (let i = 1; i < pictr.length; i++) {
    				$('#partList').append(`<li><a href="${posts}&p=${i}"><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[i]}/w360-h210-c-rw/thumb.webp" /><span><i class="fa-solid fa-pizza-slice"></i> Part  ${i} </span></a></li>`);
    			}

    			if (!part) {
    				vply.innerHTML = `<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[0]}/s1600-rw/thumb.webp" alt="${idcd}" title="${idcd}" onclick="window.location.href='${posts}&p=1';" /><button class="play-button" id="playButton">▶</button>`;
    				const playButton = document.getElementById('playButton');
    				playButton.addEventListener('click', () => {
    					window.location = `${posts}&p=1`;
    				});
    				prevNextContainer.style.display = 'none';
    			} else {
    				var numbr = `${part.toUpperCase().split('#')[0]}`;
    				vply.innerHTML = `<iframe id="videoframe" allowfullscreen="" src="https://www.blogger.com/video.g?token=AD6v5d${video[numbr-1]}"></iframe>`;
    				var currentPage = part;
    				var nextzPages = ++currentPage;
    				var totalPages = video.length;
    				let htmlContent = "";
    				if (part > 1) {
    					htmlContent += `<a href="${posts}&p=${part - 1}" class="prev"> <i class="fas fa-chevron-left"></i> </a>`;
    				} else {
    					htmlContent += `<span></span>`;
    				}
    				htmlContent += `<span class="current-page">Part ${part}</span>`;
    				if (part < totalPages) {
    					htmlContent += `<a href="${posts}&p=${nextzPages}" class="next"> <i class="fas fa-chevron-right"></i> </a>`;
    				} else {
    					htmlContent += `<span></span>`;
    				}
    				prevNextContainer.innerHTML = htmlContent;
    				if (part == 0 || part > totalPages) {
    					window.location = `${posts}`;
    				}
    			}
    		})
    		.fail(function() {
    			document.body.style.opacity = "0";
    			window.location = '/404';
    		});
    } else {
    	document.body.style.opacity = "0";
    	window.location = '//drivejav.xyz';
    }
