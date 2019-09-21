const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();

app.use(koaBody());

let lastId = 0;
let articles = [];

router
    .post('/article', ctx => {
        // 把資料分別存在 title、body、author 等變數
        const { title } = ctx.request.body;
        const { body } = ctx.request.body;
        const { author } = ctx.request.body;
        
        if (title && body && author) {
            // 如果必填資料都有，就塞進 articles 裡面。然後依照文件回傳 201
            articles.push({
                id: ++lastId,
                title,
                body,
                author,
                time: new Date(),
            });
            ctx.status = 201;
            ctx.body = lastId;
        } else {
            // 如果有欄位沒有填，就依照文件回傳 400
            ctx.status = 400;
        }
    })
    .put('/article/:id', ctx => {
        // 把資料分別存在 id、title、body、author 等變數
        const id = parseInt(ctx.params.id);
        const { title } = ctx.request.body;
        const { body } = ctx.request.body;
        const { author } = ctx.request.body;
        
        if (title && body && author) {
            // 如果必填資料都有，就編輯文章
            // 首先找出文章
            const article = articles.find(x => x.id === id);
            
            if (article) {
                // 如果有文章的話就編輯，並依照文件回傳 204
                article.title = title;
                article.body = body;
                article.author = author;
                article.time = new Date();
                ctx.status = 204;
            } else {
                // 沒有找到的話就依照文件回傳 404
                ctx.status = 404;
            }
        } else {
            // 如果有欄位沒有填，就依照文件回傳 400
            ctx.status = 400;
        }       
    })
    .get('/article/:id', ctx => {
        // 把資料分別存在 id 變數
        const id = parseInt(ctx.params.id);
        
        if (id) {
            // 首先找出文章
            const article = articles.find(x => x.id === id);
            
            if (article) {
                // 如果有文章的話就依照文件回傳文章內容（預設就是狀態 200）
                ctx.body = article;
            } else {
                // 沒有找到的話就依照文件回傳 404
                ctx.status = 404;
            }
        } else {
            // 如果沒送 id，文章就不存在，就依照文件回傳 404
            ctx.status = 404;
        }
    })
    .delete('/article/:id', ctx => {
        // 把資料分別存在 id 變數
        const id = parseInt(ctx.params.id);
            
        if (id) {
            // 首先找出文章
            const article = articles.find(x => x.id === id);
            
            if (article) {
                // 如果有文章的話就刪除文章，然後依照文件回傳 204
                articles = articles.filter(x => x.id !== id);
                ctx.status = 204;
            } else {
                // 沒有找到的話就依照文件回傳 404
                ctx.status = 404;
            }
        } else {
            // 如果沒送 id，文章就不存在，就依照文件回傳 404
            ctx.status = 404;
        }    
    });

app.use(router.routes());
app.listen(3000);
