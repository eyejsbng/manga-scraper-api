var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio')
const url = "http://manga-panda.xyz/"


/* GET All Manga from latest . */

router.get('/manga/latest/', (req,res) => {
	try {
		const latest = []
		let total = 0;
		rp(url).then((html) => {
			let thumbnail,author, name,description, link,viewsCount, dateUpdated, latestChapter, latestChapterLink;
			const latestManga = $('.itemupdate', html);

			latestManga.each((index, el) => {
				thumbnail = $(el).find('img').attr('src');
				name = $(el).find('a').attr('title');
				link = $(el).find('a').attr('href');	
				latestChapter = $(el).find('li:nth-child(2) > span > a').text().trim();
				latest.push({
					thumbnail,
					name,
					link,
					latestChapter,
				});
			});
			return res.json({
				data: latest,
			})
		});
	} catch (error) {

	}
});
router.get('/manga/latest/:pagenumber', (req,res) => {
	try {
		const pageNumber = req.params.pagenumber;
		const latest = []
		let total = 0;
		
		rp(url + 'genre-all/' + pageNumber).then((html) => {
			let thumbnail,author, name,description, link,viewsCount, dateUpdated, latestChapter, latestChapterLink;
			const latestManga = $('.content-genres-item', html);
		
			latestManga.each((index, el) => {
				thumbnail = $(el).find('img').attr('src');
				name = $(el).find('.genres-item-info > h3').text().trim();
				description = $(el).find('.genres-item-description').text().trim();
				dateUpdated = $(el).find('.genres-item-view-time > .genres-item-time').text().trim();
				viewsCount = $(el).find('.genres-item-view-time > .genres-item-view').text().trim();
				author = $(el).find('.genres-item-view-time > .genres-item-author').text().trim();
				link = $(el).find('.genres-item-info > h3 > a').attr('href');
				latestChapterLink = $(el).find('.genres-item-info > .genres-item-chap').attr('href');
				latestChapter = $(el).find('.genres-item-info > .genres-item-chap').text().trim();
				latest.push({
					thumbnail,
					name,
					description,
					dateUpdated,
					author,
					link,
					latestChapter,
					latestChapterLink,
					viewsCount
				});
				
			});
			return res.json({
				page : pageNumber,
			
				data: latest,
			})
		});

		
	} catch (error) {
		
	}
});
/** GET TOP WEEKS MANGA */
router.get('/manga/top', (req,res ) => {
		try {
			const topWeek = []
				rp(url).then((html) => {

					let name, thumbnail, link, latestChapter;
					const elementImage = $('.item', html);
					console.log(elementImage);
					elementImage.each((index, el) => {
						
						thumbnail = $(el).find('a > img').attr('src');
						name = $(el).find('a').attr('title')
						link = $(el).find('a').attr('href');
						latestChapter = $(el).find('.slide-caption > h3 > a').text().trim();	
						topWeek.push({
							thumbnail,
							name,
							link,
							latestChapter
						})

					});	
			
					return res.json({
						data: topWeek
					})
				});
		} catch (error) {
				res.send({
					message: error.message
				})
		}
});

/** GET SEARCH MANGA */
router.get('/manga/search/:slug', (req, res) => {
	const slug = req.params.slug;
	const searchUrl = url + 'search?q=' + slug;
	try {
		const searchResult = [];
		rp(searchUrl).then((html) => {
			let thumbnail, name, link, dateUpdated, latestChapter, latestChapterLink;
			const result = $('.list-truyen-item-wrap', html);
			console.log(result);
			result.each((index, el) => {
				name = $(el).find('a').attr('title');
				thumbnail = $(el).find('a > img').attr('src');
				link = $(el).find('a').attr('href');
				latestChapter = $(el).find('a:nth-child(3)').first().text();
				latestChapterLink = $(el).find('a:nth-child(3)').attr('href');
				searchResult.push({
					name,
					thumbnail,
					link,
					latestChapter,
					latestChapterLink
				})
			});
			return res.json({
				data: searchResult
			})
		})
	} catch (error) {
		
	}
});

router.get('/manga/search/:slug/:pagenumber', (req, res) => {
		const slug = req.params.slug;
		const pageNumber = req.params.pagenumber;
		const searchUrl = url + 'search/story/' + slug + '?page=' + pageNumber;

		try {
			const searchResult = [];
	
			rp(searchUrl).then((html) => {
				let thumbnail, name, link, dateUpdated, latestChapter, latestChapterLink;
				const result = $('.search-story-item', html);
				result.each((index, el) => {
					name = $(el).find('.item-right > h3').text().trim();
					thumbnail = $(el).find('img').attr('src');
					link = $(el).find('a').attr('href');
					latestChapter = $(el).find('.item-right > .item-chapter').first().text();
					latestChapterLink = $(el).find('.item-right > .item-chapter').attr('href');
					searchResult.push({
						name,
						thumbnail,
						link,
						latestChapter,
						latestChapterLink
					});
				});
				return res.json({
					data: searchResult
				})
			})
		} catch (error) {
			
		}

});

router.get('/manga/:slug', (req, res) => {
	const mangaLink = req.params.slug;
	try {
		const obj = {};
		const mangaDetails = [];
		const mangaChapters = [];
		let title, author, status, alternativeName, dateUpdated, viewCount, thumbnail,description;
		let mangaGenres = [];
		
		rp(url + 'manga/' +mangaLink).then((html) => {
			let chapter, view, dateUploaded, link;
			obj.title = $('.manga-info-text > li',html).find('h1').text().trim();
			obj.thumbnail = $('div.manga-info-top > div', html).find('img').attr('src');
			obj.alternativeName = $('.manga-info-text > li:nth-child(1)', html).find('span').text().trim();
			status = $('div.manga-info-top > ul > li:nth-child(3)', html).text().trim().split(':');
			author = $('div.manga-info-top > ul > li:nth-child(2)', html).text().trim().split(':');
			description = $('#noidungm', html).text().split(':');
			obj.status = status[1];
			obj.description = description[1]; 
			obj.author = author[1];
			
			$('.chapter-list > .row', html).each((i, el) => {
				let chapterText = $(el).find('a').text().trim().split(" ");
				chapter = chapterText[chapterText.length - 1];
				let link = $(el).find('a').attr('href');
				
				mangaChapters.push({
					chapter,
					link,
					
				})
			})
			obj.chapters = mangaChapters
		
			return res.json(obj)
		})
	} catch(error) {

	}

});
module.exports = router;
