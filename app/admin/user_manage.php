<?php
/*
+--------------------------------------------------------------------------
|   WeCenter [#RELEASE_VERSION#]
|   ========================================
|   by WeCenter Software
|   © 2011 - 2013 WeCenter. All Rights Reserved
|   http://www.wecenter.com
|   ========================================
|   Support: WeCenter@qq.com
|
+---------------------------------------------------------------------------
*/


if (!defined('IN_ANWSION'))
{
	die;
}

class user_manage extends AWS_ADMIN_CONTROLLER
{
	public function list_action()
	{
		if ($_POST['action'] == 'search')
		{
			foreach ($_POST as $key => $val)
			{
				if (in_array($key, array('user_name', 'email')))
				{
					$val = rawurlencode($val);
				}

				$param[] = $key . '-' . $val;
			}

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_setting('base_url') . '/?/admin/user_manage/list/' . implode('__', $param)
			), 1, null));
		}

		$where = array();

		if ($_GET['user_name'])
		{
			$where[] = "user_name LIKE '%" . $this->model('people')->quote($_GET['user_name']) . "%'";
		}

		if ($_GET['email'])
		{
			$where[] = "email = '" . $this->model('people')->quote($_GET['email']) . "'";
		}

		if ($_GET['group_id'])
		{
			$where[] = 'group_id = ' . intval($_GET['group_id']);
		}

		if ($_GET['ip'])
		{
			if (preg_match('/.*\.\\*$/i', $_GET['ip']))
			{
				$ip_base = ip2long(str_replace('*', '0', $_GET['ip']));

				$where[] = 'last_ip BETWEEN ' . $this->model('people')->quote($_GET['ip_base']) . ' AND ' . ($this->model('people')->quote($_GET['ip_base']) + 255);
			}
			else
			{
				$where[] = 'last_ip = ' . ip2long($_GET['ip']);
			}
		}

		if ($_GET['integral_min'])
		{
			$where[] = 'integral >= ' . intval($_GET['integral_min']);
		}

		if ($_GET['integral_max'])
		{
			$where[] = 'integral <= ' . intval($_GET['integral_max']);
		}

		if ($_GET['reputation_min'])
		{
			$where[] = 'reputation >= ' . intval($_GET['reputation_min']);
		}

		if ($_GET['reputation_max'])
		{
			$where[] = 'reputation <= ' . intval($_GET['reputation_max']);
		}

		if ($_GET['job_id'])
		{
			$where[] = 'job_id = ' . intval($_GET['job_id']);
		}

		if ($_GET['province'])
		{
			$where[] = "province = '" . $this->model('people')->quote($_GET['province']) . "'";
		}

		if ($_GET['city'])
		{
			$where[] = "city = '" . $this->model('people')->quote($_GET['city']) . "'";
		}

		if ($_GET['type'] == 'forbidden')
		{
			$where[] = "forbidden = 1";
		}

		$user_list = $this->model('people')->fetch_page('users', implode(' AND ', $where), 'uid DESC', $_GET['page'], $this->per_page);

		$total_rows = $this->model('people')->found_rows();

		$url_param = array();

		$url_param[] = 'type-' . $_GET['type'];

		foreach($_GET as $key => $val)
		{
			if (!in_array($key, array('app', 'c', 'act', 'page')))
			{
				$url_param[] = $key . '-' . $val;
			}
		}

		$search_url = 'admin/user_manage/list/' . implode('__', $url_param);

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_setting('base_url') . '/?/' . $search_url,
			'total_rows' => $total_rows,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('会员列表'), "admin/user_manage/list/");

		TPL::assign('system_group', $this->model('account')->get_user_group_list(0));
		TPL::assign('job_list', $this->model('work')->get_jobs_list());
		TPL::assign('search_url', $search_url);
		TPL::assign('total_rows', $total_rows);
		TPL::assign('list', $user_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(402));
		TPL::output('admin/user_manage/list');
	}

	public function group_list_action()
	{
		$this->crumb(AWS_APP::lang()->_t('用户组管理'), "admin/user_manage/group_list/");

		TPL::assign('mem_group', $this->model('account')->get_user_group_list(1));
		TPL::assign('system_group', $this->model('account')->get_user_group_list(0, 0));
		TPL::assign('custom_group', $this->model('account')->get_user_group_list(0, 1));
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(403));
		TPL::output('admin/user_manage/group_list');
	}

	public function group_save_ajax_action()
	{
		define('IN_AJAX', TRUE);

		if ($group_data = $_POST['group'])
		{
			foreach ($group_data as $key => $val)
			{
				if (empty($val['group_name']))
				{
					H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请输入用户组名称')));
				}

				if ($val['reputation_factor'])
				{
					if (!is_numeric($val['reputation_factor']) || floatval($val['reputation_factor']) < 0)
					{
						H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('威望系数必须为大于或等于 0')));
					}

					if (!is_numeric($val['reputation_lower']) || floatval($val['reputation_lower']) < 0 || !is_numeric($val['reputation_higer']) || floatval($val['reputation_higer']) < 0)
					{
						H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('威望介于值必须为大于或等于 0')));
					}

					$val['reputation_factor'] = floatval($val['reputation_factor']);
				}

				$this->model('account')->update_user_group_data($key, $val);
			}
		}

		if ($group_new = $_POST['group_new'])
		{
			foreach ($group_new['group_name'] as $key => $val)
			{
				if (trim($group_new['group_name'][$key]))
				{
					$this->model('account')->add_user_group($group_new['group_name'][$key], 1, $group_new['reputation_lower'][$key], $group_new['reputation_higer'][$key], $group_new['reputation_factor'][$key]);
				}
			}
		}

		if ($group_ids = $_POST['group_ids'])
		{
			foreach ($group_ids as $key => $id)
			{
				$group_info = $this->model('account')->get_user_group_by_id($id);

				if ($group_info['custom'] == 1 OR $group_info['type'] == 1)
				{
					$this->model('account')->delete_user_group_by_id($id);
				}
				else
				{
					H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('系统用户组不可删除')));
				}
			}
		}

		AWS_APP::cache()->cleanGroup('users_group');

		H::ajax_json_output(AWS_APP::RSM($rsm_array, 1, null));
	}

	public function group_custom_save_ajax_action()
	{
		define('IN_AJAX', TRUE);

		if ($group_data = $_POST['group'])
		{
			foreach ($group_data as $key => $val)
			{
				if (empty($val['group_name']))
				{
					H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('请输入用户组名称')));
				}

				$this->model('account')->update_user_group_data($key, $val);
			}
		}

		if ($group_new = $_POST['group_new'])
		{
			foreach ($group_new['group_name'] as $key => $val)
			{
				if (trim($group_new['group_name'][$key]))
				{
					$this->model('account')->add_user_group($group_new['group_name'][$key], 0);
				}
			}
		}

		if ($group_ids = $_POST['group_ids'])
		{
			foreach ($group_ids as $key => $id)
			{
				$group_info = $this->model('account')->get_user_group_by_id($id);

				if ($group_info['custom'] == 1)
				{
					$this->model('account')->delete_user_group_by_id($id);
				}
				else
				{
					H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('系统用户组不可删除')));
				}
			}
		}

		AWS_APP::cache()->cleanGroup('users_group');

		if ($group_new OR $group_ids)
		{
			$rsm_array = array(
				'url' => get_setting('base_url') . '/?/admin/user_manage/group_list/r-' . rand(1, 999) . '#custom'
			);
		}

		H::ajax_json_output(AWS_APP::RSM($rsm_array, 1, null));
	}

	public function group_edit_action()
	{
		if (! $group = $this->model('account')->get_user_group_by_id($_GET['group_id']))
		{
			H::redirect_msg(AWS_APP::lang()->_t('用户组不存在'));
		}

		$this->crumb(AWS_APP::lang()->_t('用户组管理'), "admin/user_manage/group_list/");

		TPL::assign('group', $group);
		TPL::assign('group_pms', $group['permission']);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(403));
		TPL::output('admin/user_manage/group_edit');
	}

	public function group_edit_process_action()
	{
		$permission_array = array(
			'is_administortar',
			'is_moderator',
			'publish_question',
			'publish_approval',
			'publish_approval_time',
			'edit_question',
			'edit_topic',
			'manage_topic',
			'create_topic',
			'redirect_question',
			'upload_attach',
			'publish_url',
			'human_valid',
			'question_valid_hour',
			'answer_valid_hour',
			'visit_site',
			'visit_explore',
			'search_avail',
			'visit_question',
			'visit_topic',
			'visit_feature',
			'visit_people',
			'answer_show',
			'function_interval',
			'publish_article',
			'edit_article',
			'edit_question_topic',
			'publish_comment'
		);

		$group_setting = array();

		foreach ($permission_array as $permission)
		{
			if ($_POST[$permission])
			{
				$group_setting[$permission] = $_POST[$permission];
			}
		}

		$this->model('account')->update_user_group_data($_GET['group_id'], array(
			'permission' => serialize($group_setting)
		));

		AWS_APP::cache()->cleanGroup('users_group');

		H::ajax_json_output(AWS_APP::RSM(null, 1, AWS_APP::lang()->_t('用户组权限已更新')));
	}

	/**
	 * 修改用户资料
	 */
	public function edit_action()
	{
		if (!$user = $this->model('account')->get_user_info_by_uid($_GET['uid'], TRUE))
		{
			H::redirect_msg(AWS_APP::lang()->_t('用户不存在'));
		}

		$this->crumb(AWS_APP::lang()->_t('编辑用户资料'), "admin/user_manage/list/");

		TPL::assign('job_list', $this->model('work')->get_jobs_list());

		TPL::assign('system_group', $this->model('account')->get_user_group_list(0));

		TPL::assign('user', $user);

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(402));

		TPL::output('admin/user_manage/edit');
	}

	public function user_save_ajax_action()
	{
		define('IN_AJAX', TRUE);

		if ($_POST['uid'])
		{
			if (!$user_info = $this->model('account')->get_user_info_by_uid($_POST['uid']))
			{
				H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('用户不存在')));
			}

			if ($_POST['user_name'] != $user_info['user_name'] && $this->model('account')->get_user_info_by_username($_POST['user_name']))
			{
				H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('用户名已存在')));
			}

			if ($_POST['email'] != $user_info['email'] AND $this->model('account')->get_user_info_by_username($_POST['email']))
			{
				H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('E-mail 已存在')));
			}

			if ($_FILES['user_avatar']['name'])
			{
				AWS_APP::upload()->initialize(array(
					'allowed_types' => 'jpg,jpeg,png,gif',
					'upload_path' => get_setting('upload_dir') . '/avatar/' . $this->model('account')->get_avatar($user_info['uid'], '', 1),
					'is_image' => TRUE,
					'max_size' => get_setting('upload_avatar_size_limit'),
					'file_name' => $this->model('account')->get_avatar($user_info['uid'], '', 2),
					'encrypt_name' => FALSE
				))->do_upload('user_avatar');

				if (AWS_APP::upload()->get_error())
				{
					switch (AWS_APP::upload()->get_error())
					{
						default:
							H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('错误代码') . ': ' . AWS_APP::upload()->get_error()));
						break;

						case 'upload_invalid_filetype':
							H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('文件类型无效')));
						break;

						case 'upload_invalid_filesize':
							H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('文件尺寸过大, 最大允许尺寸为 %s KB', get_setting('upload_size_limit'))));
						break;
					}
				}

				if (! $upload_data = AWS_APP::upload()->data())
				{
					H::ajax_json_output(AWS_APP::RSM(null, '-1', AWS_APP::lang()->_t('上传失败, 请与管理员联系')));
				}

				if ($upload_data['is_image'] == 1)
				{
					foreach(AWS_APP::config()->get('image')->avatar_thumbnail AS $key => $val)
					{
						$thumb_file[$key] = $upload_data['file_path'] . $this->model('account')->get_avatar($user_info['uid'], $key, 2);

						AWS_APP::image()->initialize(array(
							'quality' => 90,
							'source_image' => $upload_data['full_path'],
							'new_image' => $thumb_file[$key],
							'width' => $val['w'],
							'height' => $val['h']
						))->resize();
					}
				}

				$update_data['avatar_file'] = $this->model('account')->get_avatar($user_info['uid'], null, 1) . basename($thumb_file['min']);
			}

			if ($_POST['email'])
			{
				$update_data['email'] = htmlspecialchars($_POST['email']);
			}

			if ($_POST['invitation_available'])
			{
				$update_data['invitation_available'] = intval($_POST['invitation_available']);
			}

			$update_data['verified'] = $_POST['verified'];
			$update_data['valid_email'] = intval($_POST['valid_email']);
			$update_data['forbidden'] = intval($_POST['forbidden']);
			$update_data['sex'] = intval($_POST['sex']);

			if ($this->user_info['group_id'] == 1 AND $_POST['group_id'])
			{
				$update_data['group_id'] = intval($_POST['group_id']);
			}

			$update_data['province'] = htmlspecialchars($_POST['province']);
			$update_data['city'] = htmlspecialchars($_POST['city']);

			$update_data['job_id'] = intval($_POST['job_id']);
			$update_data['mobile'] = htmlspecialchars($_POST['mobile']);

			$this->model('account')->update_users_fields($update_data, $user_info['uid']);

			if ($_POST['delete_avatar'])
			{
				$this->model('account')->delete_avatar($user_info['uid']);
			}

			if ($_POST['password'])
			{
				$this->model('account')->update_user_password_ingore_oldpassword($_POST['password'], $user_info['uid'], fetch_salt(4));
			}

			$this->model('account')->update_users_attrib_fields(array(
				'signature' => htmlspecialchars($_POST['signature']),
				'qq' => htmlspecialchars($_POST['qq']),
				'homepage' => htmlspecialchars($_POST['homepage'])
			), $user_info['uid']);

			if ($_POST['user_name'] != $user_info['user_name'])
			{
				$this->model('account')->update_user_name($_POST['user_name'], $user_info['uid']);
			}

			H::ajax_json_output(AWS_APP::RSM(null, 1, AWS_APP::lang()->_t('用户资料更新成功')));
		}
		else
		{
			if (trim($_POST['user_name']) == '')
			{
				H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请输入用户名')));
			}

			if ($this->model('account')->check_username($_POST['user_name']))
			{
				H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('用户名已经存在')));
			}

			if ($this->model('account')->check_email($_POST['email']))
			{
				H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('E-Mail 已经被使用, 或格式不正确')));
			}

			if (strlen($_POST['password']) < 6 or strlen($_POST['password']) > 16)
			{
				H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('密码长度不符合规则')));
			}

			$uid = $this->model('account')->user_register($_POST['user_name'], $_POST['password'], $_POST['email']);

			$this->model('active')->set_user_email_valid_by_uid($uid);
			$this->model('active')->active_user_by_uid($uid);

			H::ajax_json_output(AWS_APP::RSM(array(
				'url' => get_setting('base_url') . '/?/admin/user_manage/list/'
			), 1, null));
		}
	}

	public function forbidden_user_action()
	{
		define('IN_AJAX', TRUE);

		$this->model('account')->forbidden_user_by_uid($_POST['uid'], $_POST['status'], $this->user_id);

		H::ajax_json_output(AWS_APP::RSM(null, 1, null));
	}

	public function user_add_action()
	{
		$this->crumb(AWS_APP::lang()->_t('添加用户'), "admin/user_manage/user_add/");

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(405));
		TPL::output('admin/user_manage/add');
	}

	public function invites_action()
	{
		$this->crumb(AWS_APP::lang()->_t('批量邀请'), "admin/user_manage/invites/");

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(406));
		TPL::output('admin/user_manage/invites');
	}

	public function invites_ajax_action()
	{
		if ($_POST['email_list'])
		{
			if ($emails = explode("\n", str_replace("\r", "\n", $_POST['email_list'])))
			{
				foreach($emails as $key => $email)
				{
					if (!H::valid_email($email))
					{
						continue;
					}

					$email_list[] = strtolower($email);
				}
			}
		}
		else
		{
			H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请输入邮箱地址')));
		}

		$this->model('invitation')->send_batch_invitations(array_unique($email_list), $this->user_id, $this->user_info['user_name']);

		H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('邀请已发送')));
	}

	public function job_list_action()
	{
		TPL::assign('job_list', $this->model('work')->get_jobs_list());

		$this->crumb(AWS_APP::lang()->_t('职位设置'), "admin/user_manage/job_list/");

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(407));
		TPL::output('admin/user_manage/job_list');
	}

	public function remove_job_action()
	{
		$this->model('work')->remove_job($_GET['job_id']);

		H::ajax_json_output(AWS_APP::RSM(null, 1, null));
	}

	public function add_job_ajax_action()
	{
		if (!$_POST['jobs'])
		{
			H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请输入职位名称')));
		}

		$job_list = array();

		if ($job_list_tmp = explode("\n", $_POST['jobs']))
		{
			foreach($job_list_tmp as $key => $job)
			{
				$job_name = trim(strtolower($job));

				if (!empty($job_name))
				{
					$job_list[] = $job_name;
				}
			}
		}
		else
		{
			$job_list[] = $_POST['jobs'];
		}

		foreach($job_list as $key => $val)
		{
			$this->model('work')->add_job($val);
		}

		H::ajax_json_output(AWS_APP::RSM(null, 1, null));
	}

	public function save_job_ajax_action()
	{
		if ($_POST['job_list'])
		{
			foreach($_POST['job_list'] as $key => $val)
			{
				$this->model('work')->update_job($key, array(
					'job_name' => $val,
				));
			}
		}

		H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('职位列表更新成功')));
	}

	public function integral_add_ajax_action()
	{
		if (!$_POST['uid'])
		{
			H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请选择用户进行操作')));
		}

		if (!$_POST['note'])
		{
			H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请填写理由')));
		}

		$this->model('integral')->process($_POST['uid'], 'AWARD', $_POST['integral'], $_POST['note']);

		H::ajax_json_output(AWS_APP::RSM(array('url' => get_setting('base_url') . '/?/admin/user_manage/integral_log/uid-' . $_POST['uid']), 1, null));
	}

	public function verify_approval_list_action()
	{
		$approval_list = $this->model('verify')->approval_list($_GET['page'], $_GET['status'], $this->per_page);

		$total_rows = $this->model('verify')->found_rows();

		foreach ($approval_list AS $key => $val)
		{
			if (!$uids[$val['uid']])
			{
				$uids[$val['uid']] = $val['uid'];
			}
		}

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_setting('base_url') . '/?/admin/user_manage/verify_approval_list/status-' . $_GET['status'],
			'total_rows' => $total_rows,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('认证审核'), 'admin/user_manage/verify_approval_list/');

		TPL::assign('users_info', $this->model('account')->get_user_info_by_uids($uids));
		TPL::assign('approval_list', $approval_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(401));

		TPL::output('admin/user_manage/verify_approval_list');
	}

	public function register_approval_list_action()
	{
		if (get_setting('register_valid_type') != 'approval')
		{
			H::redirect_msg(AWS_APP::lang()->_t('未启用新用户注册审核'));
		}

		$user_list = $this->model('people')->fetch_page('users', 'group_id = 3', 'uid ASC', $_GET['page'], $this->per_page);

		$total_rows = $this->model('people')->found_rows();

		TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
			'base_url' => get_setting('base_url') . '/?/admin/user_manage/register_approval_list/',
			'total_rows' => $total_rows,
			'per_page' => $this->per_page
		))->create_links());

		$this->crumb(AWS_APP::lang()->_t('注册审核'), 'admin/user_manage/register_approval_list/');

		TPL::assign('list', $user_list);
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(408));

		TPL::output('admin/user_manage/register_approval_list');
	}

	public function register_approval_process_action()
	{
		if (!is_array($_POST['approval_uids']))
		{
			H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请选择条目进行操作')));
		}

		switch ($_POST['batch_type'])
		{
			case 'approval':
				foreach ($_POST['approval_uids'] AS $approval_uid)
				{
					$this->model('active')->active_user_by_uid($approval_uid);;
				}
			break;

			case 'decline':
				foreach ($_POST['approval_uids'] AS $approval_uid)
				{
					if ($user_info = $this->model('account')->get_user_info_by_uid($approval_uid))
					{
						if ($user_info['email'])
						{
							$this->model('email')->action_email('REGISTER_DECLINE', $user_info['email'], null, array(
								'message' => htmlspecialchars($_POST['reason'])
							));
						}

						$this->model('system')->remove_user_by_uid($approval_uid, true);
					}
				}
			break;
		}

		H::ajax_json_output(AWS_APP::RSM(null, 1, null));
	}

	public function verify_approval_edit_action()
	{
		if (!$verify_apply = $this->model('verify')->fetch_apply($_GET['id']))
		{
			H::redirect_msg(AWS_APP::lang()->_t('审核认证不存在'));
		}

		TPL::assign('verify_apply', $verify_apply);
		TPL::assign('user', $this->model('account')->get_user_info_by_uid($_GET['id']));

		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(401));

		$this->crumb(AWS_APP::lang()->_t('认证审核'), 'admin/user_manage/verify_approval_list/');
		$this->crumb($this->user['user_name'], 'admin/user_manage/verify_approval_edit/' . $_GET['id']);

		TPL::output('admin/user_manage/verify_approval_edit');
	}

	public function verify_approval_save_action()
	{
		if ($_POST['uid'])
		{
			$this->model('verify')->update_apply($_POST['uid'], $_POST['name'], $_POST['reason'], array(
				'id_code' => htmlspecialchars($_POST['id_code']),
				'contact' => htmlspecialchars($_POST['contact'])
			));
		}

		H::ajax_json_output(AWS_APP::RSM(array(
			'url' => get_setting('base_url') . '/?/admin/user_manage/verify_approval_list/'
		), 1, null));
	}

	public function verify_approval_batch_action()
	{
		if (!is_array($_POST['approval_ids']))
		{
			H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('请选择条目进行操作')));
		}

		switch ($_POST['batch_type'])
		{
			case 'approval':
			case 'decline':
				$func = $_POST['batch_type'] . '_verify';

				foreach ($_POST['approval_ids'] AS $approval_id)
				{
					$this->model('verify')->$func($approval_id);
				}
			break;
		}

		H::ajax_json_output(AWS_APP::RSM(null, 1, null));
	}

	public function integral_log_action()
	{
		if ($log = $this->model('integral')->fetch_page('integral_log', 'uid = ' . intval($_GET['uid']), 'time DESC', $_GET['page'], 50))
		{
			TPL::assign('pagination', AWS_APP::pagination()->initialize(array(
				'base_url' => get_setting('base_url') . '/?/admin/user_manage/integral_log/uid-' . intval($_GET['uid']),
				'total_rows' => $this->model('integral')->found_rows(),
				'per_page' => 50
			))->create_links());

			foreach ($log AS $key => $val)
			{
				$parse_items[$val['id']] = array(
					'item_id' => $val['item_id'],
					'action' => $val['action']
				);
			}

			TPL::assign('integral_log', $log);
			TPL::assign('integral_log_detail', $this->model('integral')->parse_log_item($parse_items));
		}

		TPL::assign('user', $this->model('account')->get_user_info_by_uid($_GET['uid']));
		TPL::assign('menu_list', $this->model('admin')->fetch_menu_list(402));

		$this->crumb(AWS_APP::lang()->_t('积分日志'), '/admin/user_manage/integral_log/uid-' . $_GET['uid']);

		TPL::output('admin/user_manage/integral_log');
	}

	public function remove_user_action()
	{
		define('IN_AJAX', TRUE);

		@set_time_limit(0);

		if ($user_info = $this->model('account')->get_user_info_by_uid($_POST['uid']))
		{
			if ($user_info['group_id'] == 1)
			{
				H::ajax_json_output(AWS_APP::RSM(null, -1, AWS_APP::lang()->_t('不允许删除管理员用户组用户')));
			}

			$this->model('system')->remove_user_by_uid($_POST['uid'], $_POST['remove_user_data']);
		}

		H::ajax_json_output(AWS_APP::RSM(array(
			'url' => get_setting('base_url') . '/?/admin/user_manage/list/'
		), 1, null));
	}
}