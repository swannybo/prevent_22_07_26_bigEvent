$(function () {
    // 调用 usermessage 获取用户信息
    message();

    // 实现用户是否退出功能
    let layer = layui.layer
    $("#request").on('click', function () {
        layer.confirm('是否确定退出', { icon: 3, title: '提示' }, function (index) {

            // 1 清空本地存储
            localStorage.removeItem("token");
            // 2 重新跳转到登录界面
            location.href = '../../大事件登录页面.html'

            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function message() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 调用 start() 函数渲染用户头像
            start(res.data);
        },
        // 不管成功还是失败 最终都会调用这个函数
        // complete: function (res) {
        //     console.log("zhixi");
        //     console.log(res);
        //     // 在 complete函数中 可以通过 responseJSON 拿到服务器返回的数据
        //     if (res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败!') {
        //         // 强制清空本地存储
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录界面
        //         location.href = '../../大事件登录页面.html'
        //     }
        // }
    })
}

// 获取用户头像
function start(user) {
    // 渲染用户昵称
    let name = user.nickname || user.username;
    $('#welcome').html(`欢迎&nbsp;&nbsp;` + name)
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".pic").hide()
    } else {
        $(".layui-nav-img").hide();
        let photo = name[0].toUpperCase()
        $(".pic").html(photo).show();
    }
}