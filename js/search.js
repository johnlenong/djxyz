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
			return response.json(); 
		})
		.then(data => {
			const titles = data.filmTitles;

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
			});

			$('#search-form').submit(function(event) {
				event.preventDefault();

				const query = $('#search-input').val().toLowerCase().trim();
				const resultsDiv = $('#results');

				resultsDiv.empty();

				if (!query) {
					resultsDiv.html('<div style="width:100%;text-align:center">Please enter a search term.</div>');
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
					resultsDiv.html('<div style="width:100%;text-align:center">No results found for your search.</div>');
				}
			});

		});

});
