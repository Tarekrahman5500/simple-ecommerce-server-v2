import Page from '../../models/page'

exports.createPage = async (req, res, next) => {
    try {
        const {banners, products} = req.files;
          console.log(req.body)
        if (banners && banners.length > 0) {
            req.body.banners = banners.map((banner, index) => ({
                img: banner.path,
                navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
            }))
        }
        if (products && products.length > 0) {
            req.body.products = products.map((product, index) => ({
                img: product.path,
                navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
            }));
        }
        req.body.createdBy = req.user._id;
        const page = await Page.findOne({category: req.body.category})
        if (page) {
            const newPage = await Page.findOneAndUpdate({category: req.body.category}, req.body)
            if (newPage) {
                 console.log(newPage)
                return res.status(201).json({page: newPage});
            }
        } else {
            const page = new Page(req.body);
            const newPage = await page.save()
            console.log(newPage)
            if (newPage) return res.status(201).json({page});

        }

    } catch (err) {
        next(err)
    }

}