function setMetaTag(property, content) {
    let metaTag = document.querySelector(`meta[${property}]`);
    
    if (metaTag) {
        metaTag.setAttribute('content', content);
    } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute(property.includes('property') ? 'property' : 'name', property.split('=')[1].replace(/['" ]/g, ''));
        metaTag.setAttribute('content', content);
        document.head.appendChild(metaTag);
    }
}

function setJsonLd(datald) {
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    
    if (scriptTag) {
        scriptTag.textContent = JSON.stringify(datald, null, 2);
    } else {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.textContent = JSON.stringify(datald, null, 2);
        document.head.appendChild(scriptTag);
    }
}

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
			
			setMetaTag("property='og:description'", title);
			setMetaTag("property='twitter:description'", title);
			setMetaTag("name='description'", title);
				
			const canonicalLink = document.createElement("link");
				canonicalLink.rel = "canonical";
				canonicalLink.href = `${url}${posts}`; 
			document.head.appendChild(canonicalLink);

			code.innerHTML = `${idcd}`;
			sdh3.innerHTML = `PartList <i class="fa-solid fa-table-list"></i> ${idcd}`;
			side.innerHTML = `<ul id="partList"></ul>`;
			desc.innerHTML = `
				  <h3><i class="fa-regular fa-circle-play"></i> <a href="${posts}">${idcd} | ${title}</a></h3>
					  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[0]}/s1600-rw/${idcd}.webp" alt="${idcd}" />
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
				$('#partList').append(`<li><a href="${posts}&p=${i}"><img alt="${idcd} Part-${i}" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[i]}/w600-h350-c-rw/${idcd}_part-${i}.webp" /><span><i class="fa-solid fa-pizza-slice"></i> Part  ${i} </span></a></li>`);
			}

			if (!part) {
				const imageContent = `https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[0]}/s1600-rw/${idcd}.webp`;
				
				vply.innerHTML = `<img src="${imageContent}" alt="${idcd}" title="${idcd} ${sub}" onclick="window.location.href='${posts}&p=1';" /><button class="play-button" id="playButton">▶</button>`;
				const playButton = document.getElementById('playButton');
				playButton.addEventListener('click', () => {
					window.location = `${posts}&p=1`;
				});
				prevNextContainer.style.display = 'none';
				
				setMetaTag("name='title'", `Watch ${idcd} ${sub} - DriveJAV`);
				setMetaTag("property='og:title'", `Watch ${idcd} ${sub} - DriveJAV`);
				setMetaTag("property='twitter:title'", `Watch ${idcd} ${sub} - DriveJAV`);

				setMetaTag("property='og:url'", url+posts);
				setMetaTag("property='twitter:url'", url+posts);

				setMetaTag("property='og:image'", imageContent);
				setMetaTag("property='twitter:image'", imageContent);
				
				// JSON-LD data
				const jsonLdData = {
					"@context": "https://schema.org",
					"@type": "WebSite",
					"name": `${idcd} ${sub}`,
					"url": url+posts,
					"description": title,
					"image": imageContent					
				};

				setJsonLd(jsonLdData);

			} else {
				
				const imageContent = `https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${pictr[part]}/s1600-rw/${idcd}_part-${part}.webp`;

				setMetaTag("name='title'", `Watch ${idcd} Part-${part} ${sub}`);
				setMetaTag("property='og:title'", `Watch ${idcd} Part-${part} ${sub}`);
				setMetaTag("property='twitter:title'", `Watch ${idcd} Part-${part} ${sub}`);

				setMetaTag("property='og:url'", `${url}${posts}&p=${part}`);
				setMetaTag("property='twitter:url'", `${url}${posts}&p=${part}`);

				setMetaTag("property='og:image'", imageContent);
				setMetaTag("property='twitter:image'", imageContent);
				
				// JSON-LD data
				const jsonLdData = {
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "WebSite",
							"name": `Watch ${idcd} ${sub} - DriveJAV`,
							"url": `${url}${posts}`,
							"description": title,
							"image": imageContent,
							"mainEntity": {
								"@type": "CreativeWork",
								"name": `Watch ${idcd} Part-${part} ${sub}`,
								"identifier": `${idcd}~SUB-${data.alp.s}&p=${part}`,
								"description": title,
								"url": `${url}${posts}&p=${part}`,
								"image": imageContent,
								"partOfSeries": {
									"@type": "TVSeries",
									"name": `${idcd} ${sub}`
								}
							}
						},
						{
							"@type": "VideoObject",
							"name": `${idcd} ${sub} Part-${part}`,
							"description": title,
							"thumbnailUrl": imageContent,
							"uploadDate": "2024-02-10T08:00:00+00:00",
							"duration": "PT20M30S",
							"embedUrl": `https://www.blogger.com/video.g?token=AD6v5d${video[part-1]}`,
							"url": `${url}${posts}&p=${part}`,
							"partOfSeries": {
								"@type": "CreativeWorkSeries",
								"name": `${idcd} ${sub}`
							},
							"publisher": {
								"@type": "Organization",
								"name": "DriveJAV",
								"logo": {
									"@type": "ImageObject",
									"url": "https://drivejav.xyz/icon/apple-touch-icon.png"
								}
							}
						},
						{
							"@type": "ImageObject",
							"name": `${idcd} Part-${part}`,
							"contentUrl": imageContent.replace(/-rw.*/, `-rp/${idcd}_part-${part}.png`),
							"thumbnail": imageContent.replace("/s16","/s6"),
							"caption": `${idcd} ${sub} - DriveJAV`,
							"author": {
								"@type": "Person",
								"name": `${data.alp.a[0]}`
							},
							"keywords": `${idcd}, ${idcd} ${sub}, ${data.alp.a.map((actr) => actr).join(", ")}`
						}
					]	
				};

				setJsonLd(jsonLdData);
				
				var numbr = `${part.replace(/#.*$/, "")}`;
				vply.innerHTML = `<iframe title="${idcd} Part-${part} ${sub}" id="videoframe" allowfullscreen="" src="https://www.blogger.com/video.g?token=AD6v5d${video[numbr-1]}"></iframe>`;
				var currentPage = part;
				var nextzPages = ++currentPage;
				var totalPages = video.length;
				let htmlContent = "";
				if (part > 1) {
					htmlContent += `<a aria-label="Part ${part - 1}" href="${posts}&p=${part - 1}" class="prev"> <i class="fas fa-chevron-left"></i> </a>`;
				} else {
					htmlContent += `<span></span>`;
				}
				htmlContent += `<span class="current-page">Part ${part}</span>`;
				if (part < totalPages) {
					htmlContent += `<a aria-label="Part ${nextzPages}" href="${posts}&p=${nextzPages}" class="next"> <i class="fas fa-chevron-right"></i> </a>`;
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
