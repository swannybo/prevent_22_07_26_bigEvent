$(function () {
    let layer = layui.layer
    let form = layui.form;
    // 调用文章分类列表函数 渲染数据
    start();
    // 获取文章分类列表
    function start() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                let swanny = template('swanny', res)
                $('tbody').html(swanny);
            }
        })
    };

    // 给添加类别按钮注册绑定点击事件
    let addindex = null;
    $('#er').on('click', function () {
        addindex = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#bobo').html(),
        });
    });

    // 通过代理的方式给 form表单中 ce 属性绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加信息失败')
                } else {

                    layer.msg('添加信息成功');
                    //  根据索引 关闭对应的弹出层
                    layer.close(addindex)
                    start()
                }
            }
        })
    })
    // 给编辑按钮绑定点击事件
    let edit = null;
    $('tbody').on('click', '#edits', function () {
        edit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#form-edit').html(),
        });
        let vale = $(this).attr('data-Id');
        console.log(vale);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + vale,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的方式给i修改后的表单绑定提交事件
    $("body").on('submit', '#edit-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            send: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类数据失败')
                } else {
                    layer.msg('修改文章分类数据成功')
                    start();
                    layer.close(edit)
                }
            }
        })
    })

    // 通过代理的方式给将文章类别管理中的删除操作绑定点击事件
    $('tbody').on('click', '.delete', function () {
        let id = $(this).attr('data-Id')
        // 提示用户是否要删除
        layer.confirm('确定要删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除酚类失败')
                    } else {
                        layer.msg('删除分类成功');
                        layer.close(index);
                        start();
                    }
                }
            })
        });
    })
})