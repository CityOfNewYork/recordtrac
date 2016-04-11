(function(){

  $('#load-more-qa').on('click', function() {
    $.getJSON('/api/request/2', function(data) {
      var html = '';
      var qas = data.qas;
      for (var i = 0; i < qas.length; i++) {
        var qa = qas[i];
        html += qa_to_html(qa);
      }
      $('#load-more-qa').before(html);
    });
  });

  function qa_to_html (qa) {
    return '<h3>' + qa.date_created+ '</h3>';
  }

  // hide/show responses
  var $responses = $('.response');
  hideExcept([0], $responses);

  // hides elements, can take a whitelist of indexes
  // ex: to hide all but first ->
  //    hideExcept([0], $elem);
  function hideExcept(whitelist, elem) {
    $.each(elem,
      function(i, el) {
        if ($.inArray(i,whitelist) == -1) {
            $(el).hide();
        }
      });
  }

  $('.case-show-all').on('click',function() {
    var $this = $(this);
    if ($(this).hasClass('show')) {
      $this.toggleClass('show');
      $responses.show(200);
      $this.html('<i class="icon-chevron-up"></i> See less <i class="icon-chevron-up"></i>')
    } else {
      $this.toggleClass('show');
      hideExcept([0], $responses);
      $this.html('<i class="icon-chevron-down"></i> See all <i class="icon-chevron-down"></i>')
    }
  });
  $('#acknowledgeRequestForm').on('click',function() {
      if ($('#acknowledgeRequestForm').css('display') != 'none') {
        $('#acknowledgeRequestForm').hide();
      }
  });

  $("#days_after").change(function() {
    selected = $(this).val();
    if(selected === "0") {
      $("#custom_due_date").show();
      }
    else {
      $("#custom_due_date").hide();
    }
});


  $("#days_after").change(function() {
    selected = $(this).val();
    if(selected === "-1") {
      $("#custom_due_date").show();
    }
    else {
      $("#custom_due_date").hide();
    }
  });

  $('#askQuestion').on('click',function(){
    $('#modalAdditionalInfoTable').show();
    $('#modalQuestionTable').show();
    $('#question_text').html($('#questionTextarea').val());
  });

  $('#submit').on('click',function(event){
    form_id = '#' + $('#form_id').val();
    $('.agency-description').show();
    $('.additional-note').show();
    if((!$('#modalAdditionalInfoTable').is(':visible') && !$('#edit_email').is(':visible')) || $(form_id) == 'note_pdf') {
        $('#confirm-submit').modal('toggle');
        $(form_id).submit();
    }
    else {
      $('#modalAdditionalInfoTable').show();
      $('#editAgencyDescription').hide();
      additional_information = $('#additional_note').val();
      var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "additional_information").val(additional_information);
      $(form_id).append($(input));
      
      if(CKEDITOR.instances.email_text) {
        email_text = CKEDITOR.instances.email_text.getData();
        email_text = email_text.replace('&lt','<').replace('&gt', '>');
        console.log(email_text);
        var emailInput = $("<input>")
                .attr("type", "hidden")
                .attr("name", "email_text").val(email_text);
        $(form_id).append($(emailInput));
      }
      
      if(form_id === '#submitRecord') {
        $(form_id).submit();
      }
      else {
        $(form_id).submit();
      }
    }

   });

  $('#submitAgencyDescription').on('click',function(event){
    form_id = '#' + $('#form_id').val();
    if(!$('#modalAdditionalInfoTable').is(':visible') || $(form_id) == 'note_pdf') {
        $('#confirm-submit').modal('toggle');
        $(form_id).submit();
    }
    else {
      $('#modalAdditionalInfoTable').show();
      $('#editAgencyDescription').hide();
      additional_information = $('#additional_note').val();
      var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "additional_information").val(additional_information);
      $(form_id).append($(input));
      $(form_id).submit();
    }

   });

    $('#cancelDescription').on('click',function(event){
        $('#editAgencyDescription').hide();
        $('#additionalInformation').show();
        form_id = '#' + $('#form_id').val();
        additional_information = "";
        var input = $("<input>")
            .attr("type", "hidden")
            .attr("name", "additional_information").val(additional_information);
        $(form_id).append($(input));
        $(form_id).submit();
    });

    $('#cancel_close').on('click',function(event){
        $('#close-reminder').hide();
    });

  $('#rerouteButton').on('click',function(){
    var formData = new FormData($("#AcknowledgeNote")[0]);
    if($("#rerouteReason").val()) {

    }
    else {
      $.ajax({
        url: "/email/email_acknowledgement.html",
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: function(data){
          $('#form_id').val('AcknowledgeNote');
          var modalQuestion = 'Are you sure you want to acknowledge the request for the number of days below and send an email to the requester?';
          modalQuestion += '<br><br>' + $('#acknowledge_status').val();
          $('#modalquestionDiv').html(modalQuestion);
          $('#modalQuestionTable').hide();
          CKEDITOR.replace( 'email_text' );
          $('#email_text').val(data);
          $('#emailTextTable').hide();
          $('#modalquestionDiv').text(modalQuestion);
          $('#modalQuestionTable').hide();
        },
        error: function(data){
            alert('fail.');
        }
      });
    }
  });

  $('#extendButton').on('click',function(){

    var formData = new FormData($("#extension")[0]);

    $.ajax({
      url: "/email/email_extension.html",
      type: 'POST',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data){
        //$('#modalAdditionalInfoTable').show();
        $('#form_id').val('extension');
        days = $('#days_after').val();
        var modalQuestion = 'Are you sure you want to request an extension for the number of days below and send an email to the requester?';

        if (days != -1) {
            modalQuestion += '<br><br>' + $('#days_after').val() + " days";
         }
        else {
            due_date = $('#datepicker').datepicker('getDate');
            day = due_date.getDate();
            month = due_date.getMonth() + 1;
            year = due_date.getFullYear();

            modalQuestion = 'Are you sure you want to set the following due date and send an email to the requester?';
            modalQuestion += '<br><br>' + month + "/" + day + "/" + year;
         }
        CKEDITOR.replace( 'email_text' );
        $('#email_text').val(data);
        $('#emailTextTable').hide();
        $('#edit_email').show();
        $('#modalquestionDiv').html(modalQuestion);
        $('#modalQuestionTable').hide();
      },
      error: function(data){
        alert('fail.');
      }
    });
  });

  $('#closeButton').on('click',function(){
  var formData = new FormData($("#closeRequest")[0]);

    $.ajax({
      url: "/email/email_closed.html",
      type: 'POST',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data){    
        var selectedCloseReason = $('#close_reasons option:selected').text();
        if(selectedCloseReason.indexOf('Denied') >= 0) {
            $('#deny_explain_why').show();
        }
        else {
            $('#deny_explain_why').hide();
        }

        $('#modalAdditionalInfoTable').show();
        $('#close-reminder').show()
        //$('#modalAdditionalInfoTable').append('<p><b>If you are denying this request please explain why.</b></p>');
        $('#form_id').val('closeRequest');
        var modalQuestion = 'Are you sure you want to close the request for the reasons below and send an email to the requester?';
        var reasons = $('#close_reasons').val();
        modalQuestion += '<br><br>';
        var i;
        for (i = 0 ; i < reasons.length ; i++){
            modalQuestion += '<br><br>' + reasons[i];
        }
        CKEDITOR.replace( 'email_text' );
        $('#email_text').val(data);
        $('#edit_email').show();
        $('#emailTextTable').hide();
        $('#modalquestionDiv').html(modalQuestion);
        $('#modalQuestionTable').hide();
      },
      error: function(data){
        alert('fail.');
      }
    });
  });

$('#editAgencyDescriptionButton').on('click',function(){
    $('.agency-description').show();
    $('.additional-note').hide();
    var modalQuestion = 'Type in the agency description below';
    modalQuestion += '<br><br>';
    $('#form_id').val('agency_description');
    $('#modalquestionDiv').html(modalQuestion);
    $('#modalQuestionTable').hide();
});

$('#file_upload_filenames').bind('DOMNodeInserted', function(event) {
  var names = [];
  if($("input[name=record]") && $("input[name=record]").get(0) && $("input[name=record]").get(0).files) {
  for (var i = 0; i < $("input[name=record]").get(0).files.length; ++i) {
    names.push($("input[name=record]").get(0).files[i].name);
  }}

  if(names.length > 4) {
      $('#close_filenames_list').click();
      $('#numFiles').show();
  }
  else {
      $('#file_upload_one').text(names[0]);
      $('#file_upload_two').text(names[1]);
      $('#file_upload_three').text(names[2]);
      $('#file_upload_four').text(names[3]);
      $('#numFiles').hide();
  }

});

$('.privacy_radio').on('click', function() {
  if(this.id === "release_and_public") {
    var $this = $(this);
    var csrf_token = $this.prev().prev().prev().val();
    var request_id = $this.prev().prev().val();
    var record_id = $this.prev().val();

    var modalQuestion = 'Are you sure you want to make this record public and send an email to the requester?';
    $('#modalquestionDiv').text(modalQuestion);
    $('#modalQuestionTable').hide();
    $('#confirm-submit').modal('toggle');
    
    $.ajax({
      url: "/switchRecordPrivacy",
      type: 'POST',
      data: {_csrf_token:csrf_token, privacy_setting: 'release_and_public', request_id: request_id, record_id: record_id},
      success: function(data){
        console.log("DONE");
        /*$('#modalAdditionalInfoTable').show();
        $('#form_id').val('submitRecord');
        var modalQuestion = 'Are you sure you want to make this record public and send an email to the requester?';
        modalQuestion += $('#recordSummary').text();
        modalQuestion += "<br>";
        CKEDITOR.replace( 'email_text' );
        $('#email_text').val(data);
        $('#emailTextTable').hide();
        $('#modalquestionDiv').text(modalQuestion);
        $('#modalQuestionTable').hide();*/
      },
      error: function(data){
        alert('fail.');
      }
    });

    //$('#addRecordButton').click();
  }
});

$('#close_filenames_list').on('click',function(){
  $('#file_upload_one').empty();
  $('#file_upload_two').empty();
  $('#file_upload_three').empty();
  $('#file_upload_four').empty();
});

  $('#addRecordButton').on('click',function(){
    var formData = new FormData($("#submitRecord")[0]);
    $.ajax({
      url: "/email/email_city_response_added.html",
      type: 'POST',
      processData: false,
      contentType: false,
      data: formData,
      success: function(data){
        $('#modalAdditionalInfoTable').show();
        $('#form_id').val('submitRecord');
        var modalQuestion = 'Are you sure you want to add this record and send an email to the requester?';
        modalQuestion += $('#recordSummary').text();
        $('#modalquestionDiv').text(modalQuestion);
        $('#modalQuestionTable').hide();
        modalQuestion += "<br>";
        CKEDITOR.replace( 'email_text' );
        $('#email_text').val(data);
        $('#emailTextTable').hide();
        $('#modalquestionDiv').text(modalQuestion);
        $('#modalQuestionTable').hide();
      },
      error: function(data){
          alert('fail.');
      }        
    });
  });

$('#edit_email').on('click',function(){
    for (var editorInstance in CKEDITOR.instances) {
      CKEDITOR.instances[editorInstance].setReadOnly(false);
    } 
  });

  $("[data-toggle='modal']").click(function (e) {
    if(this.id === "addRecordButton") {
      var titleTexts = $('.title_text');
      $('.title_text').each(function()  {
        if($(this).val() === '') {
          $('#missing_title').show();
          $('#missing_title').focus();
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }
  });

  $('#addNoteButton').on('click',function(){
    $('#emailTextTable').hide();
    $('#email_text').hide();
    $('#edit_email').hide();
    $('#cke_email_text').hide();
    $('#modalAdditionalInfoTable').show();
    $('#form_id').val('note');
    var modalQuestion = 'Are you sure you want to add the note below?';
    modalQuestion += '<br><br>' + $('#noteTextarea').val();
    $('#modalquestionDiv').html(modalQuestion);
    $('#modalQuestionTable').hide();
  });

   $('#addPublicNoteButton').on('click', function () {
      $('#modalAdditionalInfoTable').hide();
      $('#form_id').val('note');
      var modalQuestion = 'Are you sure you want to add the note below to this request?';
      modalQuestion += '<br><br>' + $('#noteTextarea').val();
      $('#modalquestionDiv').html(modalQuestion);
      $('#modalQuestionTable').hide();
    });

  $('#generatePDFButton').on('click',function(event){
    $('#emailTextTable').hide();
    $('#email_text').hide();
    $('#edit_email').hide();
    var selectedTemplate = $('#response_template option:selected').text();
    var modalQuestion = 'Are you sure you want to generate a Word Document for the template below?';

    if (selectedTemplate === '') {
      $('#missing_pdf_template').removeClass('hidden');
    }
    else {
        if(selectedTemplate === 'Deny Request' || selectedTemplate === 'Partial Denial of Request') {
            $('#deny_explain_why').show();
        }
        else {
            $('#deny_explain_why').hide();
        }
        $('#missing_pdf_template').addClass('hidden');
        var attr = $('#generatePDFButton').attr('data-toggle');
        $('#generatePDFButton').attr('data-toggle','modal');
        $('#generatePDFButton').attr('data-target','#confirm-submit');

        $('#modalAdditionalInfoTable').hide();
        $('#form_id').val('note_pdf');
        modalQuestion += '<br><br>' + selectedTemplate;
        $('#modalquestionDiv').html(modalQuestion);
        $('#modalQuestionTable').hide();
    }



  });

  $('#notifyButton').on('click',function(){
    $('#form_id').val('notifyForm');
    var modalQuestion = 'Are you sure you want to add the helper and send an email to the requester? Please specify the reason below.';
    modalQuestion += '<br><br>' + $('#notifyReason').val();
    $('#modalquestionDiv').html(modalQuestion);
    $('#modalQuestionTable').hide();
  });

  $("#requesterInfoButton").on('click', function() {
    $('#requester_info').toggle();
    $('#requesterInfoButton').innerHTML();
  });

  $(".start").on('click', function() {
    var title = $('.title_text');
    var titleLengthCorrect = 1;

    $.each(title, function (index, t) {
        if(t.value.length > 140) {
          $('#record_title_alert').show();
          titleLengthCorrect = -1;
        }
    });
    
    if(titleLengthCorrect === 1) {
        $('#record_title_alert').hide();
        $('#addRecordButton').click();
    }
  });

  $("#cancel_all").on('click', function() {
    $('.delete').click();
  });

$("#cancel").on('click', function(){
    $('.additional-note').show();
    $('.agency-description').hide();
});

    $('#addNoteButton').prop('disabled',true);
    $('#noteTextarea').keyup(function(){
        $('#addNoteButton').prop('disabled', this.value == "" ? true : false);
    })

    $( "#datepicker" ).datepicker();
/*$(document).on('ready', function() {
    $("#record").fileinput({
        maxFileCount: 4,
    validateInitialCount: true,
    overwriteInitial: false,
    allowedFileExtensions: ["txt", "pdf", "doc", "rtf", "odt", "odp", "ods", "odg","odf","ppt", "pps", "xls", "docx", "pptx", "ppsx", "xlsx","jpg","jpeg","png","gif","tif","tiff","bmp","avi","flv","wmv","mov","mp4","mp3","wma","wav","ra","mid"]
    });
});*/
})($);
