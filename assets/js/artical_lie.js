$(function () {
    let layer = layui.layer;
    let form = layui.form;
    var laypage = layui.laypage;
    // 定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        let date = new Date(data);

        // 获取年
        let y = date.getFullYear();
        // 获取月
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        // 获取日
        let d = date.getDate();
        d = d < 10 ? '0' + d : d;
        // 获取时
        let hh = date.getHours();
        hh = hh < 10 ? '0' + hh : hh;
        // 获取分
        let mm = date.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;
        // 获取秒
        let ss = date.getSeconds();
        ss = ss < 10 ? '0' + ss : ss;
        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss;
    }
    //    定义一个查询的参数对象 将来请求数据的时候，需要将请求参数对象提交到服务器
    let swanny = {
        pagenum: 1,            // 页码值, 默认亲求第一页的数据
        pagesize: 2,           // 每页显示多少条数据，默认显示两条
        cate_id: '',           // 文章分类的 Id
        state: '',             // 文章的发布状态
    };

    // 调用 table 函数 渲染数据
    table();
    tabledate()
    // 获取文章列表数据的方法
    function table() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: swanny,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                } else {
                    let bo = template('table', res);
                    $('tbody').html(bo);
                    fen(res.total)
                }
            }
        })
    }

    // 获取、文章列表中所有分类的数据
    function tabledate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                } else {
                    let list = template('tablelist', res)
                    $('[name=cate_id]').html(list);
                    // 通过layui重新渲染表单区域的ui结构
                    form.render();

                }
            }
        })
    }

    // 为筛选按钮绑定 submit 事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 获取表单选项中的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        //    为查询参数对象 q 中对应的属性赋值
        swanny.cate_id = cate_id;
        swanny.state = state;
        //   根据最新的筛选条件 重新渲染表格的数据
        table();
    })


    function fen(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页结构
        laypage.render({
            elem: 'fy',     // 分页容器的id
            count: total,   // 总数据条数
            limit: swanny.pagesize,  // 每页显示几条数据
            curr: swanny.pagenum,    // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [0, 5, 7, 10],
            // 分页发生切换的时候 触发jump回调
            // 触发 jump 回调的方式有两种
            //  1. 点击页码的时候，会触发 jump 回调
            // 2 只要调用了 laypage.render() 方法 就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值来判断是通过哪种方式 触发的 jump 回调
                // 如果 first 的值 为 true , 证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first);
                // // 定义一个渲染分页的方法
                // 将最新的页码值 赋值到 swanny 这个查询参数对象中
                swanny.pagenum = obj.curr;
                // 将最新的条目数 赋值到 swanny 这个查询参数对象的  pagesize 属性中
                swanny.pagesize = obj.limit;
                // 根据最新的 swanny 获取对应的数据列表 并渲染表格
                if (!first) {
                    table();
                }
            }
        })
    }

    // 通过代理的方式给删除按钮帮点点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 在点击操作之前获取页面中删除按钮的个数
        let len = $('.btn-delete').length;
        // 获取文章的id
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function (index) {
            // 询问用户是否要删除
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    } else {
                        layer.msg('删除文章成功')
                        // 当数据删除完成后 需要判断当前这一页中 是否还有剩余的数据
                        // 如果没有剩余的数据了 则让页码值 -1 之后
                        // 再次重新调用 table() 方法
                        if (len === 1) {
                            // 如果len的值等于1 证明删除完成之后 页面上就没有任何数据了
                            // 页码值最小必须是1
                            swanny.pagenum = swanny.pagenum === 1 ? 1 : swanny.pagenum - 1;
                        }
                        table();
                    }
                }
            })
            layer.close(index);
        });

    })
})