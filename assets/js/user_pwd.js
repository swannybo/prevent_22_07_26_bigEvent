$(function () {
    let form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newpwd: function (value) {
            if (value === $('[name=oldpwd]').val()) {
                return '新旧密码不能一致'
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newpwd]').val()) {
                return '两次密码不一致，请重新确认密码'
            }
        }
    });
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('密码修改错误')
                } else {
                    layui.layer.msg('密码修改成功');
                    $('.layui-form')[0].reset();
                }
            }
        })
    })
})