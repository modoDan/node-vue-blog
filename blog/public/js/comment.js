/* 
 *Created by modo on 2019/01/09.
 */
let prepage = 2;
let page = 1;
let pages = 0;
let comments = [];
$('#messageBtn').on('click', () => {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: (res) => {
            $('#messageContent').val('');
            if(!res.code){
	            comments = res.data.comments.reverse();
	            renderComment();
        	}
        }
    })
})
//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: (res) => {
    	if(!res.code){
    		comments = res.data.reverse();
        	renderComment();
    	}
    }
})
$('.pager').on("click", "a", function(event){
	if($(this).parent().hasClass('previous')){
		page--;
	}else{
		page++;
	}
	renderComment()
})
function renderComment() {
	let len = comments.length;
	$('#messageCount').html(len);
	pages = Math.max(Math.ceil(len/prepage),1);
	let start = Math.max(0,(page - 1)*prepage);
	let end = Math.min(start + prepage,len);
	let $lis = $('.pager li');
	$lis.eq(1).html(`${page}/${pages}`);

	if(page <= 1){
		page = 1;
		$lis.eq(0).html(`<span>没有上一页了</span>`);
	}else{
		$lis.eq(0).html(`<a>上一页</a>`);
	}
	if(page >= pages){
		page = pages;
		$lis.eq(2).html(`<span>没有下一页了</span>`);
	}else{
		$lis.eq(2).html(`<a>下一页</a>`);
	}
	let html = ``;
	if(!len){
		html = `<p>还没有评论！</p>`
	}else{
    	for (let i = start; i < end; i++) {
	        html += `<div class="messageBox">
	                <p class="name">
	                    <span>
	                        ${comments[i].username}
	                    </span>
	                    <span>
	                         ${formatDate(comments[i].postTime)}
	                    </span>
	                </p>
	                <p class="comments">
	                     ${comments[i].content}
	                </p></div>`
	    }
	}
    $('.messageList').html(html);
}

function formatDate(d){
	let date = new Date(d);
	let date1 = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	return date1
}