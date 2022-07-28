$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 调用 artical_fb() 渲染数据
    artical_fb();
    // 初始化富文本编辑器
    initEditor()
    function artical_fb() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                } else {
                    layer.msg('初始化文章分类成功');
                    // 调用模板引擎 渲染分类的下拉菜单
                    let fs = template('fb', res)
                    $('[name=cate_id]').html(fs);
                    // 一定要记得用 form.reader()方法 
                    form.render();
                }
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 给选择封面的按钮 绑定点击事件
    $('#selects').on('click', function () {
        $('#fe').click();
    })

    // 给隐藏的文件框绑定 change 事件
    $('#fe').on('change', function (e) {
        // 获取到文件的列表数组
        let file = e.target.files;
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return;
        } else {
            // 根据文件创建对应的 URL 地址
            let imgs = URL.createObjectURL(file[0]);
            // 为裁剪区域重新设置图片
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', imgs)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        }
    })

    // 定义文章的发布状态
    let bo_state = '已发布';
    // 为存为草稿按钮绑定点击事件处理函数
    $('#btncao').on('click', function () {
        bo_state = '存为草稿';
    })

    // 为form表单绑定 submit 事件
    $('#form-yy').on('submit', function (e) {
        // 组织表单的默认提交行为
        e.preventDefault();
        //    基于 form 表单 创建 formData() 对象
        let data = new FormData($(this)[0]);
        // 将文章的发布状态 存到 data 中
        data.append('state', bo_state)
        data.forEach(function (k, obj) {
            console.log(obj, k);
        })
        // 将文章的发布状态 存到 data 中
        data.append('state', bo_state)
        // 将裁剪过后的图片 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 将文件对象 存储到 data 中
                data.append('cover_img', blob);
                //  发起 ajax 数据请求
                publish(data);
            })
    })
    function publish(data) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: data,
            // 注意: 如果向服务器发送的是 FormData() 格式的数据，必须添加如下两个配置项，
            // contentType: false,
            // processData: false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                } else {
                    layer.msg('发布文章成功')
                    // 发布文章成功之后 跳转到文章列表页面
                    location.href = '/home/artical_lie.html'
                }
            }

        })
    }
})