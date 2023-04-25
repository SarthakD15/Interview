// Show article ,edit article,delete article
const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const check  = require('../middleware/authMiddleware')

router.get('/dashboard',check.requireAuth,async(req,res)=>{
    const articles = await Article.find().sort({createdAt: 'desc'});
    res.render('articles/index',{articles: articles});
})

router.get('/new',(req,res)=>{
    res.render('articles/new',{article: new Article()});
})


router.get('/edit/:id',check.requireAuth,async(req,res)=>{
    const article = await Article.findById(req.params.id);
    res.render('articles/edit',{article: article});
})

router.get('/:slug',check.requireAuth,async (req,res)=>{
    const article = await  Article.findOne({ slug:req.params.slug })
    if(article == null)
    {
        res.redirect('/')
    
    }
       res.render('articles/show',{article:article});
})

router.post('/',async (req,res,next)=>{
    req.article = new Article();
    next();
},saveArticleAndRedirect('new'))

router.put('/:id',async (req,res,next)=>{
    req.article = await  Article.findById(req.params.id);
    next();
},saveArticleAndRedirect('edit'))


router.delete('/:id',check.requireAuth,async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})



function saveArticleAndRedirect(path){
    return async(req,res)=>{
        let article = req.article
            article.name = req.body.name;
            article.phoneno = req.body.phoneno;
            article.title = req.body.title
            article.description = req.body.description
            article.company = req.body.company
        
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`);
        }catch(e){
            res.render(`articles/new/${path}`,{article:article});
        }
    }
}
module.exports = router;