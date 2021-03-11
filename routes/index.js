var express = require('express');
var router = express.Router();
const cheerio = require('cheerio');
const url = "https://manganelo.com/"
/* GET home page. */
router.get('/', function(req, res, next) {
	return res.json({
		message :'Success'
	})
});

router.get('/manga', (req,res ) => {
		try {
				const $ = cheerio.load(url);
				return res.json({
					message: $
				});
		} catch (error) {
				res.send({
					message: error.message
				})
		}
});
module.exports = router;
