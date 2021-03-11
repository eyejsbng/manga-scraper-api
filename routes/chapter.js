var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const url = "http://manga-panda.xyz/"

router.get('/:chapterNumber', (req, res) => {

	const chapterNumber = req.params.chapterNumber;
	const chapterUrl = url + chapterNumber;
	try {
		const images = [];
		let title = '';
		rp(chapterUrl).then((html) => {
		
			let data = $('#arraydata',html).text().trim().split(",")
			title = $('h1', html).text();
			console.log(data);
			$('#imgs',html).each((i, e) => {
				console.log(i+=1);
				let image = $(e).find('img').attr('data-cfsrc')
		
				images.push({
					image
				})
			})
			console.log(images)
			return res.json({
				title: title,
				data: data
			})
		})
	
	} catch(error) {

	}
});

router.get('/sample', (req, res) => {
	const url = 'http://manga-panda.xyz/nido-tensei-shita-shounen-wa-s-rank-boukensha-toshite-heion-ni-sugosu-zense-ga-kenja-de-eiyuu-datta-boku-wa-raisede-wa-jimini-ikiru-chapter-17'
	
	try {
		const images = [];
		let title = '';
		rp(url).then((html) => {
		
			let data = $('#arraydata',html).text().trim().split(",")
			title = $('h1', html).text();
			console.log(data);
			$('#imgs',html).each((i, e) => {
				console.log(i+=1);
				let image = $(e).find('img').attr('data-cfsrc')
		
				images.push({
					image
				})
			})
			console.log(images)
			return res.json({
				title: title,
				data: data
			})
		})
	
	} catch(error) {

	}
});

module.exports = router;