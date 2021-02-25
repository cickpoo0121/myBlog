$(document).ready(function () {

    $('#formLogin').submit(function (e) {
        e.preventDefault()
        const username = $('#txtUsername').val();
        const password = $('#txtPassword').val();
        // alert(username + '  ' + password);

        $.ajax({
            method: "POST",
            url: "/login",
            data: { username: username, password: password },
            success: function (response) {
                window.location.replace(response)
            },
            error: function (xhr) {
                alert(xhr.responseText);
            }
        });
    });
});