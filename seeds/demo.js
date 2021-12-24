const sanitizeHtml = require('sanitize-html');
const html = "<script>alert('hello world')</script>";
function clean(x){
    try {
        const text = sanitizeHtml(x)
        if(text === '') throw new Error
    } catch (error) {
        console.log(error)
    }
    };
console.log(sanitizeHtml(html));

console.log(sanitizeHtml("<img src=x onerror=alert('img') />"));
console.log(sanitizeHtml("console.log('hello world')",{
    allowedTags:false,
allowedAttributes: false
}));
clean("<script>alert('hello world')</script>");
console.log('after')