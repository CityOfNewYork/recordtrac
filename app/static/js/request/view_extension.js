$(document).ready(function () {
    // Hides all other divs except for the first. Also hides previous button on the first div.
    $(".add-extension .extension-divs").each(function (e) {
        if (e != 0)
            $(this).hide();
        else
            $("#previous").hide();
    });

    // Handles click events on the first next button
    $("#next-1").click(function (e) {
        if ($("#custom-extension").is(':visible')) {
            $("#custom-extension").parsley().validate();
            if (!$('#custom-extension').parsley().isValid()) {
                e.preventDefault();
                return false;
            }
        }
        $("#extension-select").parsley().validate();
        if ($('#extension-select').parsley().isValid() || $("#custom-extension").parsley().isValid()) {
            // AJAX call to render extension email if validation passes through next button
            var formData = {
                request_id: "{{ request.id }}",
                template_name: "email.html"
            };

            $.ajax({
                url: "/response/email",
                type: 'POST',
                data: JSON.stringify(formData),
                contentType: false,
                success: function (data) {
                    // Data should be html template page.
                    tinyMCE.get('email-extend-content').setContent(data);
                }
            });
            document.getElementById("first").style.display = "none";
            document.getElementById("second").style.display = "block";
        }
    });

    // Handles click events on the second next button
    $("#next-2").click(function () {
        document.getElementById("second").style.display = "none";
        document.getElementById("third").style.display = "block";
    });

    // Handles click events on the first previous button
    $("#prev-1").click(function () {
        document.getElementById("first").style.display = "block";
        document.getElementById("second").style.display = "none";
    });

    // Handles click events on the second previous button
    $("#prev-2").click(function () {
        document.getElementById("third").style.display = "none";
        document.getElementById("second").style.display = "block";
    });

    // Shows custom due date datepicker when Custom Due Date is selected
    $("#extension-select").change(function () {
        selected = $(this).val();
        if (selected === "-1") {
            $("#custom_due_date").show();
        }
        else {
            $("#custom_due_date").hide();
        }
    });

    // Datepicker for extension date of a request
    $("#custom-extension").datepicker({
        dateFormat: "yy-mm-dd"
    });

    // Apply parsley validation styles to input fields of adding an extension
    $('#custom-extension').attr('data-parsley-required', '');
    $('#extension-select').attr('data-parsley-required', '');

    // Apply custom validation messages
    $('#custom-extension').attr('data-parsley-required-message', 'Extension date must be chosen');
    $('#extension-select').attr('data-parsley-required-message', 'Extension length must be selected');
});