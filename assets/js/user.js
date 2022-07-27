$(function () {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length < 6) {
                return console.log(`昵称的长度必须在1~6个字符之间`)
            }
        }
    })

    // 调用 usermessage() 函数 获取用户信息
    usermessages();
    // 初始化用户信息
    function usermessages() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                //  console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } else {
                    console.log(res);
                    form.val('usermessage', res.data)
                }

            }
        })
    };

    // 重置表单信息
    $('#btnreset').on("click", function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        usermessages();
    });

    // 修改表单信息
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                // 调用父页面重的方法 重新渲染的头像和用户的信息
                window.parent.message()
            }
        })
    })
}) 