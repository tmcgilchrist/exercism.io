$(function() {
  var notification = new exercism.models.Notification(),
  notificationList = new exercism.collections.NotificationList({
    model: notification
  });
  $('.dropdown-toggle').dropdown();
  exercism.collections.notificationsList = new exercism.collections.NotificationList({
    model: notification
  });
  exercism.views.toggleNotifications = new exercism.views.ToggleNotifications({
    el: $("#toggle-notifications"),
    collection: notificationList
  });

  // Only initialize the javascript for the filters if there are filter
  //   assets on the page.
  if ($('#submission-filters').length !== 0) {
    exercism.models.selectFilter = new exercism.models.SelectFilter();
    exercism.views.selectFilter = new exercism.views.SelectFilter({ model: exercism.models.selectFilter });
  }
});

//TODO move all variable declaration to the tops of functions.
$(function() {
  $(".pending-submission, .work").each(function(index,element) {
    var elem = $(element);

    var language = elem.data('language');
    $(".language",elem).tooltip({ title: language });

    var nitCount = elem.data('nits');
    $(".nits",elem).tooltip({ title: nitCount + " Nits by Others" });

    $(".opinions",elem).tooltip({ title: "More Opinions Desired" });

    var versionCount = elem.data('versions');
    $(".versions",elem).tooltip({ title: "Iteration " + versionCount });
  });

  $(".code a[data-action='enlarge']").on("click",function() {
    var codeDiv = $(this).parents(".code");
    codeDiv.removeClass("span6");
    codeDiv.addClass("span12");
    $(this).hide();
    $("a[data-action='shrink']",codeDiv).show();
  });

  $(".code a[data-action='shrink']").on("click",function() {
    var codeDiv = $(this).parents(".code");
    codeDiv.removeClass("span12");
    codeDiv.addClass("span6");
    $(this).hide();
    $("a[data-action='enlarge']",codeDiv).show();
  });

  $("#code-timeline").on("click",function(event) {
    var revisionId = $(event.target).data("revision");
    $(event.target).toggleClass("selected");

    //Example is a special case, it's simply toggled
    if($(event.target).html().indexOf("Example") !== -1) {
      if($(event.target).hasClass('selected')) {
        $("#revision-example").show();
      } else {
        $("#revision-example").hide();
      }
      return;
    }

    //Don't show anything until we're done
    $("div.revision.code").hide();
    $("#revision-diff").hide();

    var selectedCount = $("#code-timeline").find(".revision.selected").length;
    //When only one revision is selected, show that
    if (selectedCount === 1) {
      $('#revision-' + revisionId).toggle();
    } else if (selectedCount >= 2) {
      //We can only diff 2 things, force selections down to 2
      while(selectedCount > 2) {
        var selected = $("#code-timeline .revision.selected").toArray();
        $($("#code-timeline .revision.selected")[0]).removeClass("selected");
        selectedCount = $("#code-timeline").find(".revision.selected").length;
      }

      //With 2 or more selections we show a diff instead
      $("#revision-diff").show();
      $("#revision-diff").html("Loading diff...").show();

      //Load diff using Diffy on Sinatra
      var revisions = $('#code-timeline .revision.selected').map(function(i, elm) { return $(elm).data('submission-id'); }).toArray().join('/');
      $("#revision-diff").load('/submissions/diff/' + revisions);
    }
  });

  $('form input[type=submit], form button[type=submit]').on('click', function() {
    var $this = $(this);
    window.setTimeout(function() { $this.attr('disabled', true); }, 1);
  });

  $('textarea').each(function () {
    var $this = $(this);
    var question_text = "You have unsaved changes on this page";
    var was_sumbitted = false;
    $this.parents("form").on('submit',function(){
      was_sumbitted = true;
    });
    window.onbeforeunload = function (e) {
      var unsaved = $this.text() !== $this.val();
      if(!was_sumbitted && unsaved) {
        // see http://stackoverflow.com/questions/10311341/confirmation-before-closing-of-tab-browser
        e = e || window.event;

        if (e) {
            e.returnValue = question_text;
        }

        return question_text;
      }
    };
  });

  // cmd + return submits nitpicks on mac ctrl + return submits on windows
  // from https://github.com/dewski/cmd-enter
  $(document).on('keydown', 'textarea', function(e) {
      if(e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
          $(this).parents('form').submit();
      }
  });

  $('.work-slug').popover({
    trigger: 'hover',
    placement: 'right',
    html: true,
    delay: {
      show: 600,
      hide: 100
    },
    content: 'use the command <code>exercism fetch</code> to add this assignment to your exercism directory'
  });



  $(".mute").each(function(index, element) {
    var elem = $(element);

    $(".mute-btn",elem).tooltip({ placement: "bottom", title: "Mute this submission until there is further activity." });
    $(".unmute-btn",elem).tooltip({ placement: "bottom", title: "Unmute this sumission." });
  });
});
