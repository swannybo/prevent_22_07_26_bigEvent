window.addEventListener('load', function () {
    // 获取登录部分元素
    let rest = document.querySelector('.register');
    let reg = document.querySelector('#reg');
    // 获取注册部分元素
    let enroll = document.querySelector('.enroll');
    let erl = document.querySelector('#erl');
    // 给登录部分元素绑定事件监听对象------点击事件
    reg.addEventListener('click', function () {
        rest.style.display = 'none';
        enroll.style.display = 'block';
    })
    // 给注册部分元素绑定事件监听对象------点击事件
    erl.addEventListener('click', function () {
        rest.style.display = 'block';
        enroll.style.display = 'none';
    });

    // 从 Layui中获取form对象
    let form = layui.form;
    // 从 Layui 中获取layer对象
    let layer = layui.layer
    // 通过 form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 ipt 校验规则
        ipt: [
            /^[\sa-zA-Z0-9-_]{6,8}$/,
            '请设置符合要求的用户名'
        ],
        // 自定义了一个叫做 pwd 校验规则
        pwd: [
            /^[\sa-zA-Z0-9-_]{6,12}$/,
            '密码必须为6-12位,且不能出现空格'
        ],
        // 自定义了一个叫做 erlpwd  校验规则 用于校验注册页面输入密码与确认密码是否一致
        erlpwd: function (value) {
            // 1 先获取注册页面输入的密码
            let swanny = $(".enroll [name=password]").val()
            // 2  判断注册页面输入的密码与确认密码的输入是否一样
            if (swanny !== value) {
                return '两次密码不一致';
            }
        }
    });

    // 用户注册部分发起请求
    // 获取用户注册部分 并为其添加注册事件监听---submit 提交事件
    $("#erllist").on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#erllist [name=username]').val(),
                password: $('#erllist [name=password]').val(),
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功,请登录')
                erl.click();
            }
        })
    });
    // 用户登录部分发起请求
    // 获取用户登录部分 并为其添加注册事件监听---submit 提交事件
    $("#reglist").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res); 
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } else {
                    layer.msg('登录成功');
                    // 打印 浏览器返回的 token值
                    console.log("token:", res.token);
                    // 将浏览器返回的 token 值 存储到 本地存储中
                    localStorage.setItem("token", res.token)
                    // 触发 submit 提交事件 跳转到后台页面
                    location.href = '../../大事件后台管理页面.html'
                }
            }
        })
    })
})