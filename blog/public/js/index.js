$(function(){
	//注册
	let $registerBox = $('#registerBox');
	$registerBox.find('.loginBtn').on('click',()=>{
		$('#registerBox').hide();
		$('#loginBox').show();
	})
	$registerBox.find('[name="submit"]').on('click',() => {
		$.ajax({
			type:'post',
			url:'/api/user/register',
			data:{
				username:$registerBox.find('[name="username"]').val(),
				password:$registerBox.find('[name="password"]').val(),
				repassword:$registerBox.find('[name="repassword"]').val()
			},
			dataType:'json',
			success:(res) => {
				console.log(res)
				if(!res.code){
					setTimeout(()=>{
						$('#registerBox').hide();
						$('#loginBox').show();
					},1000)
					$('.tiptext').hide();
				}else{
					$('.tiptext').html(res.message);
					$('.tiptext').show();
				}
			}
		})
	})
	//登录
	let $loginBox = $('#loginBox');
	$loginBox.find('.registerBtn').on('click',()=>{
		$('#registerBox').show();
		$('#loginBox').hide();
	})
	$loginBox.find('[name="submit"]').on('click',() => {
		$.ajax({
			type:'post',
			url:'/api/user/login',
			data:{
				username:$loginBox.find('[name="username"]').val(),
				password:$loginBox.find('[name="password"]').val(),
			},
			dataType:'json',
			success:(res) => {
				console.log(res)
				if(!res.code){
					setTimeout(()=>{
						//重载页面
						window.location.reload();
					},1000)
					$('.tiptext').hide();
				}else{
					$('.tiptext').html(res.message);
					$('.tiptext').show();
				}
			}
		})
	})
	//退出登录
	$('#userInfo').find('.logout').on('click',()=>{
		$.ajax({
			url:'/api/user/logout',
			success:(res) => {
				if(!res.code){
					window.location.reload();
				}
			}
		})
	})
})