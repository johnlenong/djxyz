function getQueryParam(param) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

const query = getQueryParam('q');

if (query) {
	const searchInput = document.getElementById('search-input');
	searchInput.value = query;
	$('#results').html(`<div style="width:100%;text-align:center">You want searching ${query}, right ? Just click the button to see results.</div>`);
}


$(document).ready(function() {
	let jsonData = [];

	const jsonUrls = [];

	fetch('/db/main.json')
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json(); // Mengonversi ke JSON
		})
		.then(data => {
			// Ambil data dari title array dalam db.json
			const titles = data.filmTitles;

			// Iterasi melalui array title dan membangun URL
			for (let i = 0; i < titles.length; i++) {
				const newUrl = `https://cdn.jsdelivr.net/gh/johnlenong/djxyz@main/db/post/${titles[i].replace("~","~SUB-")}.json`;
				jsonUrls.push(newUrl);
			}



			function getFileNameFromUrl(url) {
				return url.split('/').pop();
			}

			$.when(
				...jsonUrls.map(url => $.getJSON(url))
			).done(function(...responses) {
				responses.forEach((response, index) => {
					const fileName = getFileNameFromUrl(jsonUrls[index]);
					jsonData.push({
						data: response[0],
						source: fileName
					});
				});
			}).fail(function() {
				$('#results').html('<p style="color: red;">Failed to fetch one or more JSON files. Please try again later.</p>');
			});

			$('#search-form').submit(function(event) {
				event.preventDefault();

				const query = $('#search-input').val().toLowerCase().trim();
				const resultsDiv = $('#results');

				resultsDiv.empty();

				if (!query) {
					resultsDiv.html('<p>Please enter a search term.</p>');
					return;
				}

				let foundResults = false;
				jsonData.forEach(item => {
					const data = item.data;
					const subtt = data.alp.s;
					const sub = subtt === 'id' ? 'Sub Indonesia' : subtt === 'en' ? 'Sub English' : subtt === 'RAW' ? '-' : undefined;
					const title = data.alp.t.toLowerCase();
					const authors = data.alp.a.map(author => author.toLowerCase());
					const categories = data.alp.c.map(category => category.toLowerCase());
					const fileName = item.source.toLowerCase();
					const subtitleId = data.alp.s.toLowerCase();

					if (
						title.includes(query) ||
						authors.some(author => author.includes(query)) ||
						categories.some(category => category.includes(query)) ||
						fileName.includes(query) ||
						(subtitleId + '_subbed') === (query.toLowerCase())
					) {
						foundResults = true;

						const resultHtml = `
              <div class="result-item"> 
			  <h3><a href="watch?v=${item.source.split(".")[0]}">${item.source.split("~")[0]} | ${data.alp.t}</a></h3>
			  <span class="${subtitleId}-subbed"><i class="fa-regular fa-closed-captioning"></i> <a href="search?q=${subtitleId}_subbed">${sub}</a></span>
			  <br />
			  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsE${data.alp.p[0]}/s1600-rw/Thumb.webp" alt="Cover ${item.source.split("~")[0]}" title="${item.source.split("~")[0]} ${sub}" onclick="window.location.href='watch?v=${item.source.split(".")[0]}';" />
			  <br />
			  <span>Actress: <i class="fa-regular fa-user"></i> ${data.alp.a.join(", ")}</span>
              </div>
            `;
						resultsDiv.append(resultHtml);
					}
				});

				if (!foundResults) {
					resultsDiv.html('<p>No results found for your search.</p>');
				}
			});

		});

});
