function _t(string, replace)
{
    if (typeof (aws_lang) != 'undefined')
    {
        if (typeof (aws_lang[string]) != 'undefined')
        {
            string = aws_lang[string];
        }
    }

    if (replace)
    {
        string = string.replace('%s', replace);
    }

    return string;
}

function ajax_request(url, params)
{
	$.loading('show');

    if (params)
    {
        $.post(url, params + '&_post_type=ajax', function (result)
        {
        	$.loading('hide');

        	if (!result)
        	{
	        	return false;
        	}

            if (result.err)
            {
                $.alert(result.err);
            }
            else if (result.rsm && result.rsm.url)
            {
                window.location = decodeURIComponent(result.rsm.url);
            }
            else
            {
                window.location.reload();
            }
        }, 'json').error(function (error)
        {
        	$.loading('hide');

            if ($.trim(error.responseText) != '')
            {
                alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText);
            }
        });
    }
    else
    {
        $.get(url, function (result)
        {
        	$.loading('hide');

        	if (!result)
        	{
	        	return false;
        	}

            if (result.err)
            {
                $.alert(result.err);
            }
            else if (result.rsm && result.rsm.url)
            {
                window.location = decodeURIComponent(result.rsm.url);
            }
            else
            {
                window.location.reload();
            }
        }, 'json').error(function (error)
        {
        	$.loading('hide');

            if ($.trim(error.responseText) != '')
            {
                alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText);
            }
        });
    }

    return false;
}

function ajax_post(formEl, processer) // 表单对象，用 jQuery 获取，回调函数名
{
    if (typeof (processer) != 'function')
    {
        processer = _ajax_post_processer;

        $.loading('show');
    }

    var custom_data = {
        _post_type: 'ajax'
    };

    formEl.ajaxSubmit(
    {
        dataType: 'json',
        data: custom_data,
        success: processer,
        error: function (error)
        {
            if ($.trim(error.responseText) != '')
            {
            	$.loading('hide');

                alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText);
            }
        }
    });
}

function _ajax_post_processer(result)
{
	$.loading('hide');

    if (typeof (result.errno) == 'undefined')
    {
        $.alert(result);
    }
    else if (result.errno != 1)
    {
        $.alert(result.err);
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            window.location.reload();
        }
    }
}

function _ajax_post_modal_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        alert(result.err);
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            $('#aw-ajax-box div.modal').modal('hide');
        }
    }
}

function _ajax_post_alert_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        alert(result.err);
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            window.location.reload();
        }
    }
}

function _ajax_post_background_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        $.alert(result.err);
    }
}

function _ajax_post_confirm_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        if (!confirm(result.err))
        {
            return false;
        }
    }

    if (result.errno == 1 && result.err)
    {
        alert(result.err);
    }

    if (result.rsm && result.rsm.url)
    {
        window.location = decodeURIComponent(result.rsm.url);
    }
    else
    {
        window.location.reload();
    }
}

function _error_message_form_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
    	if (!$('.error_message').length)
    	{
	    	alert(result.err);
    	}
    	else if ($('.error_message em').length)
    	{
	    	$('.error_message em').html(result.err);
    	}
    	else
    	{
	    	 $('.error_message').html(result.err);
    	}

    	if ($('.error_message').css('display') != 'none')
    	{
	    	shake($('.error_message'));
    	}
    	else
    	{
	    	$('.error_message').fadeIn();
    	}

        if ($('#captcha'))
        {
            reload_captcha();
        }
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            window.location.reload();
        }
    }
}

function shake(element)
{
    element.css('margin-left',element.css('margin-left'));

    for (var i = 1; i <= 3; i++)
    {
        element.animate({ 'left': (30 - 10 * i) }, 20);
        element.animate({ 'left': (2 * (30 - 10 * i)) }, 20);
    }
}

function reload_captcha() {
    $("#captcha").attr("src", G_BASE_URL + '/account/captcha/' + Math.floor(Math.random() * 10000));
    $("input[name='seccode_verify']").val("");
};

function focus_question(el, question_id)
{
    if (el.html())
    {
        if (!el.hasClass('aw-active'))
        {
            el.html(_t('关注'));
        }
        else
        {
            el.html(_t('取消关注'));
        }
    }
    else
    {
        if (!el.hasClass('aw-active'))
        {
            el.attr('data-original-title', _t('关注'));
        }
        else
        {
            el.attr('data-original-title', _t('取消关注'));
        }
    }

    el.addClass('loading').addClass('disabled');

    $.get(G_BASE_URL + '/question/ajax/focus/question_id-' + question_id, function (data)
    {
        if (data.errno == 1)
        {
            if (data.rsm.type == 'add')
            {
                el.removeClass('aw-active');
            }
            else
            {
                el.addClass('aw-active');
            }
        }
        else
        {
            if (data.err)
            {
                $.alert(data.err);
            }

            if (data.rsm.url)
            {
                window.location = decodeURIComponent(data.rsm.url);
            }
        }

        el.removeClass('loading').removeClass('disabled');
    }, 'json');
}

function focus_topic(el, topic_id)
{
    if (el.html())
    {
        if (!el.hasClass('aw-active'))
        {
            el.html(_t('关注'));
        }
        else
        {
            el.html(_t('取消关注'));
        }
    }
    else
    {
        if (!el.hasClass('aw-active'))
        {
            el.attr('data-original-title', _t('关注'));
        }
        else
        {
            el.attr('data-original-title', _t('取消关注'));
        }
    }

    el.addClass('loading').addClass('disabled');

    $.get(G_BASE_URL + '/topic/ajax/focus_topic/topic_id-' + topic_id, function (data)
    {
        if (data.errno == 1)
        {
            if (data.rsm.type == 'add')
            {
                el.removeClass('aw-active');
            }
            else
            {
                el.addClass('aw-active');
            }
        }
        else
        {
            if (data.err)
            {
                $.alert(data.err);
            }

            if (data.rsm.url)
            {
                window.location = decodeURIComponent(data.rsm.url);
            }
        }

        el.removeClass('loading').removeClass('disabled');
    }, 'json');
}

function follow_people(el, uid)
{
    if (el.html())
    {
        if (!el.hasClass('aw-active'))
        {
            el.html(_t('关注'));
        }
        else
        {
            el.html(_t('取消关注'));
        }
    }
    else
    {
        if (!el.hasClass('aw-active'))
        {
            el.attr('data-original-title', _t('关注'));
        }
        else
        {
            el.attr('data-original-title', _t('取消关注'));
        }
    }

    el.addClass('loading').addClass('disabled');

    $.get(G_BASE_URL + '/follow/ajax/follow_people/uid-' + uid, function (data)
    {
        if (data.errno == 1)
        {
            if (data.rsm.type == 'add')
            {
                el.removeClass('aw-active');
            }
            else
            {
                el.addClass('aw-active');
            }
        }
        else
        {
            if (data.err)
            {
                $.alert(data.err);
            }

            if (data.rsm.url)
            {
                window.location = decodeURIComponent(data.rsm.url);
            }
        }

        el.removeClass('loading').removeClass('disabled');
    }, 'json');
}

function check_notifications()
{
    if (G_USER_ID == 0)
    {
        return false;
    }

    $.get(G_BASE_URL + '/home/ajax/notifications/', function (result)
    {

        $('#inbox_unread').html(Number(result.rsm.inbox_num));

        last_unread_notification = G_UNREAD_NOTIFICATION;

        G_UNREAD_NOTIFICATION = Number(result.rsm.notifications_num);

        if (G_UNREAD_NOTIFICATION > 0)
        {
            if (G_UNREAD_NOTIFICATION != last_unread_notification)
            {
                reload_notification_list();

                $('#notifications_unread').html(G_UNREAD_NOTIFICATION);
            }
        }
        else
        {
            if ($('#header_notification_list').length > 0)
            {
                $("#header_notification_list").html('<p style="padding: 0" align="center">' + _t('没有未读通知') + '</p>');
            }

            if ($("#index_notification").length > 0)
            {
                $("#index_notification").fadeOut();
            }

            if ($('#tab_all_notifications').length > 0)
            {
                $('#tab_all_notifications').click();
            }
        }

        if (Number(result.rsm.notifications_num) > 0)
        {
            document.title = '(' + (Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num)) + ') ' + document_title;

            $('#notifications_unread').show();
        }
        else
        {
            document.title = document_title;

            $('#notifications_unread').hide();
        }

        if (Number(result.rsm.inbox_num) > 0)
        {
            $('#inbox_unread').show();
        }
        else
        {
            $('#inbox_unread').hide();
        }

        if (((Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num))) > 0)
        {
            document.title = '(' + (Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num)) + ') ' + document_title;
        }
        else
        {
            document.title = document_title;
        }
    }, 'json');
}

function reload_notification_list()
{
    if ($("#index_notification").length > 0)
    {
        $("#index_notification").fadeIn().find('[name=notification_unread_num]').html(G_UNREAD_NOTIFICATION);

        $('#index_notification ul#notification_list').html('<p align="center" style="padding: 15px 0"><img src="' + G_STATIC_URL + '/common/loading_b.gif"/></p>');

        $.get(G_BASE_URL + '/notifications/ajax/list/flag-0__page-0', function (response)
        {
            $('#index_notification ul#notification_list').html(response);

            notification_show(5);
        });
    }

    if ($("#header_notification_list").length > 0)
    {
        $("#header_notification_list").html('<p align="center">Loading...</p>');

        $.get(G_BASE_URL + '/notifications/ajax/list/flag-0__limit-5__template-header_list', function (response)
        {
            if (response.length)
            {
                $("#header_notification_list").html(response);

            }
            else
            {
                $("#header_notification_list").html('<p style="padding: 0" align="center">' + _t('没有未读通知') + '</p>');
            }
        });
    }
}

function read_notification(notification_id, el, reload)
{
    if (notification_id)
    {
        el.remove();

        notification_show(5);

        if ($("#announce_num").length > 0)
        {
            $("#announce_num").html(String(G_UNREAD_NOTIFICATION - 1));
        }

        if ($("#notifications_num").length > 0)
        {
            $("#notifications_num").html(String(G_UNREAD_NOTIFICATION - 1));
        }

        var url = G_BASE_URL + '/notifications/ajax/read_notification/notification_id-' + notification_id;
    }
    else
    {
        if ($("#index_notification").length > 0)
        {
            $("#index_notification").fadeOut();
        }

        var url = G_BASE_URL + '/notifications/ajax/read_notification/';
    }

    $.get(url, function (respose)
    {
        check_notifications();

        if (reload)
        {
            window.location.reload();
        }
    });
}

function notification_show(length)
{
    if ($('#index_notification').length > 0)
    {
        var n_count = 0;

        $('#index_notification ul#notification_list li').each(function (i, e)
        {
            if (i < length)
            {
                $(e).show();
            }
            else
            {
                $(e).hide();
            }

            n_count++;
        });

        if ($('#index_notification ul#notification_list li').length == 0)
        {
            $('#index_notification').fadeOut();
        }
    }
}

var _bp_more_o_inners = new Array();
var _bp_more_pages = new Array();

function bp_more_load(url, bp_more_o_inner, target_el, start_page, callback_func)
{
    if (!bp_more_o_inner.attr('id'))
    {
        return false;
    }

    if (!start_page)
    {
        start_page = 0
    }

    _bp_more_pages[bp_more_o_inner.attr('id')] = start_page;

    _bp_more_o_inners[bp_more_o_inner.attr('id')] = bp_more_o_inner.html();

    bp_more_o_inner.unbind('click');

    bp_more_o_inner.bind('click', function ()
    {
        var _this = this;

        $(this).addClass('loading');

        $(this).find('span').html(_t('正在载入') + '...');

        $.get(url + '__page-' + _bp_more_pages[bp_more_o_inner.attr('id')], function (response)
        {
            if ($.trim(response) != '')
            {
                if (_bp_more_pages[bp_more_o_inner.attr('id')] == start_page && $(_this).attr('auto-load') != 'false')
                {
                    target_el.html(response);
                }
                else
                {
                    target_el.append(response);
                }

                _bp_more_pages[bp_more_o_inner.attr('id')]++;

                $(_this).html(_bp_more_o_inners[bp_more_o_inner.attr('id')]);
            }
            else
            {
                if (_bp_more_pages[bp_more_o_inner.attr('id')] == start_page && $(_this).attr('auto-load') != 'false')
                {
                    target_el.html('<p style="padding: 15px 0" align="center">' + _t('没有内容') + '</p>');
                }

                $(_this).addClass('disabled').unbind('click').bind('click', function () { return false; });

                $(_this).find('span').html(_t('没有更多了'));
            }

            $(_this).removeClass('loading');

            if (callback_func != null)
            {
                callback_func();
            }
        });

        return false;
    });

    if (bp_more_o_inner.attr('auto-load') != 'false')
    {
        bp_more_o_inner.click();
    }
}

function content_switcher(hide_el, show_el)
{
    hide_el.hide();
    show_el.fadeIn();
}

function hightlight(el, class_name)
{
    if (el.hasClass(class_name))
    {
        return true;
    }

    var hightlight_timer_front = setInterval(function ()
    {
        el.addClass(class_name);
    }, 500);

    var hightlight_timer_background = setInterval(function ()
    {
        el.removeClass(class_name);
    }, 600);

    setTimeout(function ()
    {
        clearInterval(hightlight_timer_front);
        clearInterval(hightlight_timer_background);

        el.addClass(class_name);
    }, 1200);

    setTimeout(function ()
    {
        el.removeClass(class_name);
    }, 6000);
}

function nl2br(str)
{
    return str.replace(new RegExp("\r\n|\n\r|\r|\n", "g"), "<br />");
}

function init_img_uploader(upload_url, upload_name, upload_element, upload_status_elememt, perview_element)
{
    return new AjaxUpload(upload_element,
    {
        action: upload_url,
        name: upload_name,
        responseType: 'json',

        onSubmit: function (file, ext)
        {
            if (!new RegExp('(png|jpe|jpg|jpeg|gif)$', 'i').test(ext))
            {
                alert(_t('上传失败: 只支持 jpg、gif、png 格式的图片文件'));

                return false;
            }

            this.disable();

            if (upload_status_elememt)
            {
                upload_status_elememt.show();
            }
        },

        onComplete: function (file, response)
        {
            this.enable();

            if (upload_status_elememt)
            {
                upload_status_elememt.hide();
            }

            if (response.errno == -1)
            {
                alert(response.err);
            }
            else if (typeof (response.rsm != 'undefined'))
            {
                if (typeof (perview_element.attr('src')) != 'undefined' && response.rsm.preview)
                {
                    perview_element.attr('src', response.rsm.preview + '?' + Math.floor(Math.random() * 10000));
                }
                else if (response.rsm.preview)
                {
                    perview_element.css('background-image', 'url(' + response.rsm.preview + '?' + Math.floor(Math.random() * 10000) + ')');
                }
            }
        }
    });
}

function init_avatar_uploader(upload_element, upload_status_elememt, avatar_element)
{
    return init_img_uploader(G_BASE_URL + '/account/ajax/avatar_upload/', 'user_avatar', upload_element, upload_status_elememt, avatar_element);
}

function init_fileuploader(element_id, action_url)
{
    if (!document.getElementById(element_id))
    {
        return false;
    }

    if (G_UPLOAD_ENABLE == 'Y')
    {
    	$('.aw-upload-tips').show();
    }

    return new _ajax_uploader.FileUploader(
    {
        element: document.getElementById(element_id),
        action: action_url,
        debug: false
    });
}

function htmlspecialchars(text)
{
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function delete_draft(item_id, type)
{
    $.post(G_BASE_URL + '/account/ajax/delete_draft/', 'item_id=' + item_id + '&type=' + type, function (result)
    {
        if (result.errno != 1)
        {
            $.alert(result.err);
        }
    }, 'json');
}

function agree_vote(answer_id, value)
{
    $.post(G_BASE_URL + '/question/ajax/answer_vote/', "answer_id=" + answer_id + "&value=" + value, function (result)
    {
        if (result.errno == -1)
        {
            $.alert(result.err);
        }
    }, 'json');
}

function question_uninterested(el, question_id)
{
    el.fadeOut();

    $.post(G_BASE_URL + '/question/ajax/uninterested/', 'question_id=' + question_id, function (result)
    {
        if (result.errno != '1')
        {
            alert(result.err);
        }
    }, 'json');
}

function question_invite_delete(block_el, question_invite_id)
{
    $.post(G_BASE_URL + '/question/ajax/question_invite_delete/', 'question_invite_id=' + question_invite_id, function (result)
    {
        if (result.errno == 1)
        {
            block_el.fadeOut();
        }
        else
        {
            alert(result.rsm.err);
        }
    }, 'json');
}

function reload_comments_list(item_id, element_id, type_name)
{
    $('#aw-comment-box-' + type_name + '-' + element_id + ' .aw-comment-list').html('<p align="center" class="aw-padding10"><i class="aw-loading"></i></p>');

    $.get(G_BASE_URL + '/question/ajax/get_' + type_name + '_comments/' + type_name + '_id-' + item_id, function (data)
    {
        $('#aw-comment-box-' + type_name + '-' + element_id + ' .aw-comment-list').html(data);
    });
}

function save_comment(save_button_el)
{
    $(save_button_el).attr('_onclick', $(save_button_el).attr('onclick')).addClass('disabled').removeAttr('onclick').addClass('_save_comment');

    ajax_post($(save_button_el).parents('form'), _comments_form_processer);
}

function _comments_form_processer(result)
{
    $.each($('a._save_comment.disabled'), function (i, e)
    {

        $(e).attr('onclick', $(this).attr('_onclick')).removeAttr('_onclick').removeClass('disabled').removeClass('_save_comment');
    });

    if (result.errno != 1)
    {
        $.alert(result.err);
    }
    else
    {
        reload_comments_list(result.rsm.item_id, result.rsm.item_id, result.rsm.type_name);

        $('#aw-comment-box-' + result.rsm.type_name + '-' + result.rsm.item_id + ' form input').val('');
        $('#aw-comment-box-' + result.rsm.type_name + '-' + result.rsm.item_id + ' form textarea').val('');
    }
}

function remove_comment(el, type, comment_id)
{
	$.get(G_BASE_URL + '/question/ajax/remove_comment/type-' + type + '__comment_id-' + comment_id);

	$(el).parents('.aw-comment-box li').fadeOut();
}

function insert_attach(element, attach_id, attach_tag)
{
    $(element).parents('form').find('textarea').insertAtCaret("\n[" + attach_tag + "]" + attach_id + "[/" + attach_tag + "]\n");
}

function question_thanks(question_id, element)
{
    $.post(G_BASE_URL + '/question/ajax/question_thanks/', 'question_id=' + question_id, function (result)
    {
        if (result.errno != 1)
        {
            $.alert(result.err);
        }
        else if (result.rsm.action == 'add')
        {
            $(element).html($(element).html().replace(_t('感谢'), _t('已感谢')));
            $(element).removeAttr('onclick');
        }
        else
        {
            $(element).html($(element).html().replace(_t('已感谢'), _t('感谢')));
        }
    }, 'json');
}

function answer_user_rate(answer_id, type, element)
{
    $.post(G_BASE_URL + '/question/ajax/question_answer_rate/', 'type=' + type + '&answer_id=' + answer_id, function (result)
    {
        if (result.errno != 1)
        {
            $.alert(result.err);
        }
        else if (result.errno == 1)
        {
            switch (type)
            {
            case 'thanks':
                if (result.rsm.action == 'add')
                {
                    $(element).html($(element).html().replace(_t('感谢'), _t('已感谢')));
                    $(element).removeAttr('onclick');
                }
                else
                {
                    $(element).html($(element).html().replace(_t('已感谢'), _t('感谢')));
                }
                break;

            case 'uninterested':
                if (result.rsm.action == 'add')
                {
                    $(element).html(_t('撤消没有帮助'));
                }
                else
                {
                    $(element).html(_t('没有帮助'));
                }
                break;
            }
        }
    }, 'json');
}

function init_comment_box(selector)
{
    $(document).on('click', selector, function ()
    {
        $(this).parents('.aw-question-detail-title').find('.aw-invite-box, .aw-question-related-box').hide();
        if (typeof COMMENT_UNFOLD != 'undefined')
        {
            if (COMMENT_UNFOLD == 'all' && $(this).attr('data-comment-count') == 0 && $(this).attr('data-first-click') == 'hide')
            {
                $(this).removeAttr('data-first-click');
                return false;
            }
        }

        if (!$(this).attr('data-type') || !$(this).attr('data-id'))
        {
            return true;
        }

        var comment_box_id = '#aw-comment-box-' + $(this).attr('data-type') + '-' + 　$(this).attr('data-id');

        if ($(comment_box_id).length > 0)
        {
            if ($(comment_box_id).css('display') == 'none')
            {
                $(comment_box_id).fadeIn();
            }
            else
            {
                $(comment_box_id).fadeOut();
            }
        }
        else
        {
            // 动态插入commentBox
            switch ($(this).attr('data-type'))
            {
	            case 'question':
	                var comment_form_action = G_BASE_URL + '/question/ajax/save_question_comment/question_id-' + $(this).attr('data-id');
	                var comment_data_url = G_BASE_URL + '/question/ajax/get_question_comments/question_id-' + $(this).attr('data-id');
	                break;

	            case 'answer':
	                var comment_form_action = G_BASE_URL + '/question/ajax/save_answer_comment/answer_id-' + $(this).attr('data-id');
	                var comment_data_url = G_BASE_URL + '/question/ajax/get_answer_comments/answer_id-' + $(this).attr('data-id');
	                break;
            }
            if (G_USER_ID)
            {
                $(this).parents('.aw-item').append(Hogan.compile(AW_TEMPLATE.commentBox).render(
                {
                    'comment_form_id': comment_box_id.replace('#', ''),
                    'comment_form_action': comment_form_action
                }));

                $(comment_box_id).find('.aw-comment-txt').bind(
                {
                    focus: function ()
                    {
                        $(comment_box_id).find('.aw-comment-box-btn').show();
                    },

                    blur: function ()
                    {
                        if ($(this).val() == '')
                        {
                            $(comment_box_id).find('.aw-comment-box-btn').hide();
                        }
                    }
                });

                $(comment_box_id).find('.close-comment-box').click(function ()
                {
                    $(comment_box_id).fadeOut();
                    $(comment_box_id).find('.aw-comment-txt').css('height', $(this).css('line-height'));
                });
            }
            else
            {
                $(this).parent().parent().append(Hogan.compile(AW_TEMPLATE.commentBoxClose).render(
                {
                    'comment_form_id': comment_box_id.replace('#', ''),
                    'comment_form_action': comment_form_action
                }));
            }

            //判断是否有评论数据
            $.get(comment_data_url, function (result)
            {
                if ($.trim(result) == '')
                {
                    result = '<div align="center" class="aw-padding10">' + _t('暂无评论') + '</div>';
                }

                $(comment_box_id).find('.aw-comment-list').html(result);
            });

            var left = $(this).width()/2 + $(this).prev().width();
            /*给三角形定位*/
            $(comment_box_id).find('.i-dropdown-triangle').css('left', $(this).position().left);
            //textarae自动增高
            $(comment_box_id).find('.aw-comment-txt').autosize();
        }

        at_user_lists($(this).parents('.aw-item').find('.aw-comment-txt'));
    });
}

function init_article_comment_box(selector)
{
    $(document).on('click', selector, function ()
    {
        if ($(this).parents('.aw-item-content').find('.aw-article-comment-box').length)
        {
            if ($(this).parents('.aw-item-content').find('.aw-article-comment-box').css('display') == 'block')
            {
               $(this).parents('.aw-item-content').find('.aw-article-comment-box').fadeOut();
            }
            else
            {
                $(this).parents('.aw-item-content').find('.aw-article-comment-box').fadeIn();
            }
        }
        else
        {
            $(this).parents('.aw-item-content').append(Hogan.compile(AW_TEMPLATE.articleCommentBox).render(
            {
                'at_uid' : $(this).attr('data-id'),
                'article_id' : $('.aw-mod-article-replay-box input[name="article_id"]').val()
            }));
        }
    });
}

function insertVoteBar(data)
{
    // {element:this,agree_count:20,flag:0,user_name:G_USER_NAME,answer_id:1230};
    switch (data.flag)
    {
	    case 1:
	        up_class = 'active';
	        down_class = '';
	        break;

	    case -1:
	        up_class = '';
	        down_class = 'active';
	        break;

	    case 0:
	        up_class = '';
	        down_class = '';
	        break;
    }

    $(data.element).parent().prepend(Hogan.compile(AW_TEMPLATE.voteBar).render(
    {
        'agree_count': data.agree_count,
        'up_class': up_class,
        'down_class': down_class,
        'user_name': data.user_name,
        'answer_id': data.answer_id
    }));

    $(data.element).detach();
}

//赞成投票
function agreeVote(element, user_name, answer_id)
{
	$.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=1', function (result) {});

    //判断是否投票过
    if ($(element).parents('.aw-item').find('.aw-agree-by').text().match(user_name))
    {
        $.each($(element).parents('.aw-item').find('.aw-user-name'), function (i, e)
        {
            if ($(e).html() == user_name)
            {
                if ($(e).prev())
                {
                    $(e).prev().remove();
                }
                else
                {
                    $(e).next().remove();
                }

                $(e).remove();
            }
        });

        $(element).removeClass('active');

        if (parseInt($(element).parents('.aw-item').find('.aw-vote-bar-count').html()) != 0)
        {
            $(element).parents('.aw-item').find('.aw-vote-bar-count').html(parseInt($(element).parents('.aw-item').find('.aw-vote-bar-count').html())-1);
        }

        if ($(element).parents('.aw-item').find('.aw-agree-by a').length == 0)
        {
            $(element).parents('.aw-item').find('.aw-agree-by').hide();
        }
    }
    else
    {
        //判断是否第一个投票
        if ($(element).parents('.aw-item').find('.aw-agree-by .aw-user-name').length == 0)
        {
            $(element).parents('.aw-item').find('.aw-agree-by').append('<a class="aw-user-name">' + user_name + '</a>');
        }
        else
        {
            //插入动画效果
            $(element).parents('.aw-item').find('.aw-agree-by').append('<em>、</em><a class="aw-user-name">' + user_name + '</a>');
        }

        $(element).parents('.aw-item').find('.aw-vote-bar-count').html(parseInt($(element).parents('.aw-item').find('.aw-vote-bar-count').html())+1);

        $(element).parents('.aw-item').find('.aw-agree-by').show();
        $(element).parents('.aw-item').find('a.active').removeClass('active');
        $(element).addClass('active');
    }
}

//反对投票
function disagreeVote(element, user_name, answer_id)
{
    $.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=-1', function (result) {});

    //判断是否投票过
    if (!$(element).hasClass('active'))//没点亮反对
    {
        //删除赞同操作
        $.each($(element).parents('.aw-item').find('.aw-user-name'), function (i, e)
        {
            if ($(e).html() == user_name)
            {
                if ($(e).prev())
                {
                    $(e).prev().remove();
                }
                else
                {
                    $(e).next().remove();
                }

                $(e).remove();
            }
        });

        if ($(element).prev().prev().hasClass('active'))
        {
            if (parseInt($(element).parents('.aw-item').find('.aw-vote-bar-count').html()) != 0)
            {
                $(element).parents('.aw-item').find('.aw-vote-bar-count').html(parseInt($(element).parents('.aw-item').find('.aw-vote-bar-count').html())-1);
            }
        }

        $(element).parents('.aw-item').find('a.active').removeClass('active');
        $(element).addClass('active');

        //判断赞同来自内是否有人
        if ($(element).parents('.aw-item').find('.aw-agree-by a').length == 0)
        {
            $(element).parents('.aw-item').find('.aw-agree-by').hide();
        }
    }
    else
    {
        $(element).removeClass('active');
    }
}

//插入话题编辑box
function init_topic_edit_box(selector) //selector -> .aw-edit-topic
{
    $(selector).click(function ()
    {
    	$(this).parents('.aw-item').css('z-index',1000);
        var _aw_topic_editor_element = $(this).parents('.aw-topic-editor');
        var data_id = _aw_topic_editor_element.attr('data-id');
        var data_type = _aw_topic_editor_element.attr('data-type');

        if (!_aw_topic_editor_element.find('.aw-topic-name').children().children().hasClass('aw-close'))
        {
            _aw_topic_editor_element.find('.aw-topic-name').children().append('<button type="button" class="close aw-close">×</button>');
        }
        else
        {
            _aw_topic_editor_element.find('.aw-close').show();
        }

        /*判断插入编辑box*/
        if (_aw_topic_editor_element.find('.aw-edit-topic-box').length == 0)
        {
            _aw_topic_editor_element.append(AW_TEMPLATE.editTopicBox);

            //给编辑box取消按钮添加事件
            _aw_topic_editor_element.find('.close-edit').click(function ()
            {
                _aw_topic_editor_element.find('.aw-edit-topic-box').hide();
                _aw_topic_editor_element.find('.aw-close').hide();
                _aw_topic_editor_element.find('.aw-edit-topic').show();
                $(this).parents('.aw-item').attr('style','');
            });

            _aw_topic_editor_element.find('.submit-edit').click(function ()
            {
                if (_aw_topic_editor_element.find('#aw_edit_topic_title').val() != ''){
                    switch (data_type)
                    {
                    case 'publish':
                        _aw_topic_editor_element.prepend('<a href="javascript:;" class="aw-topic-name"><span>' + _aw_topic_editor_element.find('#aw_edit_topic_title').val() + '<button class="close aw-close" type="button" onclick="$(this).parents(\'.aw-topic-name\').remove();">×</button></span><input type="hidden" value="' + _aw_topic_editor_element.find('#aw_edit_topic_title').val() + '" name="topics[]" /></a>').hide().fadeIn();

                        _aw_topic_editor_element.find('#aw_edit_topic_title').val('');
                        break;

                    case 'question':
                        $.post(G_BASE_URL + '/topic/ajax/save_topic_relation/', 'type=question&item_id=' + data_id + '&topic_title=' + encodeURIComponent(_aw_topic_editor_element.find('#aw_edit_topic_title').val()), function (result)
                        {
                            if (result.errno != 1)
                            {
                                $.alert(result.err);

                                return false;
                            }

                            _aw_topic_editor_element.prepend('<a href="' + G_BASE_URL + '/topic/' + result.rsm.topic_id + '" class="aw-topic-name" data-id="' + result.rsm.topic_id + '"><span>' + _aw_topic_editor_element.find('#aw_edit_topic_title').val() + '<button class="close aw-close">×</button></span></a>').hide().fadeIn();

                            _aw_topic_editor_element.find('#aw_edit_topic_title').val('');
                        }, 'json');
                        break;

                    case 'article':
                        $.post(G_BASE_URL + '/topic/ajax/save_topic_relation/', 'type=article&item_id=' + data_id + '&topic_title=' + encodeURIComponent(_aw_topic_editor_element.find('#aw_edit_topic_title').val()), function (result)
                        {
                            if (result.errno != 1)
                            {
                                $.alert(result.err);

                                return false;
                            }

                            _aw_topic_editor_element.prepend('<a href="' + G_BASE_URL + '/topic/' + result.rsm.topic_id + '" class="aw-topic-name" data-id="' + result.rsm.topic_id + '"><span>' + _aw_topic_editor_element.find('#aw_edit_topic_title').val() + '<button class="close aw-close">×</button></span></a>').hide().fadeIn();

                            _aw_topic_editor_element.find('#aw_edit_topic_title').val('');
                        }, 'json');
                        break;


                    case 'topic':
                        $.post(G_BASE_URL + '/topic/ajax/save_related_topic/topic_id-' + data_id, 'topic_title=' + encodeURIComponent(_aw_topic_editor_element.find('#aw_edit_topic_title').val()), function (result)
                        {
                            if (result.errno != 1)
                            {
                                $.alert(result.err);

                                return false;
                            }

                            _aw_topic_editor_element.prepend('<a href="' + G_BASE_URL + '/favorite/tag-' + encodeURIComponent(_aw_topic_editor_element.find('#aw_edit_topic_title').val()) + '" class="aw-topic-name"><span>' + _aw_topic_editor_element.find('#aw_edit_topic_title').val() + '<button class="close aw-close">x</button></span></a>').hide().fadeIn();

                            _aw_topic_editor_element.find('#aw_edit_topic_title').val('');
                        }, 'json');
                        break;

                    case 'favorite':
                        $.post(G_BASE_URL + '/favorite/ajax/update_favorite_tag/', 'answer_id=' + data_id + '&tags=' + encodeURIComponent(_aw_topic_editor_element.find('#aw_edit_topic_title').val()), function (result)
                        {
                            if (result.errno != 1)
                            {
                                $.alert(result.err);

                                return false;
                            }

                            _aw_topic_editor_element.prepend('<a href="' + G_BASE_URL + '/favorite/tag-' + encodeURIComponent(_aw_topic_editor_element.find('#aw_edit_topic_title').val()) + '" class="aw-topic-name"><span>' + _aw_topic_editor_element.find('#aw_edit_topic_title').val() + '<button class="close aw-close">x</button></span></a>').hide().fadeIn();

                            _aw_topic_editor_element.find('#aw_edit_topic_title').val('');
                        }, 'json');
                        break;
                    }
                }
            });
        }

        bind_dropdown_list($(this).parents('.aw-topic-editor').find('#aw_edit_topic_title'),'topic');
        $(this).parents('.aw-topic-editor').find('.aw-edit-topic-box').fadeIn();

        // 是否允许创建新话题
        if (!G_CAN_CREATE_TOPIC)
        {
            $(this).parents('.aw-topic-editor').find('.submit-edit').hide();
        }

        /*隐藏话题编辑按钮*/
        $(this).hide();
    });
}

/*
 **	功能: 用户头像提示box效果
 **
 *  @param
 *  type : user/topic
 *	nTop    : 焦点到浏览器上边距
 *	nRight  : 焦点到浏览器右边距
 *	nBottom : 焦点到浏览器下边距
 *	left    : 焦点距离文档左偏移量
 *	top     : 焦点距离文档上偏移量
 **
 */
var cashUserData = [],
    cashTopicData = [],
    cardBoxTimeout;

function show_card_box(selector, type, time) //selector -> .aw-user-name/.aw-topic-name
{
    if (time)
    {
        var time = time;
    }
    else
    {
        var time = 300;
    }
    $(document).on('mouseover', selector, function ()
    {
        clearTimeout(cardBoxTimeout);
        var _this = $(this);
        card_box_show = setTimeout(function ()
        {
            //判断用户id or 话题id 是否存在
            if (_this.attr('data-id'))
            {
                 switch (type)
                {
                    case 'user' :
                        //检查是否有缓存
                        if (cashUserData.length == 0)
                        {
                            //发送请求
                            _getdata('user', '/people/ajax/user_info/uid-');
                        }
                        else
                        {
                            var flag = 0;
                            //遍历缓存中是否含有此id的数据
                            _checkcash('user');
                            if (flag == 0)
                            {
                                _getdata('user', '/people/ajax/user_info/uid-');
                            }
                        }
                    break;

                    case 'topic' :
                        //检查是否有缓存
                        if (cashTopicData.length == 0)
                        {
                            _getdata('topic', '/topic/ajax/topic_info/topic_id-');
                        }
                        else
                        {
                            var flag = 0;
                            //遍历缓存中是否含有此id的数据
                            _checkcash('topic');
                            if (flag == 0)
                            {
                                _getdata('topic', '/topic/ajax/topic_info/topic_id-');
                            }
                        }
                    break;
                }
            }

            //通用获取数据
            function _getdata(type, url)
            {
                if (type == 'user')
                {
                    $.get(G_BASE_URL + url + _this.attr('data-id'), function(result)
                    {
                        var focus = result.focus,
                            focusTxt,
                            verified = result.verified,
                            userName = "'" + result.user_name + "'";

                        if (focus == 1)
                        {
                            focus = '';
                            focusTxt = '取消关注';
                        }
                        else
                        {
                            focus = 'aw-active';
                            focusTxt = '关注';
                        }

                        if(result.verified == 'enterprise')
                        {
                            verified_enterprise = 'icon-v i-ve';
                            verified_title = '企业认证';
                        }else if(result.verified == 'personal')
                        {
                            verified_enterprise = 'icon-v';
                            verified_title = '个人认证';
                        }else
                        {
                            verified_enterprise = verified_title = '';
                        }
                        //动态插入盒子
                        if (!$('#aw-ajax-box .box').length)
                        {
                            var boxStyle = _init(), boxDiv = '<div class="box" style="position:absolute;left:'+ boxStyle.left +'px;top:'+ boxStyle.top +'px;"></div>';
                            $('#aw-ajax-box').append(boxDiv);
                        }
                        else
                        {
                            $('#aw-ajax-box .box').css(_init());
                        }
                        $('#aw-ajax-box .box').html(Hogan.compile(AW_TEMPLATE.userCard).render(
                        {
                            'verified_enterprise' : verified_enterprise,
                            'verified_title' : verified_title,
                            'uid': result.uid,
                            'ask_name':  "'" + result.user_name + "'",
                            'avatar_file': result.avatar_file,
                            'user_name': result.user_name,
                            'reputation': result.reputation,
                            'agree_count': result.agree_count,
                            'signature': result.signature,
                            'url' : result.url,
                            'category_enable' : result.category_enable,
                            'focus': focus,
                            'focusTxt': focusTxt
                        }));
                        //判断是否为游客or自己
                        if (G_USER_ID <= 0 || G_USER_ID == result.uid || result.uid < 0)
                        {
                            $('#aw-card-tips .aw-mod-footer').hide();
                        }
                        $('#aw-card-tips').fadeIn();
                        //缓存
                        cashUserData.push($('#aw-ajax-box .box').html());
                    }, 'json');
                }
                if (type == 'topic')
                {
                    $.get(G_BASE_URL + url + _this.attr('data-id'), function(result)
                    {
                        var focus = result.focus,
                            focusTxt;
                            if (focus > 0)
                            {
                                focus = '';
                                focusTxt = _t('取消关注');
                            }
                            else
                            {
                                focus = 'aw-active';
                                focusTxt = _t('关注');
                            }
                            //动态插入盒子
                            if (!$('#aw-ajax-box .box').length)
                            {
                                var boxStyle = _init(), boxDiv = '<div class="box" style="position:absolute;left:'+ boxStyle.left +'px;top:'+ boxStyle.top +'px;"></div>';
                                $('#aw-ajax-box').append(boxDiv);
                            }
                            else
                            {
                                $('#aw-ajax-box .box').css(_init());
                            }
                            $('#aw-ajax-box .box').html(Hogan.compile(AW_TEMPLATE.topicCard).render(
                            {
                                'topic_id': result.topic_id,
                                'topic_pic': result.topic_pic,
                                'topic_title': result.topic_title,
                                'topic_description': result.topic_description,
                                'discuss_count': result.discuss_count,
                                'focus_count': result.focus_count,
                                'focus': focus,
                                'focusTxt': focusTxt,
                                'url' : result.url
                            }));
                            //判断是否为游客
                            if (G_USER_ID == 0)
                            {
                                $('#aw-card-tips .aw-mod-footer .focus').hide();
                            }
                            $('#aw-card-tips').fadeIn();
                            //缓存
                            cashTopicData.push($('#aw-ajax-box .box').html());
                    }, 'json');
                }
            }

            //检测缓存
            function _checkcash(type)
            {
                if (type == 'user')
                {
                    $.each(cashUserData, function (i, a)
                    {
                        if (a.match('data-id="' + _this.attr('data-id') + '"'))
                        {
                            var boxStyle = _init();
                            $('#aw-ajax-box .box').css({
                                'left': boxStyle.left,
                                'top': boxStyle.top
                            })
                            $('#aw-ajax-box .box').html(a);
                            $('#aw-card-tips').removeAttr('style').fadeIn();
                            flag = 1;
                        }
                    });
                }
                if (type == 'topic')
                {

                    $.each(cashTopicData, function (i, a)
                    {
                        if (a.match('data-id="' + _this.attr('data-id') + '"'))
                        {
                            var boxStyle = _init();
                            $('#aw-ajax-box .box').css({
                                'left': boxStyle.left,
                                'top': boxStyle.top
                            })
                            $('#aw-ajax-box .box').html(a);
                            $('#aw-card-tips').removeAttr('style').fadeIn();
                            flag = 1;
                        }
                    });
                }
            }

            //cardbox初始化
            function _init()
            {
                var left = _this.offset().left,
                    top = _this.offset().top,
                    nTop = top - $(window).scrollTop(),
                    nBottom = $(window).height() - _this.innerHeight() - nTop,
                    cardBoxWidth = ($('#aw-card-tips').innerWidth()) ? $('#aw-card-tips').innerWidth() : 270;
                //判断下边距不足的情况
                if ($('#aw-card-tips').innerHeight() + _this.children().innerHeight() > nBottom)
                {
                    top = top - $('#aw-card-tips').innerHeight() - 5;
                }
                else
                {
                    top = top + _this.children().innerHeight() + 5;
                }
                if (cardBoxWidth + left > $(window).width()) //判断右边距不足的情况
                {
                    left = left - cardBoxWidth + _this.children().innerWidth();
                }

                return {'left': left, 'top': top};

            }
        }, time);
    });

    $(document).on('mouseout', selector, function ()
    {
        clearTimeout(card_box_show);
        cardBoxTimeout = setTimeout(function ()
        {
            $('#aw-card-tips').fadeOut();
        }, 600);
    });
}

/*邀请*/
function invite_user(obj, img)
{
	var _this = obj;

    $.post(G_BASE_URL + '/question/ajax/save_invite/',
    {
        'question_id': QUESTION_ID,
        'uid': _this.attr('data-id')
    }, function (result)
    {
        if (result.errno != -1)
        {
            if ($(_this).parents('.aw-invite-box').find('.invite-list a').length == 0)
            {
                $(_this).parents('.aw-invite-box').find('.invite-list').show();
            }
            $(_this).parents('.aw-invite-box').find('.invite-list').append(' <a class="aw-text-color-999 invite-list-user" data-toggle="tooltip" data-placement="right" data-original-title="'+ _this.attr('data-value') +'"><img src='+ img +' /></a>');
            _this.removeClass('aw-active').attr('onclick','disinvite_user($(this))').text('取消邀请');
            _this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text(parseInt(_this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text()) + 1);
        }
        else if (result.errno == -1)
        {
            $.alert(result.err);
        }
    }, 'json');
}

/*取消邀请*/
function disinvite_user(obj)
{
    var _this = obj;

    $.get(G_BASE_URL + '/question/ajax/cancel_question_invite/question_id-' + QUESTION_ID + "__recipients_uid-" + _this.attr('data-id'), function (result)
    {
        if (result.errno != -1)
        {
            $.each($('.aw-question-detail-title .invite-list a'), function (i, e)
            {
                if ($(this).attr('data-original-title') == _this.parents('.main').find('.aw-user-name').text())
                {
                    $(this).detach();
                }
            });
            _this.addClass('aw-active').attr('onclick','invite_user($(this),$(this).parents(\'li\').find(\'img\').attr(\'src\'))').text('邀请');
            _this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text(parseInt(_this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text()) - 1);
            if ($(_this).parents('.aw-invite-box').find('.invite-list').children().length == 0)
            {
                $(_this).parents('.aw-invite-box').find('.invite-list').hide();
            }
        }
    });
}

/*动态插入下拉菜单模板*/
function add_dropdown_list(selector, data, selected)
{
    $(selector).append(Hogan.compile(AW_TEMPLATE.dropdownList).render(
    {
        'items': data
    }));

    $(selector + ' .dropdown-menu li a').click(function ()
    {
        $('#aw-topic-tags-select').html($(this).text());
    });

    if (selected)
    {
        $(selector + " .dropdown-menu li a[data-value='" + selected + "']").click();
    }
}

/* 下拉菜单功能绑定 */
function bind_dropdown_list(selector, type)
{
    if (type == 'search')
    {
        $(selector).focus(function()
        {
            $(selector).parent().find('.aw-dropdown').show();
        });
    }
    $(selector).keyup(function(e)
    {
        if (type == 'search')
        {
            $(selector).parent().find('.search').show().children('a').text($(selector).val());
        }
        //话题插入按,号自动插入
        if (type == 'topic')
        {
            if (e.which == 188)
            {
                if ($('.aw-edit-topic-box #aw_edit_topic_title').val() != ',')
                {
                    $('.aw-edit-topic-box #aw_edit_topic_title').val( $('.aw-edit-topic-box #aw_edit_topic_title').val().substring(0,$('.aw-edit-topic-box #aw_edit_topic_title').val().length-1));
                    $('.aw-edit-topic-box .aw-topic-dropdown').hide();
                    $('.aw-edit-topic-box .submit-edit').click();
                }
                return false;
            }
        }
        if ($(selector).val().length >= 1)
        {
            get_dropdown_list($(this), type, $(selector).val());
        }
        else
        {
           $(selector).parent().find('.aw-dropdown').hide();
        }
    });

    $(selector).blur(function()
    {
        $(selector).parent().find('.aw-dropdown').delay(500).fadeOut(300);
    });
}

/* 下拉菜单数据获取 */
/*
*    type : search, publish, redirect, invite, inbox, topic_question, topic
*/
var dropdown_list_xhr;
function get_dropdown_list(selector, type, data)
{
    if (dropdown_list_xhr != undefined)
    {
        dropdown_list_xhr.abort(); //中止上一次ajax请求
    }
    var url;
    switch (type)
    {
        case 'search' :
            url = G_BASE_URL + '/search/ajax/search/?q=' + encodeURIComponent(data) + '&limit=5';
        break;

        case 'publish' :
            url = G_BASE_URL + '/search/ajax/search/?type=questions&q=' + encodeURIComponent(data) + '&limit=5';
        break;

        case 'redirect' :
            url = G_BASE_URL + '/search/ajax/search/?q=' + encodeURIComponent(data) + '&type=questions&limit=30';
        break;

        case 'invite' :
        case 'inbox' :
            url = G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent(data) + '&limit=10';
        break;

        case 'topic_question' :
            url = G_BASE_URL + '/search/ajax/search/?type=questions&q=' + encodeURIComponent(data) + '&topic_ids=' + CONTENTS_TOPIC_ID;
        break;

        case 'topic' :
            url = G_BASE_URL + '/search/ajax/search/?type=topics&q=' + encodeURIComponent(data) + '&limit=10';
        break;
    }

    dropdown_list_xhr = $.get(url, function(result)
    {
        if (result.length != 0 && dropdown_list_xhr != undefined)
        {
            $(selector).parent().find('.aw-dropdown-list').html(''); //清空内容
            switch (type)
            {
                case 'search' :
                    $.each(result, function(i, a)
                    {
                        switch (a.type)
                        {
                            case 'questions':
                                if (a.detail.best_answer > 0)
                                {
                                    var active = 'active';
                                }
                                else
                                {
                                    var active = ''
                                }

                                $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListQuestions).render(
                                {
                                    'url': a.url,
                                    'active': active,
                                    'content': a.name,
                                    'discuss_count': a.detail.answer_count
                                }));
                                break;

							case 'articles':
                                $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListArticles).render(
                                {
                                    'url': a.url,
                                    'content': a.name,
                                    'comments': a.detail.comments
                                }));
                                break;

                            case 'topics':
                                $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListTopics).render(
                                {
                                    'url': a.url,
                                    'name': a.name,
                                    'discuss_count': a.detail.discuss_count,
                                    'topic_id': a.detail.topic_id
                                }));
                                break;

                            case 'users':
                                if (a.detail.signature == '')
                                {
                                    var signature = _t('暂无介绍');
                                }
                                else
                                {
                                    var signature = a.detail.signature;
                                }

                                $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListUsers).render(
                                {
                                    'url': a.url,
                                    'img': a.detail.avatar_file,
                                    'name': a.name,
                                    'intro': signature
                                }));
                                break;
                        }
                    });
                break;

                case 'publish' :
                case 'topic_question' :
                    $.each(result, function (i, a)
                    {
                        $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.questionDropdownList).render(
                        {
                            'url': a.url,
                            'name': a.name
                        }));
                    });
                break;

                case 'topic' :
                    $.each(result, function (i, a)
                    {
                        $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.editTopicDorpdownList).render(
                        {
                            'name': a['name']
                        }));
                    });
                break;

                case 'redirect' :
                    $.each(result, function (i, a)
                    {
                        $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.questionRedirectList).render(
                        {
                            'url': "'" + G_BASE_URL + "/question/ajax/redirect/', 'item_id=" + $(selector).attr('data-id') + "&target_id=" + a['search_id'] + "'",
                            'name': a['name']
                        }));
                    });
                break;

                case 'inbox' :
                case 'invite' :
                    $.each(result, function (i, a)
                    {
                        $(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.inviteDropdownList).render(
                        {
                            'uid': a.uid,
                            'name': a.name,
                            'img': a.detail.avatar_file
                        }));
                    });
                break;
            }
            if (type == 'publish')
            {
                $(selector).parent().find('.aw-publish-suggest-question, .aw-publish-suggest-question .aw-dropdown-list').show();
            }
            else
            {
                $(selector).parent().find('.aw-dropdown').show().children().show();
                $(selector).parent().find('.title').hide();
                //关键词高亮
                $(selector).parent().find('.aw-dropdown-list li.question a').highText(data, 'b', 'active');
            }
        }else
        {
            $(selector).parent().find('.aw-dropdown').show().children('.title').html(_t('没有找到相关结果')).show();
            $(selector).parent().find('.aw-dropdown-list, .aw-publish-suggest-question').hide();
        }
    }, 'json');

}

function _quick_publish_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        $('#quick_publish_error em').html(result.err);
        $('#quick_publish_error').fadeIn();
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            window.location.reload();
        }
    }
}

/*修复focus时光标位置*/
function _fix_textarea_focus_cursor_position(elTextarea)
{
    if (/MSIE/.test(navigator.userAgent) || /Opera/.test(navigator.userAgent))
    {
        var rng = elTextarea.createTextRange();
        rng.text = elTextarea.value;
        rng.collapse(false);
    }
    else if (/WebKit/.test(navigator.userAgent))
    {
        elTextarea.select();
        window.getSelection().collapseToEnd();
    }
}

/*回复,评论@人功能*/
var at_user_lists_flag = 0, at_user_lists_index = 0;

function at_user_lists(selector) {
    $(selector).keyup(function (e) {
        init();

        var _this = $(this),
             flag = getCursorPosition($(this)[0]).start,
            key = e.which,
            cursor = $(this).get(0);
        if ($(this).val().charAt(flag - 1) == '@') {
            $('.content_cursor').html('').append($(this).val().substring(0, cursor.selectionStart).replace(/\n/g, '<br>') + '<b class="cursor_flag">flag</b>');
            if (!$('.aw-invite-dropdown')[0]) {
                $('#aw-ajax-box').append('<ul class="aw-invite-dropdown"></ul>');
            }
        } else {
            switch (key) {
                case 38:
                    if (at_user_lists_index == $('.aw-invite-dropdown li').length) {
                        at_user_lists_index--;
                    }
                    if (at_user_lists_index == 0) {
                        $('.aw-invite-dropdown li:last').addClass('active').siblings().removeClass('active');
                        at_user_lists_index = $('.aw-invite-dropdown li').length;
                    } else {
                        $('.aw-invite-dropdown li').eq(at_user_lists_index - 1).addClass('active').siblings().removeClass('active');
                        at_user_lists_index--;
                    }
                    break;
                case 40:
                    if (at_user_lists_flag == 0) {
                        $('.aw-invite-dropdown li:first').addClass('active').siblings().removeClass('active');
                        at_user_lists_flag = 1;
                    } else {
                        if (at_user_lists_index + 1 >= $('.aw-invite-dropdown li').length) {
                            $('.aw-invite-dropdown li:first').addClass('active').siblings().removeClass('active');
                            at_user_lists_index = 0;
                        } else {
                            $('.aw-invite-dropdown li').eq(at_user_lists_index + 1).addClass('active').siblings().removeClass('active');
                            at_user_lists_index++;
                        }
                    }
                    break;
                case 13:
                    $('.aw-invite-dropdown li').eq(at_user_lists_index).click();
                    break;
                default:
                    if ($('.aw-invite-dropdown')[0])
                    {
                        var ti = 0;
                        for (var i = flag; i--;) {
                            if ($(this).val().charAt(i) == "@") {
                                ti = i;
                                break;
                            }
                        }
                        if ($(this).val().substring(flag, ti).replace('@', '').match(/\s/)) {
                            $('.aw-invite-dropdown, .i-invite-triangle').addClass('hide');
                            return false;
                        }
                        $.get(G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent($(this).val().substring(flag, ti).replace('@', '')) + '&limit=10', function (result) {
                            if ($('.aw-invite-dropdown')[0]) {
                                if (result.length != 0) {
                                    $('.aw-invite-dropdown').html('');
                                    $.each(result, function (i, a) {
                                        $('.aw-invite-dropdown').append('<li><img src="' + a.detail.avatar_file + '"/><a>' + a.name + '</a></li>')
                                    });
                                    display();
                                    $('.aw-invite-dropdown').removeClass('hide');
                                    $('.aw-invite-dropdown li').click(function () {
                                        _this.val(_this.val().substring(0, ti) + '@' + $(this).find('a').html() + " ").focus();
                                        _fix_textarea_focus_cursor_position(_this);
                                        at_user_lists_index = 0;
                                        at_user_lists_flag = 0;
                                        $('.aw-invite-dropdown').detach();
                                    });
                                } else {
                                    $('.aw-invite-dropdown').addClass('hide');
                                }
                            }
                            if (_this.val().length == 0) {
                                $('.aw-invite-dropdown').addClass('hide');
                            }
                        }, 'json');
                    }
            }
        }
        if (selector == '#advanced_editor')
        {
            if ($(this).val() == '')
            {
                $('#markItUpPreviewFrames').html('');
            }
        }
    });

    $(selector).keydown(function (e) {
        var key = e.which;
        if ($('.aw-invite-dropdown').is(':visible')) {
            if (key == 38 || key == 40 || key == 13) {
                return false;
            }
        }else
        {
            return true;
        }
    });

    //初始化插入定位符
    function init() {
        if (!$('.content_cursor')[0]) {
            $('#aw-ajax-box').append('<span class="content_cursor"></span>');
        }
        $('#aw-ajax-box').find('.content_cursor').css({
            'left': parseInt($(selector).offset().left + parseInt($(selector).css('padding-left')) + 2),
            'top': parseInt($(selector).offset().top + parseInt($(selector).css('padding-left')))
        });
    }

    //初始化列表和三角型
    function display() {
        $('.aw-invite-dropdown').css({
            'left': $('.cursor_flag').offset().left,
            'top': $('.cursor_flag').offset().top + 20
        });
    }
}

function article_vote(element, article_id, rating)
{
	$.loading('show');

	if ($(element).hasClass('active'))
	{
		rating = 0;
	}

	$.post(G_BASE_URL + '/article/ajax/article_vote/', 'type=article&item_id=' + article_id + '&rating=' + rating, function (result) {
		$.loading('hide');

		if (result.errno != 1)
	    {
	        $.alert(result.err);
	    }
	    else
	    {
			if (rating == 0)
			{

				$(element).removeClass('active');
                $(element).find('b').html(parseInt($(element).find('b').html()) - 1);
			}
            else if (rating == -1)
            {
                if ($(element).parents('.aw-article-vote').find('.agree').hasClass('active'))
                {
                    $(element).parents('.aw-article-vote').find('b').html(parseInt($(element).parents('.aw-article-vote').find('b').html()) - 1);
                    $(element).parents('.aw-article-vote').find('a').removeClass('active');
                }
                $(element).addClass('active');
            }
			else
			{
				$(element).parents('.aw-article-vote').find('a').removeClass('active');
				$(element).addClass('active');
                $(element).find('b').html(parseInt($(element).find('b').html()) + 1);
			}
	    }
	}, 'json');
}

function comment_vote(element, comment_id, rating)
{
	$.loading('show');

	if ($(element).hasClass('active'))
	{
		rating = 0;
	}

	$.post(G_BASE_URL + '/article/ajax/article_vote/', 'type=comment&item_id=' + comment_id + '&rating=' + rating, function (result) {
		$.loading('hide');

		if (result.errno != 1)
	    {
	        $.alert(result.err);
	    }
	    else
	    {
			if (rating == 0)
			{
				$(element).removeClass('active');
				$(element).html($(element).html().replace(_t('我已赞'), _t('赞')));
			}
			else
			{
				$(element).addClass('active');
				$(element).html($(element).html().replace(_t('赞'), _t('我已赞')));
			}
	    }
	}, 'json');
}

function getCursorPosition(textarea)
{
    var rangeData = {
        text: "",
        start: 0,
        end: 0
    };

    textarea.focus();

    if (textarea.setSelectionRange) { // W3C
        rangeData.start = textarea.selectionStart;
        rangeData.end = textarea.selectionEnd;
        rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
    } else if (document.selection) { // IE
        var i,
            oS = document.selection.createRange(),
            // Don't: oR = textarea.createTextRange()
            oR = document.body.createTextRange();
        oR.moveToElementText(textarea);

        rangeData.text = oS.text;
        rangeData.bookmark = oS.getBookmark();

        // object.moveStart(sUnit [, iCount])
        // Return Value: Integer that returns the number of units moved.
        for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
            // Why? You can alert(textarea.value.length)
            if (textarea.value.charAt(i) == '\n') {
                i++;
            }
        }
        rangeData.start = i;
        rangeData.end = rangeData.text.length + rangeData.start;
    }

    return rangeData;
}

