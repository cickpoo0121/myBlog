$(document).ready(function () {
    //  Year drop down
    $('#selectYear').change(function () {
        const year = $(this).val();

        if (year == 'all') {
            window.location.href = '/blog'
        }
        else {
            window.location.href = '/blog/' + year
        }

    });

    $('.btnDelete').click(function () {
        const blogID = $(this).attr('blogID')
        Swal.fire({
            icon: "warning",
            title: "Delete this post?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: "DELETE",
                    url: "blog/" + blogID,
                    success: function (response) {
                        window.location.replace(response);
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: "error",
                            title: xhr.response,
                        })
                    }
                });
            }

        });


    });

    $('#btnAdd').click(function () {
        $('#btnModalSaveEdit').hide()
        $('#btnModalSaveAdd').show()
        $('#modalTitle').text('Add New Blog')
        $('#txtTitle').val('')
        $('#txtDetail').val('')
    });

    // add blog
    $('#btnModalSaveAdd').click(function () {

        $('#modalBlog').modal('toggle')

        const data = {
            title: $('#txtTitle').val(),
            detail: $('#txtDetail').val()
        }
        console.log(data)
        $.ajax({
            method: "POSt",
            url: "/blog/new",
            data: data,
            success: function (response) {
                window.location.replace(response);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: xhr.response,
                })
            }
        });
    })

    var blogID
    $('.btnEdit').click(function () {
        $('#btnModalSaveEdit').show()
        $('#btnModalSaveAdd').hide()
        $('#modalTitle').text('Edit Blog')
        var blogData = JSON.parse($(this).attr('blogData'))

        $('#txtTitle').val(blogData.title)
        $('#txtDetail').val(blogData.detail)
        blogID = blogData.blogID

    });

    // edit blog
    $('#btnModalSaveEdit').click(function () {

        $('#modalBlog').modal('toggle')

        let title = $('#txtTitle').val()
        let detail = $('#txtDetail').val()

        const data = {
            title: title,
            detail: detail,
            blogID: blogID
        }
        console.log(data)
        $.ajax({
            method: "PUT",
            url: "/blog/edit",
            data: data,
            success: function (response) {
                window.location.replace(response);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: xhr.response,
                })
            }
        });
    })
});